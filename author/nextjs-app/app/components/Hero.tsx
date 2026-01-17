import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-cream-100 to-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brown-800 mb-6">
          Faith for the Wilderness
        </h1>
        <p className="text-lg md:text-xl text-brown-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Stories and reflections for anyone who feels lost and needs to be
          reminded: you&apos;re not alone.
        </p>
        <Link
          href="/books"
          className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Start the Journey
        </Link>
      </div>
    </section>
  );
}
