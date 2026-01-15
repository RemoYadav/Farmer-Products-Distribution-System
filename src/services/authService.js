export const getMe = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  return response.json();
};
export default { getMe };
