const API_BASE = "https://mare-backend-production.up.railway.app";

function getToken() {
  return window.__mareToken || null;
}
function setToken(token) {
  window.__mareToken = token;
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
}

export const api = {
  setToken,
  getToken,

  listCities: () => request("/cities", { auth: false }),

  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),

  login: (phone, password) =>
    request("/auth/login", { method: "POST", body: { phone, password }, auth: false }),

  requestRide: (payload) => request("/rides", { method: "POST", body: payload }),

  getRide: (id) => request(`/rides/${id}`),

  updateRideStatus: (id, status) =>
    request(`/rides/${id}/status`, { method: "PATCH", body: { status } }),
};
