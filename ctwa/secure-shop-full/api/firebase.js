const FIREBASE_URL =process.env.FIREBASE_PROJECT_ID;

// Fake "admin.database()" wrapper
export function getDatabase() {
  return {
    ref(path) {
      const base = `${FIREBASE_URL}/${path}.json`;

      return {
        async once(_type) {
          const res = await fetch(base);
          const val = await res.json();
          return { val: () => val };
        },
        async set(data) {
          const res = await fetch(base, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return res.json();
        },
        async push() {
          const newRefUrl = `${FIREBASE_URL}/orders.json`;
          return {
            async set(data) {
              const res = await fetch(newRefUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              return res.json();
            }
          };
        }
      };
    }
  };
}