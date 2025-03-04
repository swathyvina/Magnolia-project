// api.js
export const updateTest = async (testId, requestData) => {
    try {
      const token=localStorage.getItem("authToken")
      const response = await fetch(`https://api.teknologiunggul.com/entities/lab_test/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,   
           "orgid": "intern_test",


        },
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
  