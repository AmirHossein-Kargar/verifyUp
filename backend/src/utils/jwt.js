const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const JWT_ALG = "HS256";
const JWT_ISSUER = process.env.JWT_ISSUER || "verifyup";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "verifyup-web";

const BASE_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// paths (least privilege)
const ACCESS_COOKIE = {
  ...BASE_COOKIE,
  path: "/api",
};

const REFRESH_COOKIE = {
  ...BASE_COOKIE,
  path: "/api/auth/refresh",
};

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: JWT_ALG,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: JWT_ALG,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [JWT_ALG],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return null;
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      algorithms: [JWT_ALG],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return null;
  }
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, {
    ...ACCESS_COOKIE,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...REFRESH_COOKIE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken", ACCESS_COOKIE);
  res.clearCookie("refreshToken", REFRESH_COOKIE);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
