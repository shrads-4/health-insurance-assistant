import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signUp } from '../lib/auth';
import Link from 'next/link';
import styles from '../styles/Auth.module.css';

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const { user, error: authError } = await signUp(
      data.email, 
      data.password,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        onboardingCompleted: false
      }
    );

    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      // Wait a bit for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force reload auth context
      window.location.href = '/onboarding';  // Use window.location instead of router.push
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>Get started with your fertility journey</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && <span className={styles.fieldError}>{errors.firstName.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && <span className={styles.fieldError}>{errors.lastName.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: (val) => {
                  if (watch('password') != val) {
                    return "Passwords do not match";
                  }
                }
              })}
            />
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
