export default async function handler(req, res) {
  try {
    const firebaseUrl = process.env.FIREBASE_PROJECT_ID+'/orders.json';

    const response = await fetch(firebaseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch orders from Firebase');
    }

    const data = await response.json();

    const result = data
      ? Object.entries(data).map(([id, order]) => ({ id, ...order }))
      : [];

    res.status(200).json(result);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
}