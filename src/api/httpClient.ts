export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

interface RequestOptions {
  token?: string;
}

class HttpClient {
  private baseURL = "";

  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.baseURL + endpoint;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Error desconocido");
        throw new HttpError(
          errorText || `HTTP ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new HttpError("Error de red", 0);
      }

      throw new HttpError("Error desconocido", 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("POST", endpoint, body, options);
  }

  async patch<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, body, options);
  }
}

export const httpClient = new HttpClient();
