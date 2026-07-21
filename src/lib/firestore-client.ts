import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'project-a9c284f8-6bca-440a-a0c',
});

export { db };

export async function saveAlert(alert: object) {
  try {
    const docRef = await db.collection('alerts').add(alert);
    return docRef.id;
  } catch (error) {
    console.error('Error saving alert:', error);
    throw error;
  }
}

export async function saveCargoState(cargoId: string, state: object) {
  try {
    await db.collection('cargo_states').doc(cargoId).set(state, { merge: true });
  } catch (error) {
    console.error('Error saving cargo state:', error);
    throw error;
  }
}

export async function getRecentAlerts(limit: number) {
  try {
    const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').limit(limit).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting recent alerts:', error);
    throw error;
  }
}

export async function saveMarketplaceListing(listing: object) {
  try {
    const docRef = await db.collection('marketplace_listings').add(listing);
    return docRef.id;
  } catch (error) {
    console.error('Error saving marketplace listing:', error);
    throw error;
  }
}
