

  
export const fetchTests = async () => {
  const API_URL = "https://api.teknologiunggul.com/entities/filter/lab_test";
  const token = localStorage.getItem("authToken");

  if (!token) {
      console.error("No auth token found. Please log in.");
      return [];
  }

  try {
      const response = await fetch(API_URL, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "orgid": "intern_test",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({}),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));
      return data?.data || [];
  } catch (error) {
      console.error("Error fetching data:", error);
      return [];
  }
};


