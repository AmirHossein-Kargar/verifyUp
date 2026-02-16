import { MetadataRoute } from "next";

// Cache robots.txt for 24 hours
export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/cart/", "/checkout/"],
      },
    ],
    sitemap: "https://verifyup.ir/sitemap.xml",
  };
}
