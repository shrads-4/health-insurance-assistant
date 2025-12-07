import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import ProtectedRoute from '../components/ProtectedRoute';
import Head from 'next/head';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState(null);

  // Fetch fresh profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          reset(data); // Populate form with current values
        }
      }
    };
    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!user) return; // Safety check

    setLoading(true);
    setMessage('');

    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        fertilityJourneyStage: data.fertilityJourneyStage,
        updatedAt: new Date()
      };

      // Only include insurance fields if they have values
      if (data.insuranceCarrier) updateData.insuranceCarrier = data.insuranceCarrier;
      if (data.planName) updateData.planName = data.planName;
      if (data.deductible) updateData.deductible = parseFloat(data.deductible);
      if (data.deductibleMet !== undefined) updateData.deductibleMet = parseFloat(data.deductibleMet);
      if (data.outOfPocketMax) updateData.outOfPocketMax = parseFloat(data.outOfPocketMax);
      if (data.coinsurance) updateData.coinsurance = parseFloat(data.coinsurance);
      if (data.coverageLimit) updateData.coverageLimit = parseFloat(data.coverageLimit);

      await updateDoc(doc(db, 'users', user.uid), updateData);

      setMessage('Profile updated successfully! ✓');
      setEditMode(false);

      // Refresh profile data
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    reset(profileData); // Reset form to original values
    setEditMode(false);
    setMessage('');
  };

  // Show loading while checking auth or fetching profile
  if (!user || !profileData) {
    return (
      <ProtectedRoute requireOnboarding={true}>
        <div className={styles.loading}>Loading profile...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className={styles.container}>
        <Head>
          <title>My Profile - Baby Yoda</title>
        </Head>

        <div className={styles.header}>
          <h1>My Profile</h1>
          {!editMode && (
            <button 
              onClick={() => setEditMode(true)} 
              className={styles.editButton}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={message.includes('Error') ? styles.errorMessage : styles.successMessage}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Personal Information Section */}
          <div className={styles.section}>
            <h2>Personal Information</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Email</label>
                <div className={styles.staticValue}>{user?.email || 'N/A'}</div>
                <small className={styles.hint}>Email cannot be changed</small>
              </div>

              <div className={styles.infoItem}>
                <label>First Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className={styles.input}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.firstName || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Last Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className={styles.input}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.lastName || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Date of Birth</label>
                {editMode ? (
                  <>
                    <input
                      type="date"
                      {...register('dateOfBirth')}
                      className={styles.input}
                    />
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.dateOfBirth || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Fertility Journey Stage</label>
                {editMode ? (
                  <select {...register('fertilityJourneyStage')} className={styles.input}>
                    <option value="">Select stage...</option>
                    <option value="just-thinking">Just started thinking about it</option>
                    <option value="researching">Researching options and planning</option>
                    <option value="just-started-treatment">Just started treatment</option>
                    <option value="in-middle-of-treatment">In the middle of treatment</option>
                    <option value="between-cycles">Between treatment cycles</option>
                    <option value="exploring-alternatives">Exploring alternative options</option>
                  </select>
                ) : (
                  <div className={styles.value}>
                    {profileData?.fertilityJourneyStage ?
                      profileData.fertilityJourneyStage.split('-').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')
                      : 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insurance Information Section */}
          <div className={styles.section}>
            <h2>Insurance Information</h2>
            {!profileData?.insuranceCarrier && (
              <div className={styles.infoNote}>
                Insurance details will be extracted from your uploaded document. You can manually edit them below if needed.
              </div>
            )}

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Insurance Carrier</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('insuranceCarrier')}
                      className={styles.input}
                      placeholder="Will be extracted from document"
                    />
                    {errors.insuranceCarrier && <span className={styles.error}>{errors.insuranceCarrier.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.insuranceCarrier || 'Pending extraction'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Plan Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('planName')}
                      className={styles.input}
                      placeholder="Will be extracted from document"
                    />
                    {errors.planName && <span className={styles.error}>{errors.planName.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.planName || 'Pending extraction'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Annual Deductible</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('deductible', { min: 0 })}
                      className={styles.input}
                      placeholder="Will be extracted from document"
                    />
                    {errors.deductible && <span className={styles.error}>{errors.deductible.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>
                    {profileData?.deductible ? `$${profileData.deductible.toLocaleString()}` : 'Pending extraction'}
                  </div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Deductible Met</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('deductibleMet', { min: 0 })}
                      className={styles.input}
                    />
                    {errors.deductibleMet && <span className={styles.error}>{errors.deductibleMet.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>${profileData?.deductibleMet?.toLocaleString() || '0'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Out-of-Pocket Max</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('outOfPocketMax', { min: 0 })}
                      className={styles.input}
                      placeholder="Will be extracted from document"
                    />
                    {errors.outOfPocketMax && <span className={styles.error}>{errors.outOfPocketMax.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>
                    {profileData?.outOfPocketMax ? `$${profileData.outOfPocketMax.toLocaleString()}` : 'Pending extraction'}
                  </div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Coinsurance (%)</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('coinsurance', { min: 0, max: 100 })}
                      className={styles.input}
                      placeholder="Will be extracted from document"
                    />
                    {errors.coinsurance && <span className={styles.error}>{errors.coinsurance.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>
                    {profileData?.coinsurance ? `${profileData.coinsurance}%` : 'Pending extraction'}
                  </div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Fertility Coverage Limit</label>
                {editMode ? (
                  <input
                    type="number"
                    {...register('coverageLimit', { min: 0 })}
                    className={styles.input}
                    placeholder="Leave blank if no limit"
                  />
                ) : (
                  <div className={styles.value}>
                    {profileData?.coverageLimit ? `$${profileData.coverageLimit.toLocaleString()}` :
                      profileData?.insuranceCarrier ? 'No limit' : 'Pending extraction'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editMode && (
            <div className={styles.actions}>
              <button 
                type="button" 
                onClick={handleCancel} 
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {/* Account Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Member Since</div>
            <div className={styles.statValue}>
              {profileData?.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Last Updated</div>
            <div className={styles.statValue}>
              {profileData?.updatedAt?.toDate?.().toLocaleDateString() || 'Never'}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
