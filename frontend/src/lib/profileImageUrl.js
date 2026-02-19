/**
 * Profile image URL helper. In a separate module so Turbopack never strips or
 * rewrites it when used from dashboard/header/home. Same-origin proxy when token present.
 */
const API_SERVER_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "") ||
  "http://localhost:4000";

const PROFILE_IMAGE_PATH_REGEX = /\/api\/users\/profile-image\/([a-f0-9]{24})$/i;

/**
 * Get display URL for profile image. Prefer same-origin proxy when we have a token.
 * @param {string | null} path - Backend path e.g. /api/users/profile-image/ID or full backend URL
 * @param {string | null} token - JWT for image access (required for proxy)
 * @returns {string | null} URL to use in img src, or null
 */
export function getProfileImageUrl(path, token) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  let pathPart = trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const u = new URL(trimmed);
      pathPart = u.pathname || trimmed;
    } catch {
      pathPart = trimmed;
    }
  } else if (!pathPart.startsWith("/")) {
    pathPart = `/${pathPart}`;
  }

  const match = pathPart.match(PROFILE_IMAGE_PATH_REGEX);
  if (match) {
    const imageId = match[1];
    if (token && typeof token === "string") {
      return `/api/user/profile-image/${imageId}?token=${encodeURIComponent(token)}`;
    }
    return `${API_SERVER_BASE}${pathPart}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  }

  const url = pathPart.startsWith("/") ? `${API_SERVER_BASE}${pathPart}` : `${API_SERVER_BASE}/${pathPart}`;
  if (token && typeof token === "string") return `${url}?token=${encodeURIComponent(token)}`;
  return url;
}
