const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const crypto = require("crypto");
const User = require("../models/User");
const {
  registerSchema,
  loginSchema,
  verifyMfaSchema,
} = require("../validators/auth.validation");
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
} = require("../utils/jwt");
const { sanitizeUser } = require("../utils/sanitize");
const ApiResponse = require("../utils/response");

// In-memory tracker for repeated failed login attempts per identifier
const failedLoginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_ID = 10;

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const exists = await User.findOne({
      $or: [
        data.email ? { email: data.email.toLowerCase() } : null,
        data.phone ? { phone: data.phone } : null,
      ].filter(Boolean),
    });

    if (exists) {
      return ApiResponse.conflict(res, {
        message: "کاربری با این ایمیل یا شماره تلفن قبلاً ثبت‌نام کرده است",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email?.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: "user",
    });

    // Generate tokens (include tokenVersion for rotation support)
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return success response
    return ApiResponse.created(res, {
      message: "ثبت‌نام با موفقیت انجام شد",
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
      data.email ? { email: data.email.toLowerCase() } : { phone: data.phone }
    );

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
      user.passwordHash
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

    // If admin has MFA enabled, require a valid TOTP code before issuing tokens
    if (user.role === "admin" && user.mfaEnabled) {
      if (!data.mfaCode) {
        return ApiResponse.unauthorized(res, {
          message:
            "برای ورود به حساب ادمین با احراز هویت دو مرحله‌ای، وارد کردن کد تأیید الزامی است.",
        });
      }

      const isValidTotp = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: data.mfaCode,
        window: 1, // allow slight clock skew
      });

      if (!isValidTotp) {
        // Count invalid MFA attempts toward the same login throttle identifier
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
          message: "کد تأیید دو مرحله‌ای نامعتبر است",
        });
      }
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

    // Return success response
    return ApiResponse.success(res, {
      message: "ورود با موفقیت انجام شد",
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

    // Rotate refresh token: bump tokenVersion and issue new pair
    user.tokenVersion += 1;
    await user.save();

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

    return ApiResponse.success(res, {
      message: "خروج با موفقیت انجام شد",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 1: Setup MFA for an authenticated admin.
 * Generates a TOTP secret and returns otpauth URL + base32 secret.
 * Does NOT enable MFA until verifyMfa is called.
 */
exports.setupMfa = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return ApiResponse.notFound(res, { message: "کاربر یافت نشد" });
    }

    if (user.role !== "admin") {
      return ApiResponse.forbidden(res, {
        message: "تنها ادمین‌ها می‌توانند احراز هویت دو مرحله‌ای را فعال کنند",
      });
    }

    if (user.mfaEnabled && user.mfaSecret) {
      return ApiResponse.badRequest(res, {
        message: "احراز هویت دو مرحله‌ای قبلاً برای این حساب فعال شده است",
      });
    }

    const secret = speakeasy.generateSecret({
      length: 20,
      name: "VerifyUp (Admin)",
      issuer: "VerifyUp",
    });

    user.mfaSecret = secret.base32;
    user.mfaBackupCodes = []; // reset any previous codes
    await user.save();

    return ApiResponse.success(res, {
      message:
        "کلید احراز هویت دو مرحله‌ای با موفقیت ایجاد شد. لطفاً آن را در برنامه احراز هویت خود اسکن کنید.",
      data: {
        otpauthUrl: secret.otpauth_url,
        secret: secret.base32,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2: Verify TOTP code and enable MFA.
 * Returns a one-time list of backup codes that should be stored securely by the admin.
 */
exports.verifyMfa = async (req, res, next) => {
  try {
    const data = verifyMfaSchema.parse(req.body);

    const user = await User.findById(req.user.userId);

    if (!user) {
      return ApiResponse.notFound(res, { message: "کاربر یافت نشد" });
    }

    if (user.role !== "admin") {
      return ApiResponse.forbidden(res, {
        message: "تنها ادمین‌ها می‌توانند احراز هویت دو مرحله‌ای را فعال کنند",
      });
    }

    if (!user.mfaSecret) {
      return ApiResponse.badRequest(res, {
        message:
          "کلید احراز هویت دو مرحله‌ای برای این حساب تنظیم نشده است. ابتدا مرحله ایجاد را انجام دهید.",
      });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: data.mfaCode,
      window: 1,
    });

    if (!isValid) {
      return ApiResponse.unauthorized(res, {
        message: "کد تأیید دو مرحله‌ای نامعتبر است",
      });
    }

    // Generate a small set of backup codes (one-time use, shown only once)
    const backupCodes = Array.from({ length: 5 }).map(() =>
      crypto.randomBytes(4).toString("hex")
    );

    user.mfaEnabled = true;
    user.mfaBackupCodes = backupCodes;
    await user.save();

    return ApiResponse.success(res, {
      message: "احراز هویت دو مرحله‌ای برای حساب ادمین با موفقیت فعال شد",
      data: {
        backupCodes,
      },
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

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return ApiResponse.notFound(res, {
        message: "کاربر یافت نشد",
      });
    }

    return ApiResponse.success(res, {
      message: "اطلاعات کاربر با موفقیت دریافت شد",
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};
