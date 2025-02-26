
export const postLabTest = async (requestData) => {
    try {
      const token = localStorage.getItem("authtoken");
    console.log(requestData);
  
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/entities/lab_test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "orgid": "intern_test",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData), 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  };
  