const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  verifyEmailSchema,
  resendOtpSchema,
} = require("../validators/auth.validation");
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
  generateProfileImageToken,
} = require("../utils/jwt");
const { sanitizeUser } = require("../utils/sanitize");
const ApiResponse = require("../utils/response");
const {
  generateOtp,
  generateEmailToken,
  sendOtp,
  sendVerificationEmail,
} = require("../utils/verification");

// In-memory tracker for repeated failed login attempts per identifier
const failedLoginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_ID = 10;

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const exists = await User.findOne({
      $or: [{ email: data.email.toLowerCase() }, { phone: data.phone }],
    });

    if (exists) {
      return ApiResponse.conflict(res, {
        message: "کاربری با این ایمیل یا شماره تلفن قبلاً ثبت‌نام کرده است",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Generate OTP for phone verification
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Generate email verification token
    const emailToken = generateEmailToken();
    const emailTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (not verified yet)
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: "user",
      emailVerified: false,
      phoneVerified: false,
      phoneOtp: otp,
      phoneOtpExpires: otpExpires,
      emailVerificationToken: emailToken,
      emailVerificationExpires: emailTokenExpires,
    });

    // Send OTP to phone
    await sendOtp(data.phone, otp);

    // Send verification email
    await sendVerificationEmail(data.email, emailToken);

    // Return success response (user needs to verify)
    const responseData = {
      userId: user._id,
      email: user.email,
      phone: user.phone,
      requiresVerification: true,
    };

    // In development, include OTP in response for easy testing
    if (process.env.NODE_ENV === "development") {
      responseData.otp = otp; // ⚠️ Only for development!
      responseData.emailToken = emailToken; // ⚠️ Only for development!
    }

    return ApiResponse.created(res, {
      message:
        "ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل یا شماره موبایل خود را تأیید کنید.",
      data: responseData,
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    // Use a composite key of identifier + IP to better isolate brute-force attempts.
    const baseIdentifier = (data.email || data.phone || "").toLowerCase();
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";
    const identifier = baseIdentifier ? `${baseIdentifier}:${ip}` : ip;
    if (identifier) {
      const existing = failedLoginAttempts.get(identifier);
      const now = Date.now();
      if (existing && now - existing.firstAttemptAt < LOGIN_WINDOW_MS) {
        if (existing.count >= MAX_ATTEMPTS_PER_ID) {
          return ApiResponse.tooManyRequests(res, {
            message:
              "تعداد تلاش‌های ناموفق برای این حساب زیاد بوده است. لطفاً بعداً دوباره تلاش کنید.",
          });
        }
      } else if (existing) {
        // Window expired → reset counter
        failedLoginAttempts.delete(identifier);
      }
    }

    // Find user
    const user = await User.findOne(
      data.email ? { email: data.email.toLowerCase() } : { phone: data.phone },
    ).select("+passwordHash +tokenVersion"); // Explicitly select passwordHash and tokenVersion

    if (!user) {
      if (identifier) {
        const now = Date.now();
        const existing = failedLoginAttempts.get(identifier);
        if (!existing || now - existing.firstAttemptAt >= LOGIN_WINDOW_MS) {
          failedLoginAttempts.set(identifier, {
            count: 1,
            firstAttemptAt: now,
          });
        } else {
          existing.count += 1;
        }
      }

      return ApiResponse.unauthorized(res, {
        message: "ایمیل/شماره تلفن یا رمز عبور اشتباه است",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      if (identifier) {
        const now = Date.now();
        const existing = failedLoginAttempts.get(identifier);
        if (!existing || now - existing.firstAttemptAt >= LOGIN_WINDOW_MS) {
          failedLoginAttempts.set(identifier, {
            count: 1,
            firstAttemptAt: now,
          });
        } else {
          existing.count += 1;
        }
      }

      return ApiResponse.unauthorized(res, {
        message: "ایمیل/شماره تلفن یا رمز عبور اشتباه است",
      });
    }

    // Check if user is verified
    if (!user.emailVerified && !user.phoneVerified) {
      return ApiResponse.forbidden(res, {
        message:
          "حساب کاربری شما هنوز تأیید نشده است. لطفاً ایمیل یا شماره موبایل خود را تأیید کنید.",
      });
    }

    // Successful login → clear failed-attempts counter
    if (identifier) {
      failedLoginAttempts.delete(identifier);
    }

    // Generate tokens
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Set userRole cookie for Next.js middleware (client-readable)
    res.cookie("userRole", user.role, {
      httpOnly: false, // Must be readable by Next.js middleware
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const safeUser = sanitizeUser(user);
    if (user.profileImageId) {
      safeUser.profileImageToken = generateProfileImageToken(
        user._id.toString(),
        user.profileImageId.toString()
      );
    }

    // Return success response
    return ApiResponse.success(res, {
      message: "ورود با موفقیت انجام شد",
      data: { user: safeUser },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ApiResponse.unauthorized(res, {
        message: "توکن تازه‌سازی یافت نشد",
      });
    }

    // Verify refresh token signature & expiry
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      clearAuthCookies(res);
      return ApiResponse.unauthorized(res, {
        message: "توکن تازه‌سازی نامعتبر یا منقضی شده است",
      });
    }

    // Verify user still exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      clearAuthCookies(res);
      return ApiResponse.unauthorized(res, {
        message: "کاربر یافت نشد",
      });
    }

    // Enforce tokenVersion match to support rotation & logout-all
    if (
      typeof decoded.tokenVersion !== "number" ||
      decoded.tokenVersion !== user.tokenVersion
    ) {
      clearAuthCookies(res);
      return ApiResponse.unauthorized(res, {
        message: "این نشست دیگر معتبر نیست. لطفاً دوباره وارد شوید.",
      });
    }

    // Issue new tokens with the SAME tokenVersion (don't increment here)
    // Only increment tokenVersion on logout to invalidate all sessions
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return ApiResponse.success(res, {
      message: "توکن با موفقیت تازه‌سازی شد",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user?.userId) {
      // Invalidate all existing refresh tokens for this user by bumping tokenVersion.
      // This effectively logs the user out from all devices.
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { tokenVersion: 1 },
      });
    }

    clearAuthCookies(res);
    // Clear client-readable role cookie so middleware/UI don't see stale role
    res.clearCookie("userRole", {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return ApiResponse.success(res, {
      message: "خروج با موفقیت انجام شد",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return ApiResponse.notFound(res, {
        message: "کاربر یافت نشد",
      });
    }

    const safeUser = sanitizeUser(user);
    if (user.profileImageId) {
      safeUser.profileImageToken = generateProfileImageToken(
        req.user.userId,
        user.profileImageId.toString()
      );
    }

    return ApiResponse.success(res, {
      message: "اطلاعات کاربر با موفقیت دریافت شد",
      data: { user: safeUser },
    });
  } catch (err) {
    next(err);
  }
};

// Verify phone with OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const data = verifyOtpSchema.parse(req.body);

    const user = await User.findOne({ phone: data.phone }).select(
      "+phoneOtp +phoneOtpExpires +tokenVersion",
    );

    if (!user) {
      return ApiResponse.notFound(res, {
        message: "کاربری با این شماره تلفن یافت نشد",
      });
    }

    if (user.phoneVerified) {
      return ApiResponse.badRequest(res, {
        message: "شماره تلفن قبلاً تأیید شده است",
      });
    }

    if (!user.phoneOtp || !user.phoneOtpExpires) {
      return ApiResponse.badRequest(res, {
        message: "کد تأیید یافت نشد. لطفاً مجدداً درخواست دهید",
      });
    }

    if (new Date() > user.phoneOtpExpires) {
      return ApiResponse.badRequest(res, {
        message: "کد تأیید منقضی شده است. لطفاً مجدداً درخواست دهید",
      });
    }

    if (user.phoneOtp !== data.otp) {
      return ApiResponse.unauthorized(res, {
        message: "کد تأیید نامعتبر است",
      });
    }

    // Mark phone as verified
    user.phoneVerified = true;
    user.phoneOtp = null;
    user.phoneOtpExpires = null;
    await user.save();

    // Generate tokens and log user in
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.cookie("userRole", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, {
      message: "شماره تلفن با موفقیت تأیید شد",
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

// Verify email with token
exports.verifyEmail = async (req, res, next) => {
  try {
    const data = verifyEmailSchema.parse(req.body);

    const user = await User.findOne({
      emailVerificationToken: data.token,
    }).select(
      "+emailVerificationToken +emailVerificationExpires +tokenVersion",
    );

    if (!user) {
      return ApiResponse.notFound(res, {
        message: "توکن تأیید نامعتبر است",
      });
    }

    if (user.emailVerified) {
      return ApiResponse.badRequest(res, {
        message: "ایمیل قبلاً تأیید شده است",
      });
    }

    if (new Date() > user.emailVerificationExpires) {
      return ApiResponse.badRequest(res, {
        message: "توکن تأیید منقضی شده است",
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Generate tokens and log user in
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.cookie("userRole", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, {
      message: "ایمیل با موفقیت تأیید شد",
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

// Resend OTP
exports.resendOtp = async (req, res, next) => {
  try {
    const data = resendOtpSchema.parse(req.body);

    const user = await User.findOne({ phone: data.phone });

    if (!user) {
      return ApiResponse.notFound(res, {
        message: "کاربری با این شماره تلفن یافت نشد",
      });
    }

    if (user.phoneVerified) {
      return ApiResponse.badRequest(res, {
        message: "شماره تلفن قبلاً تأیید شده است",
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.phoneOtp = otp;
    user.phoneOtpExpires = otpExpires;
    await user.save();

    // Send OTP
    await sendOtp(data.phone, otp);

    const payload = {
      message: "کد تأیید مجدداً ارسال شد",
    };
    // In development, include OTP in data so client can read response.data.otp
    if (process.env.NODE_ENV === "development") {
      payload.data = { otp }; // ⚠️ Only for development!
    }

    return ApiResponse.success(res, payload);
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};
