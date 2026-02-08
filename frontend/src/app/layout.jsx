import localFont from "next/font/local";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutClient from "./LayoutClient";
import "./globals.css";

// * Meta Data
export const metadata = {
  metadataBase: new URL('https://verifyup.ir'),

  title: {
    default: 'VerifyUp | وریفای آپ',
    template: '%s | VerifyUp'
  },

  description:
    'VerifyUp پلتفرم تخصصی احراز هویت کاربران آپورک (Upwork) است. تایید مدارک، بررسی هویت و ارسال امن اسناد به‌صورت آنلاین، سریع و قابل اعتماد برای فریلنسرها و کارفرماها.',

  keywords: [
    'احراز هویت آپورک',
    'احراز هویت Upwork',
    'تایید مدارک آپورک',
    'VerifyUp',
    'احراز هویت فریلنسر',
    'تایید هویت آنلاین',
    'KYC',
    'احراز هویت دیجیتال',
    'تایید اسناد آنلاین',
    'Upwork verification',
    'احراز هویت کاربران آپورک'
  ],

  authors: [{ name: 'VerifyUp Team' }],
  creator: 'VerifyUp',
  publisher: 'VerifyUp',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Logo.png',
  },

  openGraph: {
    title: 'VerifyUp | احراز هویت کاربران آپورک (Upwork)',
    description:
      'پلتفرم VerifyUp برای احراز هویت و تایید مدارک کاربران آپورک. ارسال امن اسناد، بررسی سریع و افزایش شانس تایید حساب Upwork.',
    url: 'https://verifyup.ir',
    siteName: 'VerifyUp',
    type: 'website',
    locale: 'fa_IR',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VerifyUp – احراز هویت کاربران آپورک',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'VerifyUp | احراز هویت Upwork',
    description:
      'احراز هویت و تایید مدارک کاربران آپورک با VerifyUp. سریع، امن و آنلاین.',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://verifyup.ir',
  },

  category: 'technology',
};

// * Font
const iranYekan = localFont({
  src: [
    {
      path: '../fonts/IRANYekanX-Thin.woff',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-UltraLight.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-DemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-ExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Black.woff',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-ExtraBlack.woff',
      weight: '950',
      style: 'normal',
    },
    {
      path: '../fonts/IRANYekanX-Heavy.woff',
      weight: '1000',
      style: 'normal',
    },
  ],
  variable: '--font-iran-yekan',
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={iranYekan.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // On page load or when changing themes, best to add inline in head to avoid FOUC
              if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
              } else {
                  document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
      </head>
      <body className={`bg-gray-50 dark:bg-gray-900 ${iranYekan.className}`}>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
        <Script src="/flowbite.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
