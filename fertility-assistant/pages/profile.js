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
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        insuranceCarrier: data.insuranceCarrier,
        planName: data.planName,
        deductible: parseFloat(data.deductible),
        deductibleMet: parseFloat(data.deductibleMet),
        outOfPocketMax: parseFloat(data.outOfPocketMax),
        coinsurance: parseFloat(data.coinsurance),
        coverageLimit: data.coverageLimit ? parseFloat(data.coverageLimit) : null,
        location: {
          state: data.state,
          zipCode: data.zipCode
        },
        updatedAt: new Date()
      });

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
      <ProtectedRoute>
        <div className={styles.loading}>Loading profile...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
            </div>
          </div>

          {/* Insurance Information Section */}
          <div className={styles.section}>
            <h2>Insurance Information</h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Insurance Carrier</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('insuranceCarrier', { required: 'Required' })}
                      className={styles.input}
                    />
                    {errors.insuranceCarrier && <span className={styles.error}>{errors.insuranceCarrier.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.insuranceCarrier || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Plan Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('planName', { required: 'Required' })}
                      className={styles.input}
                    />
                    {errors.planName && <span className={styles.error}>{errors.planName.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.planName || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Annual Deductible</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('deductible', { required: 'Required', min: 0 })}
                      className={styles.input}
                    />
                    {errors.deductible && <span className={styles.error}>{errors.deductible.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>${profileData?.deductible?.toLocaleString() || 'Not set'}</div>
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
                      {...register('outOfPocketMax', { required: 'Required', min: 0 })}
                      className={styles.input}
                    />
                    {errors.outOfPocketMax && <span className={styles.error}>{errors.outOfPocketMax.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>${profileData?.outOfPocketMax?.toLocaleString() || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Coinsurance (%)</label>
                {editMode ? (
                  <>
                    <input
                      type="number"
                      {...register('coinsurance', { required: 'Required', min: 0, max: 100 })}
                      className={styles.input}
                    />
                    {errors.coinsurance && <span className={styles.error}>{errors.coinsurance.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.coinsurance}%</div>
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
                    {profileData?.coverageLimit ? `$${profileData.coverageLimit.toLocaleString()}` : 'No limit'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className={styles.section}>
            <h2>Location</h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>State</label>
                {editMode ? (
                  <>
                    <select {...register('state', { required: 'Required' })} className={styles.input}>
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
                    </select>
                    {errors.state && <span className={styles.error}>{errors.state.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.location?.state || 'Not set'}</div>
                )}
              </div>

              <div className={styles.infoItem}>
                <label>Zip Code</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      {...register('zipCode', { 
                        required: 'Required',
                        pattern: {
                          value: /^\d{5}$/,
                          message: 'Invalid zip code'
                        }
                      })}
                      className={styles.input}
                    />
                    {errors.zipCode && <span className={styles.error}>{errors.zipCode.message}</span>}
                  </>
                ) : (
                  <div className={styles.value}>{profileData?.location?.zipCode || 'Not set'}</div>
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
