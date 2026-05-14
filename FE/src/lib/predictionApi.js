import axios from 'axios';

const API_BASE = 'http://localhost:8001/api/v1/prediction';

export async function fetchProvinceSummaries() {
  const response = await axios.get(`${API_BASE}/summary`);
  return response.data;
}

export async function fetchProvinceDetail(provinceKey) {
  const response = await axios.get(`${API_BASE}/province/${provinceKey}`);
  return response.data;
}
