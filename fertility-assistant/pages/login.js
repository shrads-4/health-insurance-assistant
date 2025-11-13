import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn, signInWithGoogle } from '../lib/auth';
import Link from 'next/link';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const { user, error: authError } = await signIn(data.email, data.password);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const { user, error: authError } = await signInWithGoogle();
    
    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue your journey</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleButton}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p className={styles.switchAuth}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
