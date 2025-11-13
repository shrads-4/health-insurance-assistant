import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/Onboarding.module.css';

export default function Onboarding() {
    const { user } = useAuth();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Save insurance info to user profile
            await updateDoc(doc(db, 'users', user.uid), {
                insuranceCarrier: data.insuranceCarrier,
                planName: data.planName,
                deductible: parseFloat(data.deductible),
                deductibleMet: parseFloat(data.deductibleMet),
                outOfPocketMax: parseFloat(data.outOfPocketMax),
                coinsurance: parseFloat(data.coinsurance),
                location: {
                    state: data.state,
                    zipCode: data.zipCode
                },
                coverageLimit: data.coverageLimit ? parseFloat(data.coverageLimit) : null,
                onboardingCompleted: true,
                onboardingDate: new Date()
            });

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Please try again.');
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Complete Your Profile</h1>
                    <p className={styles.subtitle}>Help us personalize your experience</p>

                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {step === 1 && (
                            <>
                                <h2>Insurance Information</h2>

                                <div className={styles.formGroup}>
                                    <label>Insurance Carrier *</label>
                                    <input
                                        type="text"
                                        {...register('insuranceCarrier', { required: 'Required' })}
                                        placeholder="e.g., Blue Cross Blue Shield"
                                    />
                                    {errors.insuranceCarrier && <span className={styles.error}>{errors.insuranceCarrier.message}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Plan Name *</label>
                                    <input
                                        type="text"
                                        {...register('planName', { required: 'Required' })}
                                        placeholder="e.g., PPO Gold"
                                    />
                                    {errors.planName && <span className={styles.error}>{errors.planName.message}</span>}
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Annual Deductible ($) *</label>
                                        <input
                                            type="number"
                                            {...register('deductible', { required: 'Required', min: 0 })}
                                            placeholder="2000"
                                        />
                                        {errors.deductible && <span className={styles.error}>{errors.deductible.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Deductible Met ($)</label>
                                        <input
                                            type="number"
                                            {...register('deductibleMet', { min: 0 })}
                                            placeholder="0"
                                            defaultValue="0"
                                        />
                                    </div>
                                </div>

                                <button type="button" onClick={() => setStep(2)} className={styles.nextButton}>
                                    Next →
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2>Additional Details</h2>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Out-of-Pocket Max ($) *</label>
                                        <input
                                            type="number"
                                            {...register('outOfPocketMax', { required: 'Required', min: 0 })}
                                            placeholder="6000"
                                        />
                                        {errors.outOfPocketMax && <span className={styles.error}>{errors.outOfPocketMax.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Coinsurance (%) *</label>
                                        <input
                                            type="number"
                                            {...register('coinsurance', { required: 'Required', min: 0, max: 100 })}
                                            placeholder="20"
                                        />
                                        {errors.coinsurance && <span className={styles.error}>{errors.coinsurance.message}</span>}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Fertility Coverage Limit ($)</label>
                                    <input
                                        type="number"
                                        {...register('coverageLimit', { min: 0 })}
                                        placeholder="15000 (leave blank if no limit)"
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>State *</label>
                                        <select {...register('state', { required: 'Required' })}>
                                            <option value="">Select state...</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MD">Maryland</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NY">New York</option>
                                            <option value="TX">Texas</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">Washington</option>
                                            {/* Need to list states based on where we want to make this available */}
                                        </select>
                                        {errors.state && <span className={styles.error}>{errors.state.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Zip Code *</label>
                                        <input
                                            type="text"
                                            {...register('zipCode', {
                                                required: 'Required',
                                                pattern: {
                                                    value: /^\d{5}$/,
                                                    message: 'Invalid zip code'
                                                }
                                            })}
                                            placeholder="12345"
                                        />
                                        {errors.zipCode && <span className={styles.error}>{errors.zipCode.message}</span>}
                                    </div>
                                </div>

                                <div className={styles.buttonRow}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className={styles.backButton}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Complete Setup'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
