import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-8">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/event-logo.svg"
          alt="Event Management logo"
          width={180}
          height={38}
          priority
        />
        <h2 className="text-2xl font-bold">Welcome to the Event Management App</h2>
        <p className="text-lg text-gray-700">Organize and manage your events with ease.</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/auth/Login" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700">
          Login
          </Link>
          <Link href="/auth/Register" className="border border-blue-600 text-blue-600 px-6 py-3 rounded shadow hover:bg-blue-50">
          Register
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600">
        <a
          className="hover:underline"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <a
          className="hover:underline"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deploy on Vercel
        </a>
        <a
          className="hover:underline"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
