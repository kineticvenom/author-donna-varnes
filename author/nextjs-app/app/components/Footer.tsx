import Link from "next/link";
import EmailSignup from "./EmailSignup";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
      <footer className="bg-brown-800 text-cream-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl text-cream-50 mb-2">Donna Varnes</h3>
            <p className="text-cream-300 text-sm">Faith for the Wilderness</p>
          </div>

          <div className="flex justify-center">
            <EmailSignup variant="footer" />
          </div>

          <nav className="flex justify-center md:justify-end">
            <ul className="flex flex-wrap justify-center gap-6 text-sm">
              <li><Link href="/books" className="text-cream-200 hover:text-gold-400 transition-colors">Books</Link></li>
              <li><Link href="/blog" className="text-cream-200 hover:text-gold-400 transition-colors">Blog</Link></li>
              <li><Link href="/devotionals" className="text-cream-200 hover:text-gold-400 transition-colors">Devotions</Link></li>
              <li><Link href="/about" className="text-cream-200 hover:text-gold-400 transition-colors">Meet Donna</Link></li>
              <li><Link href="/contact" className="text-cream-200 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-brown-700 mt-8 pt-8 text-center">
          <p className="text-cream-400 text-sm">
            &copy; {currentYear} Donna Varnes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
