import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-800 text-cream-100">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl text-cream-50 mb-2">Donna Varnes</h3>
            <p className="text-cream-300 text-sm">Author & Speaker</p>
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-sm">
              <li><Link href="/books" className="text-cream-200 hover:text-gold-400 transition-colors">Books</Link></li>
              <li><Link href="/blog" className="text-cream-200 hover:text-gold-400 transition-colors">Blog</Link></li>
              <li><Link href="/devotionals" className="text-cream-200 hover:text-gold-400 transition-colors">Devotions</Link></li>
              <li><Link href="/about" className="text-cream-200 hover:text-gold-400 transition-colors">About</Link></li>
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
  );
}
