const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  registerSchema,
  loginSchema,
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
      email: data.email?.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: "user",
    });

    // Generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
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

    // Find user
    const user = await User.findOne(
      data.email ? { email: data.email.toLowerCase() } : { phone: data.phone },
    );

    if (!user) {
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
      return ApiResponse.unauthorized(res, {
        message: "ایمیل/شماره تلفن یا رمز عبور اشتباه است",
      });
    }

    // Generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
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

    // Verify refresh token
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

    // Generate new access token
    const payload = { userId: user._id.toString(), role: user.role };
    const newAccessToken = generateAccessToken(payload);

    // Update only access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

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
    clearAuthCookies(res);

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

    return ApiResponse.success(res, {
      message: "اطلاعات کاربر با موفقیت دریافت شد",
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};
