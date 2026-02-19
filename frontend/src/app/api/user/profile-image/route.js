/**
 * Next.js API route: POST /api/user/profile-image
 * Proxies multipart upload to the Express backend so auth cookies (same-origin) work.
 * When frontend and backend are on the same domain, use this route; otherwise the client
 * should call the backend URL directly (see api.uploadProfileImage in lib/api.js).
 */

const BACKEND_API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "") +
  "/api";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return Response.json(
        { success: false, message: "No image uploaded" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type) && file.type !== "image/jpeg") {
      return Response.json(
        { success: false, message: "Invalid file type. Allowed: jpg, jpeg, png, webp" },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return Response.json(
        { success: false, message: "File too large. Max size: 2MB" },
        { status: 400 }
      );
    }

    const cookie = request.headers.get("cookie") || "";
    const proxyFormData = new FormData();
    proxyFormData.append("image", file);

    const backendUrl = `${BACKEND_API}/users/profile-image`;
    const res = await fetch(backendUrl, {
      method: "PATCH",
      body: proxyFormData,
      headers: {
        Cookie: cookie,
      },
    });

    const data = await res.json().catch(() => ({ success: false, message: "Invalid response" }));

    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { success: false, message: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
