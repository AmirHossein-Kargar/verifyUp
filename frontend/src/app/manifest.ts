import { MetadataRoute } from "next";

// Cache manifest for 24 hours
export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VerifyUp - احراز هویت آپورک",
    short_name: "VerifyUp",
    description: "پلتفرم تخصصی احراز هویت کاربران آپورک (Upwork)",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    orientation: "portrait",
    dir: "rtl",
    lang: "fa",
    icons: [
      {
        src: "/Logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
