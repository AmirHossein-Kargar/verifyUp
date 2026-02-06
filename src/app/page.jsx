import Link from 'next/link';

async function delay() {
  await new Promise(resolve => setTimeout(resolve, 2000));
}

export default async function Home() {
  await delay();

  return (
    <div className="flex items-center justify-center pt-16 text-center">
      <div>
        <h1 className="h1 mb-4">احراز هویت آپورک، ساده و مطمئن</h1>
        <p className="p-large mb-6 sm:px-16 xl:px-48">از ثبت‌ نام تا تأیید نهایی هویت در آپورک، کنار شما هستیم تا بدون ریسک و مشکل شروع به کار کنید</p>
        <Link href="#" className="btn-default">
          بیشتر بدانید
        </Link>
      </div>
    </div>
  );
}
