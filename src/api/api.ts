const API_URL = import.meta.env.VITE_API_URL;

export const baseFetch = (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const BASE_URL = `${API_URL}/api/`;

  return fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
};

export const baseAuthenticatedFetch = (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const BASE_URL = `${API_URL}/api/`;
  const authToken = localStorage.getItem("token");
  return fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });
};
