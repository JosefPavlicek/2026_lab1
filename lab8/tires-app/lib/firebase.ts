const firebaseURL = process.env.FIREBASE_URL;

if (!firebaseURL) {
  throw new Error("FIREBASE_URL is not defined");
}

export async function firebaseRequest(path: string, options: any = {}) {
  const response = await fetch(`${firebaseURL}${path}.json`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || "Firebase error");
  }

  return data;
}