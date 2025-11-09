const API_BASE_URL = 'http://192.168.1.4:3001/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Patient Cases
  async getPatientCases(userId: string, role: string) {
    return this.request(`/cases?userId=${userId}&role=${role}`);
  }

  async getPatientCase(caseId: string) {
    return this.request(`/cases/${caseId}`);
  }

  // Evaluations
  async submitEvaluation(evaluation: any) {
    return this.request('/evaluations', {
      method: 'POST',
      body: JSON.stringify(evaluation),
    });
  }

  // Reviews
  async submitReview(review: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Prescriptions
  async generatePrescription(caseId: string) {
    return this.request('/prescriptions/generate', {
      method: 'POST',
      body: JSON.stringify({ caseId }),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);