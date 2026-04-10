const firebaseURL = 'https://school-2340a-default-rtdb.europe-west1.firebasedatabase.app/' // Replace with your Firebase URL

const validUsername = "admin";
const validPassword = "admin123";

document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === validUsername && pass === validPassword) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminActions").style.display = "block";
    loadResponses();
  } else {
    alert("Invalid credentials.");
  }
};

function loadResponses() {
  fetch(`${firebaseURL}/responses.json`)
    .then(res => res.json())
    .then(data => {
      const out = document.getElementById("output");
      if (!data) {
        out.textContent = "No data found.";
        return;
      }

      const rows = [];
      for (const key in data) {
        const r = data[key];
        rows.push([
          `"${r.q1 || ''}"`,
          `"${(r.q2 || []).join(';')}"`,
          `"${r.q3 || ''}"`,
          `"${r.q4 || ''}"`
        ]);
      }

      const csv = "Q1,Q2,Q3,Q4\n" + rows.map(r => r.join(",")).join("\n");
      out.textContent = csv;

      document.getElementById("exportBtn").onclick = () => {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "responses.csv";
        a.click();
      };

      document.getElementById("deleteBtn").onclick = () => {
        if (confirm("Are you sure you want to delete all responses?")) {
          fetch(`${firebaseURL}/responses.json`, { method: "DELETE" }).then(() => {
            alert("All responses deleted.");
            out.textContent = "";
          });
        }
      };
    });
}
