import React, { useState } from "react";
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
import { postLabTest } from "../hooks/apipost";

const TestForm = ({ toggleForm ,refreshTable}) => {
  const [selectedValues, setSelectedValues] = useState({
    lab_test_id: "",
    test_name: "",
    method: "",
    short_name: "",
    uom: "",
    AgeBasedStandard: "",
    GenderBasedStandard: "",
    PregnancyFactorApplicable: "",
    IsEmpupdatethisresult: "No",
    IsImageUploadapplicable: "No",
    IsdoctorCommentsApplicable: "No",
    IsreportImpressionisRequired: "No",
    IsvalueRequired: "Yes",
    additionalComments: "",
  });

  const [showGuidelinesForm, setShowGuidelinesForm] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle dropdown change
  const handleDropdownChange = (event, key) => {
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
    const requestData = {
      test_id: selectedValues.lab_test_id,
      test_name: selectedValues.test_name,
      method: selectedValues.method,
      short_name: selectedValues.short_name,
      uom: selectedValues.uom,
      starting_value: Number(selectedValues.starting_value) || 0,
      ending_value: Number(selectedValues.ending_value) || 0,
      is_age_based_standard: selectedValues.AgeBasedStandard === "Yes",
      is_gender_based_standart: selectedValues.GenderBasedStandard === "Yes",
      is_pregnancy_factor_applicable: selectedValues.PregnancyFactorApplicable === "Yes",
      employee_test_applicable: selectedValues.IsEmpupdatethisresult === "Yes",
      is_image_upload_applicable: selectedValues.IsImageUploadapplicable === "Yes",
      is_doctor_comments_applicable: selectedValues.IsdoctorCommentsApplicable === "Yes",
      is_report_impression_required: selectedValues.IsreportImpressionisRequired === "Yes",
      is_value_applicable: selectedValues.IsvalueRequired === "Yes",
      description: selectedValues.additionalComments,
      test_result_guidelines: [
        {
          name: selectedValues.guideline_name || "Default",
          age_from: Number(selectedValues.age_from) || 0,
          age_to: Number(selectedValues.age_to) || 0,
          gender: selectedValues.gender || "Unspecified",
          starting_value: selectedValues.guideline_starting_value || "0",
          ending_value: selectedValues.guideline_ending_value || "0"
        }
      ]
    };
  
    try {
      const response = await postLabTest(requestData);
      console.log("Data successfully posted:", response);
      alert("Lab test added successfully!");
      refreshTable();
      toggleForm(false);
    } catch (error) {
      console.error("Error posting lab test:", error);
      alert("Error posting lab test. Check the console for details.");
    }
  };
  


  // Show Guidelines only if all three are "Yes"
  const shouldShowGuidelines =
    selectedValues.AgeBasedStandard !== "" &&
    selectedValues.GenderBasedStandard !== "" &&
    selectedValues.PregnancyFactorApplicable !== "";

  return (
    <Container maxWidth="md">
      <Card className="card">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Test-Add
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
                  onChange={handleDropdownChange}
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
                  onChange={handleDropdownChange}
                >
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="string">String</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Configuration and Guidelines */}
          <Box marginTop={3}>
            <Typography variant="h6" className="config">
              Configuration
            </Typography>

            {shouldShowGuidelines && (
              <Box>
                <Typography
                  variant="h6"
                  className="result-guidelines"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowGuidelinesForm(!showGuidelinesForm)}
                >
                  Test Result Reference Guideline {showGuidelinesForm ? "-" : "+"}
                </Typography>
                {showGuidelinesForm && (
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
                        <TextField fullWidth label="Gender" />
                      </Grid>
                    )}
                   
                    <Grid item xs={6}>
                      <TextField fullWidth label="Starting Value" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Ending Value" />
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </Box>

          {/* Selection Dropdowns */}
          {!showGuidelinesForm && (
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
                <Grid item xs={6} key={key}>
                  <FormControl fullWidth>
                    <InputLabel>{key.replace(/([A-Z])/g, " $1").trim()}</InputLabel>
                    <Select value={selectedValues[key]} onChange={(e) => handleDropdownChange(e, key)}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
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
            <Button variant="outlined" onClick={() => toggleForm(false)} className="cancel">
              Cancel
            </Button>
            <Button variant="contained" className="save" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TestForm;

