import axios from "axios";

export async function getCsrfToken() {
  const response = await axios.get("http://localhost:4000/users");
  return response.data[0];
}
