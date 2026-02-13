import localFont from "next/font/local";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutClient from "./LayoutClient";
import "./globals.css";

// * Meta Data
export const metadata = {
  metadataBase: new URL('https://verifyup.ir'),

  title: {
    default: '32510191 - VerifyUp | وریفای آپ - احراز هویت آپورک',
    template: '%s | VerifyUp'
  },

  description:
    'VerifyUp پلتفرم تخصصی احراز هویت کاربران آپورک (Upwork) است. تایید مدارک، بررسی هویت و ارسال امن اسناد به‌صورت آنلاین، سریع و قابل اعتماد برای فریلنسرها و کارفرماها.',

  keywords: [
    'احراز هویت آپورک',
    'احراز هویت Upwork',
    'تایید مدارک آپورک',
    'VerifyUp',
    'وریفای آپ',
    'احراز هویت فریلنسر',
    'تایید هویت آنلاین',
    'KYC',
    'احراز هویت دیجیتال',
    'تایید اسناد آنلاین',
    'Upwork verification',
    'احراز هویت کاربران آپورک',
    'IP Residential',
    'VPS آپورک',
    'سیم‌کارت فیزیکی',
    'ساخت اکانت آپورک'
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

  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  other: {
    enamad: '32510191',
  },
};

// * Font with display swap for better performance
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
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={iranYekan.variable}>
      <head>
        {/* Enamad Verification Meta Tag */}
        <meta name="enamad" content="32510191" />

        {/* Theme script - inline to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
              } else {
                  document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://flowbite.com" />
        <link rel="preconnect" href="https://cdn.worldvectorlogo.com" />
        <link rel="dns-prefetch" href="https://flowbite.com" />
        <link rel="dns-prefetch" href="https://cdn.worldvectorlogo.com" />
      </head>
      <body className={`bg-gray-50 dark:bg-gray-900 ${iranYekan.className}`}>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>

        {/* Load Flowbite after interactive for better performance */}
        <Script src="/flowbite.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
