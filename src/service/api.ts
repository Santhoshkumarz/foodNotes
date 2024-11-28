// Define the API URL
const API_URL = 'http://localhost:3001';

// Type for the food object (adjust this to match your actual data structure)
interface Food {
  id: number;
  name: string;
  description: string;
}

// Generic fetch function
const makeRequest = async <T>(method: string, url: string, data?: object): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${url}`, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData: T = await response.json();
    return responseData;
  } catch (error) {
    console.error(`Error with ${method} request to ${url}:`, error);
    throw error;
  }
};

// CRUD functions with type-safe API calls
const get = <T>(url: string): Promise<T> => makeRequest<T>('GET', url);
const post = <T>(url: string, data: object): Promise<T> => makeRequest<T>('POST', url, data);
const getById = <T>(url: string, id: number): Promise<T> => makeRequest<T>('GET', `${url}/${id}`);
const put = <T>(url: string, id: number, data: object): Promise<T> => makeRequest<T>('PUT', `${url}/${id}`, data);
const deleteRequest = <T>(url: string, id: number): Promise<T> => makeRequest<T>('DELETE', `${url}/${id}`);

export { get, post, getById, put, deleteRequest };
