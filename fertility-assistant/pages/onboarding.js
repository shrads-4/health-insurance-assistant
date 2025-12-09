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
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [hasUploadedDocument, setHasUploadedDocument] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid file (JPEG, PNG, WebP, or PDF)');
            return;
        }

        // Show preview (only for images)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setUploadedFileName(null);
        } else {
            // For PDFs, just show the filename
            setImagePreview(null);
            setUploadedFileName(file.name);
        }

        // Upload and extract
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/extract-insurance-info', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success && result.data) {
                setExtractedData(result.data);
                setHasUploadedDocument(true);

                // Auto-fill form fields
                if (result.data.insuranceCarrier) {
                    setValue('insuranceCarrier', result.data.insuranceCarrier);
                }
                if (result.data.planName) {
                    setValue('planName', result.data.planName);
                }
                if (result.data.deductible?.individual) {
                    setValue('deductible', result.data.deductible.individual);
                }
                if (result.data.outOfPocketMax?.individual) {
                    setValue('outOfPocketMax', result.data.outOfPocketMax.individual);
                }

                alert('Insurance information extracted successfully! Please review and update the fields as needed.');
            } else {
                throw new Error(result.error || 'Failed to extract information');
            }
        } catch (error) {
            console.error('Error uploading insurance card:', error);
            alert('Failed to extract insurance information. Please fill in manually.');
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Helper function to safely parse numbers
            const parseNumber = (value) => {
                if (!value || value === '') return null;
                const parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            };

            // Save insurance info to user profile
            await updateDoc(doc(db, 'users', user.uid), {
                insuranceCarrier: data.insuranceCarrier || null,
                planName: data.planName || null,
                deductible: parseNumber(data.deductible),
                deductibleMet: parseNumber(data.deductibleMet) || 0,
                outOfPocketMax: parseNumber(data.outOfPocketMax),
                coinsurance: parseNumber(data.coinsurance),
                location: {
                    state: data.state || null,
                    zipCode: data.zipCode || null
                },
                coverageLimit: parseNumber(data.coverageLimit),
                // Store extracted data for reference
                extractedInsuranceData: extractedData || null,
                // Treatment history fields for future use
                treatmentHistory: [],
                documents: [],
                preferences: {
                    reminderSettings: {
                        emailReminders: true,
                        appointmentReminders: true,
                        medicationReminders: true
                    },
                    preferredProviders: []
                },
                currentCycle: {
                    status: 'planning', // planning, active, completed
                    type: null,
                    startDate: null,
                    estimatedCost: null
                },
                onboardingCompleted: true,
                onboardingDate: new Date()
            });

            console.log('✅ Onboarding completed successfully!');
            console.log('Redirecting to home page...');

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error('❌ Error saving profile:', error);
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

                                <div className={styles.uploadSection}>
                                    <label className={styles.uploadLabel}>
                                        Upload Insurance Document *
                                    </label>
                                    <p className={styles.uploadHint}>
                                        Please upload a photo of your insurance card or a PDF of your Summary of Benefits. The form will auto-fill based on the document.
                                    </p>

                                    <div className={styles.uploadContainer}>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                            className={styles.fileInput}
                                            id="insuranceCardUpload"
                                        />
                                        <label htmlFor="insuranceCardUpload" className={styles.uploadButton}>
                                            {uploadingImage ? 'Processing...' : 'Choose File'}
                                        </label>

                                        {imagePreview && (
                                            <div className={styles.imagePreview}>
                                                <img src={imagePreview} alt="Insurance card preview" />
                                            </div>
                                        )}

                                        {uploadedFileName && (
                                            <div className={styles.fileInfo}>
                                                📄 {uploadedFileName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.divider}>
                                    <span>Review & Edit (Optional)</span>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Insurance Carrier</label>
                                    <input
                                        type="text"
                                        {...register('insuranceCarrier')}
                                        placeholder="Auto-filled from document"
                                        disabled={!hasUploadedDocument}
                                    />
                                    {errors.insuranceCarrier && <span className={styles.error}>{errors.insuranceCarrier.message}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Plan Name</label>
                                    <input
                                        type="text"
                                        {...register('planName')}
                                        placeholder="Auto-filled from document"
                                        disabled={!hasUploadedDocument}
                                    />
                                    {errors.planName && <span className={styles.error}>{errors.planName.message}</span>}
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Annual Deductible ($)</label>
                                        <input
                                            type="number"
                                            {...register('deductible', { min: 0 })}
                                            placeholder="Auto-filled from document"
                                            disabled={!hasUploadedDocument}
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
                                            disabled={!hasUploadedDocument}
                                        />
                                    </div>
                                </div>

                                {!hasUploadedDocument && (
                                    <p className={styles.warningText}>
                                        ⚠️ Please upload your insurance document to continue
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!hasUploadedDocument) {
                                            alert('Please upload your insurance document before continuing.');
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                    className={styles.nextButton}
                                    disabled={!hasUploadedDocument}
                                >
                                    Next →
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2>Additional Details</h2>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Out-of-Pocket Max ($)</label>
                                        <input
                                            type="number"
                                            {...register('outOfPocketMax', { min: 0 })}
                                            placeholder="Auto-filled from document"
                                        />
                                        {errors.outOfPocketMax && <span className={styles.error}>{errors.outOfPocketMax.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Coinsurance (%)</label>
                                        <input
                                            type="number"
                                            {...register('coinsurance', { min: 0, max: 100 })}
                                            placeholder="Optional"
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
                                        <label>State</label>
                                        <select {...register('state')}>
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
                                        <label>Zip Code</label>
                                        <input
                                            type="text"
                                            {...register('zipCode', {
                                                pattern: {
                                                    value: /^\d{5}$/,
                                                    message: 'Invalid zip code format'
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
