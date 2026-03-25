const styles = `
:root {
    --bg: #f6f8fb;
    --card: #ffffff;
    --text: #1f2937;
    --border: #e5e7eb;
    --primary: #2563eb;
    --success: #16a34a;
    --danger: #dc2626;
    --radius: 14px;
}

* {
    box-sizing: border-box;
    font-family: system-ui, sans-serif;
}

body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
}

.app {
    max-width: 600px;
    margin: auto;
    padding: 16px;
}

.header h1 {
    margin-bottom: 16px;
}

.card {
    background: var(--card);
    padding: 16px;
    border-radius: var(--radius);
    margin-bottom: 16px;
    border: 1px solid var(--border);
}

input {
    width: 100%;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
}

.buttons {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
}

.btn.primary {
    background: var(--primary);
}

.btn.success {
    background: var(--success);
}

.btn.danger {
    background: var(--danger);
}

.list {
    list-style: none;
    padding: 0;
}

.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 10px;
}
`;

// inject styles into page
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);