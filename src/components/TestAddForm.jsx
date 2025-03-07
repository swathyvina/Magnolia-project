import React, { useState, useEffect } from "react";
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
  Fab,
  CardContent,
  Box,
} from "@mui/material";
import { postLabTest } from "../hooks/apipost";
import { updateTest } from "../hooks/updatetest";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
const TestForm = ({ toggleForm, refreshTable }) => {
const [selectedValues, setSelectedValues] = useState({
    lab_test_id: "",
    test_name: "",
    method: "",
    short_name: "",
    uom: "",
    test_category: "",
    result_output_type: "",
    starting_value: "",
    ending_value: "",
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
  const [show, setShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasVisited, setHasVisited] = useState(false); 
  const [showConfig, setShowConfig] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showGuidelineForm, setShowGuidelineForm] = useState(false);
  const [formCount, setFormCount] = useState(0);
  const [hasGuidelines, setHasGuidelines] = useState(false);

  const shouldShowGuidelines =
    selectedValues.AgeBasedStandard !== "" &&
    selectedValues.GenderBasedStandard !== "" &&
    selectedValues.PregnancyFactorApplicable !== "";

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    console.log("Fetching test data for:", testId);

    if (!testId || !token) {
      const shouldShowGuidelines =
        selectedValues.AgeBasedStandard !== "" &&
        selectedValues.GenderBasedStandard !== "" &&
        selectedValues.PregnancyFactorApplicable !== "";
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
        
          const guidelinesExist = fetchedData.test_result_guidelines?.length > 0;
          console.log(guidelinesExist)
          setSelectedValues((prevState) => ({
            ...prevState,
            lab_test_id: fetchedData.test_id || prevState.lab_test_id,
            test_name: fetchedData.test_name || prevState.test_name, 
            method: fetchedData.method || prevState.method,
            short_name: fetchedData.short_name || prevState.short_name,
            uom: fetchedData.uom || prevState.uom,
            test_category: fetchedData.test_category || prevState.test_category,
            result_output_type:
              fetchedData.result_output_type || prevState.result_output_type,
            starting_value:
              fetchedData.starting_value || prevState.starting_value,
            ending_value: fetchedData.ending_value || prevState.ending_value,
            AgeBasedStandard:
              fetchedData.is_age_based_standard === true
                ? "Yes"
                : fetchedData.is_age_based_standard === false
                ? "No"
                : "",
            GenderBasedStandard:
              fetchedData.is_gender_based_standard === true
                ? "Yes"
                : fetchedData.is_gender_based_standard === false
                ? "No"
                : "",
            PregnancyFactorApplicable:
              fetchedData.is_pregnancy_factor_applicable === true
                ? "Yes"
                : fetchedData.is_pregnancy_factor_applicable === false
                ? "No"
                : "",
            IsEmpupdatethisresult: fetchedData.employee_test_applicable
              ? "Yes"
              : "No",
            IsImageUploadapplicable: fetchedData.is_image_upload_applicable
              ? "Yes"
              : "No",
            IsdoctorCommentsApplicable:
              fetchedData.is_doctor_comments_applicable ? "Yes" : "No",
            IsreportImpressionisRequired:
              fetchedData.is_report_impression_required ? "Yes" : "No",
            IsvalueRequired: fetchedData.is_value_applicable ? "Yes" : "No",
            test_result_guidelines: guidelinesExist ? fetchedData.test_result_guidelines : [],

            guideline_name: guidelinesExist ? fetchedData.test_result_guidelines[0].name : "",
            age_from: guidelinesExist ? fetchedData.test_result_guidelines[0].age_from : "",
            age_to: guidelinesExist ? fetchedData.test_result_guidelines[0].age_to : "",
            gender: guidelinesExist ? fetchedData.test_result_guidelines[0].gender : "",
            guideline_starting_value: guidelinesExist ? fetchedData.test_result_guidelines[0].starting_value : "",
            guideline_ending_value: guidelinesExist ? fetchedData.test_result_guidelines[0].ending_value : "",
          }));
        } else {
          console.error("No data found in response:", res);
        }
      })
      .catch((error) => console.error("Error fetching test:", error));
  }, [testId, token]);

  const handleTextareaChange = (event) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      additionalComments: event.target.value,
    }));
  };
  const handleConfigClick = () => {
    setShowConfig(!showConfig);
    if (showConfig) {
      setShowGuidelines(false);
      setShowGuidelineForm(false);
    }
  };

 
  const handleGuidelinesClick = () => {
    if (shouldShowGuidelines) {
      if (!hasVisited) {
        setHasVisited(true); // Mark form as visited
      }
      setShowGuidelines(!showGuidelines);
      setShowConfig(false);
      setShowGuidelineForm(true); // Show the form directly
    }
  };
  
  const handleAddForm = () => {
    setFormCount((prev) => prev + 1);
    setShowGuidelineForm(true);
    setShowGuidelines(false);
  };

  const handleRemoveForm = (index) => {
    setFormCount(prev => Math.max(0, prev - 1));
    if (formCount <= 1) {
      setShowGuidelineForm(false);
      setShowGuidelines(true);
    }
  };
  const handleDropdownChange = (event, field) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true); // Mark form as submitted
    if (
      !selectedValues.lab_test_id.trim() ||
      !selectedValues.test_name.trim()
    ) {
      return; 
    
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
      ...(selectedValues.AgeBasedStandard && {
        is_age_based_standard: selectedValues.AgeBasedStandard === "Yes",
      }),
      ...(selectedValues.GenderBasedStandard && {
        is_gender_based_standard: selectedValues.GenderBasedStandard === "Yes",
      }),
      ...(selectedValues.PregnancyFactorApplicable && {
        is_pregnancy_factor_applicable:
          selectedValues.PregnancyFactorApplicable === "Yes",
      }),

      employee_test_applicable: selectedValues.IsEmpupdatethisresult === "Yes",
      is_image_upload_applicable:
        selectedValues.IsImageUploadapplicable === "Yes",
      is_doctor_comments_applicable:
        selectedValues.IsdoctorCommentsApplicable === "Yes",
      is_report_impression_required:
        selectedValues.IsreportImpressionisRequired === "Yes",
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
                variant="filled"
                value={selectedValues.lab_test_id}
                onChange={handleInputChange}
                error={isSubmitted && !selectedValues.lab_test_id.trim()}
                helperText={
                  isSubmitted && !selectedValues.lab_test_id.trim()
                    ? "This field is required"
                    : ""
                }
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
                variant="filled"
                error={isSubmitted && !selectedValues.test_name.trim()}
                helperText={
                  isSubmitted && !selectedValues.test_name.trim()
                    ? "This field is required"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Method"
                name="method"
                value={selectedValues.method}
                onChange={handleInputChange}
                variant="filled"
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
                variant="filled"
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
                variant="filled"
              />
            </Grid>
          </Grid>

          {/* Third Row: Select Inputs */}
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  id="test-category-select"
                  select
                  label="Test Category"
                  name="test_category"
                  value={selectedValues.test_category}
                  onChange={(event) =>
                    handleDropdownChange(event, "test_category")
                  }
                  variant="filled"
                >
                  <MenuItem value="haematology">Haematology</MenuItem>
                  <MenuItem value="microbiology">Microbiology</MenuItem>
                  <MenuItem value="pathology">Pathology</MenuItem>
                  <MenuItem value="radiology">Radiology</MenuItem>
                  <MenuItem value="vitals">Vitals</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Result Output Type</InputLabel>
                <Select
                  name="result_output_type"
                  value={selectedValues.result_output_type}
                  onChange={(event) =>
                    handleDropdownChange(event, "result_output_type")
                  }
                >
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="string">String</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Standard Ref.Start Value"
                name="starting_value"
                value={selectedValues.starting_value}
                onChange={handleInputChange}
                variant="filled"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Standard Ref.End Value"
                name="ending_value"
                value={selectedValues.ending_value}
                onChange={handleInputChange}
                variant="filled"
              />
            </Grid>
          </Grid>

          {/* Configuration and Guidelines */}
          {/* Configuration and Guidelines Headers */}
          <Grid container spacing={2} marginTop={2} className="mt-8">
            <Grid item xs={shouldShowGuidelines ? 6 : 12}  className="config">
              <Button
               
                onClick={handleConfigClick}
                variant="filled"
                
               
                
                endIcon={
                  showConfig ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )
                }
              >
                Configuration
              </Button>
            </Grid>
            {shouldShowGuidelines && (
              <Grid item xs={6} className="result-guidelines">
                <Button
                  fullWidth
                  onClick={handleGuidelinesClick}
                  className="justify-between"
                  variant="filled"
                  endIcon={
                    showGuidelines ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )
                  }
                >
                  Test Result Reference Guidelines
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Configuration Section */}
          {showConfig && (
            <Grid container spacing={2} className="mt-4">
              {[
                "AgeBasedStandard",
                "GenderBasedStandard",
                "PregnancyFactorApplicable",
                "IsEmpupdatethisresult",
                "IsImageUploadapplicable",
                "IsdoctorCommentsApplicable",
                "IsreportImpressionisRequired",
                "IsvalueRequired",
              ].map((field) => (
                <Grid item xs={3} key={field}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </InputLabel>
                    <Select
                      value={selectedValues[field]}
                      onChange={(e) => handleDropdownChange(e, field)}
                      label={field.replace(/([A-Z])/g, " $1").trim()}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Guidelines Section */}
          { shouldShowGuidelines && showGuidelines && !showGuidelineForm && (
            <Box className="flex justify-center mt-4">
              <Fab color="primary" onClick={handleAddForm} size="medium">
                < AddIcon className="w-5 h-5" />
              </Fab>
            </Box>
          )}

          {/* Guidelines Form */}
          {showGuidelineForm && shouldShowGuidelines &&  !showConfig&&(
            <Box className="space-y-4 mt-4">
              {[...Array(formCount)].map((_, index) => (
                <Card key={index} variant="filled" className="p-4">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Reference Name"
                        name={`guideline_name_${index}`}
                        variant="filled"
                      />
                    </Grid>
                    {selectedValues.AgeBasedStandard === "Yes" && (
                      <>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            label="Age From"
                            type="number"
                            name={`age_from_${index}`}
                            variant="filled"
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            label="Age To"
                            type="number"
                            name={`age_to_${index}`}
                            variant="filled"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedValues.GenderBasedStandard === "Yes" && (
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="filled">
                          <InputLabel>Gender</InputLabel>
                          <Select label="Gender" name={`gender_${index}`}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Starting Value"
                        name={`starting_value_${index}`}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Ending Value"
                        name={`ending_value_${index}`}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} className="flex justify-end">
                      <IconButton onClick={() => handleRemoveForm(index)}>
                        <DeleteIcon className="w-5 h-5" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              ))}
              <Box className="flex justify-center">
                <Fab color="primary" onClick={handleAddForm} size="medium">
                  <AddIcon className="w-5 h-5" />
                </Fab>
              </Box>
            </Box>
          )}

          {/* TextArea for Additional Comments */}
          <Box className="textarea-container">
            <TextField
              fullWidth
              label="Test Description"
              value={selectedValues.additionalComments}
              onChange={handleTextareaChange}
              variant="filled"
            />
          </Box>

          {/* Buttons */}
          <Box className="option-btn">
            <Button
              variant="outlined"
              onClick={() => navigate("/TestTable")}
              className="cancel"
            >
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
