

  
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


// export const fetchTests = async () => {
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts");
//     const data = await response.json();

//     // Convert dummy API response to match your structure
//     return data.map((item) => ({
//       id: item.id.toString(),  // Convert number to string if needed
//       name: item.title,
//       shortName: item.title.substring(0, 5),
//       uom: "Unit",
//       createdOn: new Date().toISOString().split("T")[0], // Example date
//     }));
//   } catch (error) {
//     console.error("Error fetching tests:", error);
//     return [];
//   }
// };
