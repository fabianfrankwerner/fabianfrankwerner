const API = process.env.VITE_API_URL || "http://localhost:3000";

async function get(path) {
  const res = await fetch(`${API}${path}`, { credentials: "include" });
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export { get, post };
