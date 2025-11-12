import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Home</Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link href="/timeline">Journey Timeline</Link></li>
        <li><Link href="/coverage">Coverage Decoder</Link></li>
        <li><Link href="/cost-simulation">Cost Simulator</Link></li>
      </ul>
    </nav>
  );
}
