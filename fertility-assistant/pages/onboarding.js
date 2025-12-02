import { useState, useRef } from 'react';
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
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [documentChunks, setDocumentChunks] = useState([]);
    const [extractedInfo, setExtractedInfo] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file (Summary Plan Description or Evidence of Coverage)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/process-document', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setDocumentChunks(data.chunks);
                setUploadedFile({
                    name: data.fileName,
                    size: data.fileSize,
                    textLength: data.textLength
                });
                setValue('document', data.fileName);

                // Now extract insurance information
                setExtracting(true);
                try {
                    const extractResponse = await fetch('/api/extract-insurance-info', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            documentText: data.chunks.join('\n\n')
                        })
                    });

                    const extractedData = await extractResponse.json();

                    if (extractResponse.ok) {
                        setExtractedInfo(extractedData);
                        // Pre-fill form values
                        if (extractedData.insuranceCarrier) setValue('insuranceCarrier', extractedData.insuranceCarrier);
                        if (extractedData.planName) setValue('planName', extractedData.planName);
                        if (extractedData.deductible) setValue('deductible', extractedData.deductible);
                        if (extractedData.outOfPocketMax) setValue('outOfPocketMax', extractedData.outOfPocketMax);
                        if (extractedData.coinsurance) setValue('coinsurance', extractedData.coinsurance);
                        if (extractedData.coverageLimit) setValue('coverageLimit', extractedData.coverageLimit);
                    } else {
                        console.error('Failed to extract insurance info:', extractedData.error);
                        alert('Document uploaded but failed to automatically extract insurance details. Please fill them in manually.');
                    }
                } catch (extractError) {
                    console.error('Insurance extraction error:', extractError);
                    alert('Document uploaded but failed to automatically extract insurance details. Please fill them in manually.');
                }
                setExtracting(false);
            } else {
                alert(`Error processing document: ${data.error}`);
            }
        } catch (error) {
            console.error('File processing error:', error);
            alert('Error processing file. Please try again.');
        }
        setUploading(false);
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Save user profile with basic info and document
            await updateDoc(doc(db, 'users', user.uid), {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                fertilityJourneyStage: data.fertilityJourneyStage,
                uploadedDocument: uploadedFile ? {
                    fileName: uploadedFile.name,
                    fileSize: uploadedFile.size,
                    textLength: uploadedFile.textLength,
                    uploadedAt: new Date()
                } : null,
                documentChunks: documentChunks || [],
                // Extracted insurance information (from upload or manual entry)
                insuranceCarrier: data.insuranceCarrier || null,
                planName: data.planName || null,
                deductible: parseFloat(data.deductible) || null,
                deductibleMet: 0,
                outOfPocketMax: parseFloat(data.outOfPocketMax) || null,
                coinsurance: parseFloat(data.coinsurance) || null,
                coverageLimit: parseFloat(data.coverageLimit) || null,
                insuranceNotes: extractedInfo?.notes || null,
                // Treatment history fields for future use
                treatmentHistory: [],
                documents: uploadedFile ? [uploadedFile.name] : [],
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
                    <h1>Welcome to Baby Yoda</h1>
                    <p className={styles.subtitle}>Let's get started with your fertility journey</p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <h2>Personal Information</h2>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    {...register('firstName', { required: 'First name is required' })}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    {...register('lastName', { required: 'Last name is required' })}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Date of Birth *</label>
                            <input
                                type="date"
                                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                            />
                            {errors.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Where are you in your fertility journey? *</label>
                            <select {...register('fertilityJourneyStage', { required: 'Please select an option' })}>
                                <option value="">Select your current stage...</option>
                                <option value="just-thinking">Just started thinking about it</option>
                                <option value="researching">Researching options and planning</option>
                                <option value="just-started-treatment">Just started treatment</option>
                                <option value="in-middle-of-treatment">In the middle of treatment</option>
                                <option value="between-cycles">Between treatment cycles</option>
                                <option value="exploring-alternatives">Exploring alternative options</option>
                            </select>
                            {errors.fertilityJourneyStage && <span className={styles.error}>{errors.fertilityJourneyStage.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Upload Insurance Document (Optional)</label>
                            <p className={styles.documentHint}>
                                Upload your Summary Plan Description (SPD) or Evidence of Coverage (EOC) document to automatically extract your insurance information. Or, you can manually enter your insurance details below.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />

                            <div className={styles.uploadContainer}>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={styles.uploadButton}
                                    disabled={uploading || extracting}
                                >
                                    {uploading ? '⏳ Uploading...' : extracting ? '🔍 Extracting Info...' : uploadedFile ? '✓ Document Uploaded' : '📎 Choose PDF File'}
                                </button>

                                {uploadedFile && (
                                    <div className={styles.uploadedFileInfo}>
                                        <span className={styles.fileName}>📄 {uploadedFile.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUploadedFile(null);
                                                setDocumentChunks([]);
                                                setExtractedInfo(null);
                                                setValue('document', '');
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className={styles.removeButton}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(extractedInfo || !uploadedFile) && (
                            <div className={styles.extractedInfoSection}>
                                <h3>📋 {extractedInfo ? 'Extracted Insurance Information' : 'Insurance Information'}</h3>
                                <p className={styles.extractedHint}>
                                    {extractedInfo
                                        ? "We've automatically extracted the following information. Please review and correct any errors."
                                        : "Please enter your insurance information. You can find these details in your insurance card or policy documents."}
                                </p>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Insurance Carrier</label>
                                        <input
                                            type="text"
                                            {...register('insuranceCarrier')}
                                            placeholder="e.g., Blue Cross Blue Shield"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Plan Name</label>
                                        <input
                                            type="text"
                                            {...register('planName')}
                                            placeholder="e.g., PPO Gold Plan"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Individual Deductible ($)</label>
                                        <input
                                            type="number"
                                            {...register('deductible')}
                                            placeholder="e.g., 2000"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Out-of-Pocket Maximum ($)</label>
                                        <input
                                            type="number"
                                            {...register('outOfPocketMax')}
                                            placeholder="e.g., 8000"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Coinsurance (%)</label>
                                        <input
                                            type="number"
                                            {...register('coinsurance')}
                                            placeholder="e.g., 20"
                                        />
                                        <span className={styles.fieldHint}>Your share after deductible</span>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Fertility Coverage Limit ($)</label>
                                        <input
                                            type="number"
                                            {...register('coverageLimit')}
                                            placeholder="e.g., 15000"
                                        />
                                        <span className={styles.fieldHint}>Lifetime or annual limit</span>
                                    </div>
                                </div>

                                {extractedInfo?.notes && (
                                    <div className={styles.notesBox}>
                                        <strong>📝 Important Notes:</strong>
                                        <p>{extractedInfo.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading || uploading || extracting}
                        >
                            {loading ? 'Completing Setup...' : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
