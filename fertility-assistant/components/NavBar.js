import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import styles from '../styles/NavBar.module.css';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <h2>Baby Yoda</h2>
        </Link>
      </div>
      
      {user ? (
        <>
          <ul className={styles.navLinks}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/timeline">Journey Timeline</Link></li>
            <li><Link href="/coverage">Coverage Decoder</Link></li>
            <li><Link href="/cost-simulation">Cost Simulator</Link></li>
          </ul>
          <ProfileDropdown />
        </>
      ) : (
        <div className={styles.authButtons}>
          <Link href="/login">
            <button className={styles.loginButton}>Log In</button>
          </Link>
          <Link href="/signup">
            <button className={styles.signupButton}>Sign Up</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
