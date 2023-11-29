import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex justify-center gap-12 px-8 py-4">
        <li>
          <Link href="/" className="hover:text-slate-600">
            Home
          </Link>
        </li>
        <li>
          <Link href="/sjf" className="hover:text-slate-600">
            Shortest Job First
          </Link>
        </li>
        <li>
          <Link href="" className="hover:text-slate-600">
            Preemptive Priority
          </Link>
        </li>
        <li>
          <Link href="" className="hover:text-slate-600">
            Scan
          </Link>
        </li>
      </ul>
    </nav>
  );
}
