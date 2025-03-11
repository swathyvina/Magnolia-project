
import apiClient from "./interceptor.tsx";

interface TestRequestData {
  name: string;
  description: string;
}

interface TestResponse {
  data?: any;
}

interface ErrorResponse {
  message: string;
}


// PUT request
export const updateTest = async ( testId: string, requestData: TestRequestData): Promise<any> => {
  try {
    const response = await apiClient.put(`/entities/lab_test/${testId}`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error updating test:", error);
    throw error;
  }
};




//POST request
export const createTest = async (requestData: TestRequestData): Promise<any> => {
  try {
    const response = await apiClient.post("/entities/lab_test", requestData);
    return response.data;
  } catch (error) {
    console.error("Error creating test:", error);
    throw error;
  }
};
//fetch
export const fetchTests = async () => {
  try {
    const response = await apiClient.post('/entities/filter/lab_test', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};
//delete
export const deleteTest = async (testId: string) => {
  try {
    const response = await apiClient.delete(`/entities/lab_test/${testId}`);
    return response.status === 200;
  } catch (error) {
    console.error('Error deleting lab test:', error);
    throw error;
  }
};