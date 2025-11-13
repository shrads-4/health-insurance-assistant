import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../lib/auth';
import { useRouter } from 'next/router';
import styles from '../styles/NavBar.module.css';

export default function NavBar() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Fertility Insurance Assistant</Link>
      </div>
      {user ? (
        <>
          <ul className={styles.navLinks}>
            <li><Link href="/timeline">Journey Timeline</Link></li>
            <li><Link href="/coverage">Coverage Decoder</Link></li>
            <li><Link href="/cost-simulation">Cost Simulator</Link></li>
          </ul>
          <div className={styles.userSection}>
            <span className={styles.userName}>
              {userProfile?.firstName || user.email}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Log Out
            </button>
          </div>
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
