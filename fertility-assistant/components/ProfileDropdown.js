import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../lib/auth';
import styles from '../styles/ProfileDropdown.module.css';

export default function ProfileDropdown() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
    setIsOpen(false);
  };

  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.toUpperCase()[0];
    }
    return '?';
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.avatarButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <div className={styles.avatar}>
          {getInitials()}
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.avatarLarge}>
              {getInitials()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>

          <div className={styles.dropdownDivider}></div>

          <Link href="/profile" onClick={() => setIsOpen(false)}>
            <div className={styles.dropdownItem}>
              <span className={styles.icon}>👤</span>
              <span>My Profile</span>
            </div>
          </Link>

          <div className={styles.dropdownDivider}></div>

          <button onClick={handleLogout} className={styles.dropdownItem}>
            <span className={styles.icon}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
