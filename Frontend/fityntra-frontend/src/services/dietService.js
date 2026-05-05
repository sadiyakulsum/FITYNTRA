import API_BASE_URL from "./api";

export async function getDiet(data) {
  const res = await fetch(`${API_BASE_URL}/predict/diet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}