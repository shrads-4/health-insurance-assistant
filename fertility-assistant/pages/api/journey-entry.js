import { db, auth } from '../../lib/firebase_config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default async function handler(req, res) {
  // Handle GET request to fetch journey entries
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      // In a real app, verify the token here to get the UID securely
      // For this implementation, we'll need the UID to be passed as a query param
      // or extract it from the token if we were verifying it on the server
      const { uid } = req.query;

      if (!uid) {
        return res.status(400).json({ error: 'Missing uid' });
      }

      const journeyEntriesRef = collection(db, 'users', uid, 'journeyEntries');
      const q = query(journeyEntriesRef, orderBy('date', 'asc')); // Sort by date
      
      const querySnapshot = await getDocs(q);
      const entries = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data(),
          // Ensure dates are serialized properly if they are timestamps
          createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        });
      });

      return res.status(200).json({ success: true, data: entries });
    } catch (error) {
      console.error('Error fetching journey entries:', error);
      return res.status(500).json({ error: 'Failed to fetch journey entries', details: error.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the ID token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify the token using Firebase Admin SDK (if available)
    // For now, we'll assume the client passes a valid token
    // In production, use firebase-admin to verify the token
    
    const { treatmentType, status, date, totalCost, insurancePaid, trueCost, uid } = req.body;

    // Validate required fields
    if (!treatmentType || !status || !date || totalCost === undefined || insurancePaid === undefined || !uid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add the new journey entry to Firestore
    const journeyEntriesRef = collection(db, 'users', uid, 'journeyEntries');
    
    const newEntry = {
      treatmentType,
      status,
      date,
      totalCost: parseFloat(totalCost),
      insurancePaid: parseFloat(insurancePaid),
      trueCost: parseFloat(trueCost),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(journeyEntriesRef, newEntry);

    return res.status(201).json({
      success: true,
      id: docRef.id,
      data: newEntry,
    });
  } catch (error) {
    console.error('Error saving journey entry:', error);
    return res.status(500).json({ error: 'Failed to save journey entry', details: error.message });
  }
}
