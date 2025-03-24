import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <svg
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="text-red-500 h-7 sm:h-10 rounded-full"
            >
              <title>Donna Varnes</title>

              <defs>
                <clipPath id="clip0_1_821">
                  <rect width="128" height="128" fill="white" />
                </clipPath>
              </defs>
            </svg>


            <span className="hidden lg:block text-lg pl-2 font-semibold">
              Donna Varnes
            </span>
          </Link>

          <nav className="">
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-sm md:text-base tracking-tight font-normal"
            >
              <li>
                <Link href="/about" className="">
                  About
                </Link>
              </li>                 
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
