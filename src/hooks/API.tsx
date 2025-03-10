import requestInterceptor from './interceptor.tsx';

// Define types for the requestData parameter and response
interface TestRequestData {
  // Define the structure of requestData as needed
  name: string;
  description: string;
}

interface TestResponse {
  // Define the structure of the response data
  data?: any;
}

interface ErrorResponse {
  message: string;
}

// Fetch Tests - GET request
export const fetchTests = async (): Promise<any[]> => {
  const API_URL = "https://api.teknologiunggul.com/entities/filter/lab_test";
  
  try {
    const response = await requestInterceptor(API_URL, {
      method: "POST",  // You can also use GET if required for fetching data
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: TestResponse = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Update Test - PUT request
export const updateTest = async (testId: string, requestData: TestRequestData): Promise<any> => {
  const url = `https://api.teknologiunggul.com/entities/lab_test/${testId}`;
  
  try {
    const response = await requestInterceptor(url, {
      method: "PUT",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating test:", error);
    throw error;
  }
};

// Create Test - POST request
export const createTest = async (requestData: TestRequestData): Promise<any> => {
  const url = "https://api.teknologiunggul.com/entities/lab_test";

  try {
    const response = await requestInterceptor(url, {
      method: "POST",   
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating test:", error);
    throw error;
  }
};
