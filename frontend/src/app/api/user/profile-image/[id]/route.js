/**
 * GET /api/user/profile-image/[id]
 * Proxies profile image from backend so the browser loads it same-origin (no CORS/cookie issues).
 * Query: token (required for auth with backend when loading in img src).
 */

const BACKEND_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "") ||
  "http://localhost:4000";

export async function GET(request, context) {
  try {
    const params = await Promise.resolve(context.params || {});
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!id || typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) {
      return Response.json({ success: false, message: "Image id required" }, { status: 400 });
    }

    const backendUrl = new URL(`${BACKEND_BASE}/api/users/profile-image/${id}`);
    if (token && typeof token === "string") {
      backendUrl.searchParams.set("token", token);
    }

    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      let message = "Image load failed";
      try {
        const data = JSON.parse(text);
        message = data?.message || message;
      } catch {
        // keep default message
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Profile image proxy]", id, res.status, message);
      }
      return Response.json({ success: false, message }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=31536000",
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Profile image proxy] Error:", err?.message || err);
    }
    return Response.json(
      { success: false, message: err?.message || "Proxy failed" },
      { status: 500 }
    );
  }
}
