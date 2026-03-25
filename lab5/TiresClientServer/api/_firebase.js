//const FIREBASE_URL = process.env.FIREBASE_URL;... used for vercel or server enviromens .. will be explained later
const FIREBASE_URL = 'https://school-2340a-default-rtdb.europe-west1.firebasedatabase.app/'; // Replace with your actual Firebase URL

if (!FIREBASE_URL) {
  throw new Error("Missing FIREBASE_URL environment variable.");
}

async function firebaseRequest(path, options = {}) {
  const url = `${FIREBASE_URL}${path}.json`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Firebase request failed with status ${response.status}`);
  }

  return data;
}

module.exports = { firebaseRequest };