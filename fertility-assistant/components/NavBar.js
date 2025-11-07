import Link from 'next/link';
export default function NavBar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/timeline">Journey Timeline</Link>
      <Link href="/coverage">Coverage Decoder</Link>
      <Link href="/cost-simulation">Cost Simulator</Link>
    </nav>
  );
}
