const API_BASE = "http://localhost:8080/api/admin";

/* =========================
   GET ALL USERS
========================= */
export const fetchAdminUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};


/* =========================
   APPROVE USER
========================= */
export const approveUser = async (userId) => {
  const response = await fetch(`${API_BASE}/users/${userId}/approve`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to approve user");
  }

  return response.json();
};

/* =========================
   SUSPEND USER
========================= */
export const suspendUser = async (userId) => {
  const response = await fetch(`${API_BASE}/users/${userId}/suspend`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to suspend user");
  }

  return response.json();
};

/* =========================
   ACTIVATE USER
========================= */
export const activateUser = async (userId) => {
  const response = await fetch(`${API_BASE}/users/${userId}/activate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to activate user");
  }

  return response.json();
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};
