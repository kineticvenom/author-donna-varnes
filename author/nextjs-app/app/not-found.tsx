// app/not-found.tsx
import Image from 'next/image';
import logoFallback from '@/public/images/Logo.png';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <Image
        src={logoFallback}
        alt="Logo"
        width={300}
        height={80}
        unoptimized
        className="object-contain mb-8"
      />
      <h1 className="text-4xl font-bold">404 – Page Not Found</h1>
      <p className="mt-4">Sorry, we couldn’t find that page.</p>
      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        Go back home
      </Link>
    </main>
  );
}
