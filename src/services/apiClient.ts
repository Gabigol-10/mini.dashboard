const BASE_URL = "https://jsonplaceholder.typicode.com";

interface ApiError {
  status: number;
  message: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(path: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${path}`);

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }

      // Network error
      const networkError: ApiError = {
        status: 0,
        message: "Error de red. Verifica tu conexión.",
      };
      throw networkError;
    }
  }
}

export const apiClient = new ApiClient(BASE_URL);
