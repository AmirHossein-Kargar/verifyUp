import localFont from "next/font/local";
import Header from "./components/Header";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning className={iranYekan.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`bg-gray-50 dark:bg-gray-900 ${iranYekan.className}`}>
        {/* Floating Header */}
        <Header />
        {/* Main Content with padding for fixed header */}
        <main className="pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
