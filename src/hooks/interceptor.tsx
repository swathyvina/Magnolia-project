// requestInterceptor.ts

// Define the type for the options parameter
interface RequestOptions extends RequestInit {
    headers?: HeadersInit;
    body?: BodyInit | null;
  }
  
  // Define the requestInterceptor function with the appropriate types
  const requestInterceptor = async (url: string, options: RequestOptions = {}): Promise<Response> => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.error("No auth token found. Please log in.");
      throw new Error("No auth token found.");
    }
  
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "orgid": "intern_test",
      ...options.headers, // Merge any additional headers passed in options
    };
  
    const fetchOptions: RequestOptions = {
      ...options,
      headers,
    };
  
    return fetch(url, fetchOptions);
  };
  
  export default requestInterceptor;
  