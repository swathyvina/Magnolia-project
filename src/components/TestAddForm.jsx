import React, { useState,useEffect } from "react";
import "./TestAddForm.css";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { postLabTest } from "../hooks/apipost"
import { updateTest } from "../hooks/updatetest";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const TestForm = ({ toggleForm ,refreshTable}) => {


  const [selectedValues, setSelectedValues] = useState({
    lab_test_id: "",
    test_name: "",
    method: "",
    short_name: "",
    uom: "",
    test_category: "", 
    result_output_type: "",
    starting_value:"",
    ending_value:"",
    AgeBasedStandard: "",
    GenderBasedStandard: "",
    PregnancyFactorApplicable: "",
    IsEmpupdatethisresult: "No",
    IsImageUploadapplicable: "No",
    IsdoctorCommentsApplicable: "No",
    IsreportImpressionisRequired: "No",
    IsvalueRequired: "Yes",
    additionalComments: "",
    test_result_guidelines: [],
    guideline_name: "",
    age_from: "",
    age_to: "",
    gender: "",
    guideline_starting_value: "",
    guideline_ending_value: "",
  });

  const { testId } = useParams();
  const navigate = useNavigate(); 
  

  const token = localStorage.getItem("authToken");


  useEffect(() => {
    console.log("Fetching test data for:", testId);

    if (!testId || !token) {
      console.error("Missing testId or token!");
      return;
    }

    fetch(`https://api.teknologiunggul.com/entities/lab_test/${testId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        orgid: "intern_test",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          console.log("Fetched data:", res.data[0]);

          const fetchedData = res.data[0];
          const firstGuideline = fetchedData.test_result_guidelines?.[0] || {};

          setSelectedValues((prevState) => ({
            ...prevState,
            lab_test_id: fetchedData.test_id || prevState.lab_test_id,
            test_name: fetchedData.test_name || prevState.test_name,
            method: fetchedData.method || prevState.method,
            short_name: fetchedData.short_name || prevState.short_name,
            uom: fetchedData.uom || prevState.uom,
            test_category: fetchedData.test_category || prevState.test_category,
            result_output_type: fetchedData.result_output_type || prevState.result_output_type,
            starting_value: fetchedData.starting_value || prevState.starting_value,
            ending_value: fetchedData.ending_value || prevState.ending_value,
            AgeBasedStandard: fetchedData.is_age_based_standard === true ? "Yes" : fetchedData.is_age_based_standard === false ? "No" : "",
            GenderBasedStandard: fetchedData.is_gender_based_standard === true ? "Yes" : fetchedData.is_gender_based_standard === false ? "No" : "",
            PregnancyFactorApplicable: fetchedData.is_pregnancy_factor_applicable === true ? "Yes" : fetchedData.is_pregnancy_factor_applicable === false ? "No" : "",
            IsEmpupdatethisresult: fetchedData.employee_test_applicable ? "Yes" : "No",
            IsImageUploadapplicable: fetchedData.is_image_upload_applicable ? "Yes" : "No",
            IsdoctorCommentsApplicable: fetchedData.is_doctor_comments_applicable ? "Yes" : "No",
            IsreportImpressionisRequired: fetchedData.is_report_impression_required ? "Yes" : "No",
            IsvalueRequired: fetchedData.is_value_applicable ? "Yes" : "No",
            guideline_name: firstGuideline.name || prevState.guideline_name, 
            age_from: firstGuideline.age_from || prevState.age_from,
            age_to: firstGuideline.age_to || prevState.age_to,
            gender: firstGuideline.gender || prevState.gender,
            guideline_starting_value: firstGuideline.starting_value || prevState.guideline_starting_value,
            guideline_ending_value: firstGuideline.ending_value || prevState.guideline_ending_value,

            test_result_guidelines: fetchedData.test_result_guidelines || [],
          }));
        } else {
          console.error("No data found in response:", res);
        }
      })
      .catch((error) => console.error("Error fetching test:", error));
  }, [testId, token]);


  const [selectedGender, setSelectedGender] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); 


  
 const [showGuidelinesForm, setShowGuidelinesForm] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleDropdownChange = (event, key) => {
    console.log(`Updating ${key} to:`, event.target.value);
    setSelectedValues((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };
  
  const handleTextareaChange = (event) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      additionalComments: event.target.value,
    }));
  };


 

  const handleSubmit = async () => {
    setIsSubmitted(true); // Mark form as submitted

    if (!selectedValues.lab_test_id.trim() || !selectedValues.test_name.trim()) {
      return; // Stop submission if required fields are empty
    }
    
      
  

    const requestData = {
      test_id: selectedValues.lab_test_id,
      test_name: selectedValues.test_name,
      method: selectedValues.method,
      short_name: selectedValues.short_name,
      uom: selectedValues.uom,
      test_category: selectedValues.test_category,
      result_output_type: selectedValues.result_output_type,

      starting_value: Number(selectedValues.starting_value) || 0,
      ending_value: Number(selectedValues.ending_value) || 0,
      ...(selectedValues.AgeBasedStandard && { is_age_based_standard: selectedValues.AgeBasedStandard === "Yes" }),
      ...(selectedValues.GenderBasedStandard && { is_gender_based_standard: selectedValues.GenderBasedStandard === "Yes" }),
      ...(selectedValues.PregnancyFactorApplicable && { is_pregnancy_factor_applicable: selectedValues.PregnancyFactorApplicable === "Yes" }),
      
      employee_test_applicable: selectedValues.IsEmpupdatethisresult === "Yes",
      is_image_upload_applicable: selectedValues.IsImageUploadapplicable === "Yes",
      is_doctor_comments_applicable: selectedValues.IsdoctorCommentsApplicable === "Yes",
      is_report_impression_required: selectedValues.IsreportImpressionisRequired === "Yes",
      is_value_applicable: selectedValues.IsvalueRequired === "Yes",
      description: selectedValues.additionalComments,

 
      test_result_guidelines: [
        ...(selectedValues.test_result_guidelines || []),
        selectedValues.guideline_name
          ? {
              name: selectedValues.guideline_name,
              age_from: Number(selectedValues.age_from) || 0,
              age_to: Number(selectedValues.age_to) || 0,
              gender: selectedValues.gender || "",
              starting_value: selectedValues.guideline_starting_value || "",
              ending_value: selectedValues.guideline_ending_value || "",
            }
          : null,
      ].filter(Boolean), 
    };

    try {
      let response;
      if (testId) {
        response = await updateTest(testId, requestData); 
        alert("Lab test updated successfully!");
      } else {
        response = await postLabTest(requestData);
        alert("Lab test added successfully!");
      }

      console.log("Success:", response);
      navigate("/TestTable");
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing request. Check console for details.");
    }
  };
  
  const shouldShowGuidelines =
    selectedValues.AgeBasedStandard !== "" &&
    selectedValues.GenderBasedStandard !== "" &&
    selectedValues.PregnancyFactorApplicable !== "";

  return (
    <Container minWidth="700px">
      <Card className="card">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Test- {testId ? "Update" : "Add"} 
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField 
                fullWidth 
                label="Lab Test ID" 
                name="lab_test_id" 
                required 
                value={selectedValues.lab_test_id}
                onChange={handleInputChange}
                error={isSubmitted && !selectedValues.lab_test_id.trim()} // Show error only after submission
                helperText={isSubmitted && !selectedValues.lab_test_id.trim() ? "This field is required" : ""}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField 
                fullWidth 
                label="Name" 
                name="test_name"
                required 
                value={selectedValues.test_name}
                onChange={handleInputChange}
                error={isSubmitted && !selectedValues.lab_test_id.trim()} // Show error only after submission
                helperText={isSubmitted && !selectedValues.lab_test_id.trim() ? "This field is required" : ""}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField 
                fullWidth 
                label="Method" 
                name="method"
                value={selectedValues.method}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Second Row */}
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Short Name" 
                name="short_name"
                value={selectedValues.short_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Unit of Measurement" 
                name="uom"
                value={selectedValues.uom}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Third Row: Select Inputs */}
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Test Category</InputLabel>
                <Select
                  name="test_category"
                  value={selectedValues.test_category}
                  onChange={(event) => handleDropdownChange(event, "test_category")}
                >
                  <MenuItem value="haematology">Haematology</MenuItem>
                  <MenuItem value="microbiology">Microbiology</MenuItem>
                  <MenuItem value="pathology">Pathology</MenuItem>
                  <MenuItem value="radiology">Radiology</MenuItem>
                  <MenuItem value="vitals">Vitals</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Result Output Type</InputLabel>
                <Select
                  name="result_output_type"
                  value={selectedValues.result_output_type}
                  onChange={(event) => handleDropdownChange(event, "result_output_type")}
                >
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="string">String</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
         {/* Second Row */}
         <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Standard Ref.Start Value" 
                name="starting_value"
                value={selectedValues.starting_value}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Standard Ref.End Value" 
                name="ending_value"
                value={selectedValues.ending_value}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>


          {/* Configuration and Guidelines */}
          {/* Configuration and Guidelines */}
          <Box marginTop={3}>
            <Grid container spacing={2}>
              {/* Configuration Section */}
              {!showGuidelinesForm ? (
                <Grid item xs={shouldShowGuidelines ? 6 : 12}>
                  <Typography variant="h6" className="config">
                    Configuration
                  </Typography>
                 
                </Grid>
              ) : null}

              {/* Test Result Reference Guideline (Initially Half Width) */}
              {shouldShowGuidelines && !showGuidelinesForm && (
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    className="result-guidelines"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowGuidelinesForm(true)}
                  >
                    Test Result Reference Guideline {showGuidelinesForm ? "-" : "+"}
                  </Typography>
                </Grid>
              )}

              {/* Test Result Reference Guideline (Expands to Full Width) */}
              {showGuidelinesForm && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    className="result-guidelines"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowGuidelinesForm(false)}
                  >
                    Test Result Reference Guideline -
                  </Typography>
                  <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Ref Name" />
                    </Grid>
                    {selectedValues.AgeBasedStandard === "Yes" && (
                      <>
                        <Grid item xs={3}>
                          <TextField fullWidth label="Age From" type="number" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField fullWidth label="Age To" type="number" />
                        </Grid>
                      </>
                    )}
                    {selectedValues.GenderBasedStandard === "Yes" && (
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <TextField fullWidth label="Starting Value" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Ending Value" />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>

          

          {/* Selection Dropdowns */}
          {!showGuidelinesForm && (
            <div>
            <Grid container spacing={2} marginTop={2}>
              {[
                "AgeBasedStandard",
                "GenderBasedStandard",
                "PregnancyFactorApplicable",
                "IsEmpupdatethisresult",
                "IsImageUploadapplicable",
                "IsdoctorCommentsApplicable",
                "IsreportImpressionisRequired",
                "IsvalueRequired",
              ].map((key) => (
                <Grid item xs={3} key={key} >
                  <FormControl fullWidth >
                    <InputLabel>{key.replace(/([A-Z])/g, " $1").trim()}</InputLabel>
                    <Select value={selectedValues[key]} onChange={(e) => handleDropdownChange(e, key)}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
            </div>
          )}

          {/* TextArea for Additional Comments */}
          <Box className="textarea-container">
            <TextField
              fullWidth
              label="Test Description"
              value={selectedValues.additionalComments}
              onChange={handleTextareaChange}
            />
          </Box>

          {/* Buttons */}
          <Box className="option-btn">
            <Button variant="outlined"   onClick={() => navigate("/TestTable")}  className="cancel">
              Cancel
            </Button>
            <Button variant="contained" className="save" onClick={handleSubmit}>
            {testId ? "Update" : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TestForm;


