export default async function handler(req, res) {
  try {
    const { name, price } = req.body;

    const firebaseUrl = process.env.FIREBASE_PROJECT_ID+'/products.json';
    console.log("Add rodukt url  "+firebaseUrl);

    const response = await fetch(firebaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });

    if (!response.ok) {
      throw new Error('Failed to write product to Firebase');
    }

    const result = await response.json();

    res.status(200).json({ success: true, id: result.name }); // result.name = generated Firebase key
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
}