"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { CATEGORIES } from "../utils/mockData";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const NewComplaint: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);

  // Personal info
  const [idNumber, setIdNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  // Issue info
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");

  // Category
  const [category, setCategory] = useState("");

  // Media
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    idNumber: false,
    fullName: false,
    phoneNumber: false,
    location: false,
    title: false,
    module: false,
    description: false,
    category: false,
    files: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = ["Personal Information", "Issue Details", "Title & Category", "Media"];

  const handleNext = () => {
    const newErrors = { ...errors };

    if (activeStep === 0) {
      newErrors.idNumber = idNumber.trim() === "";
      newErrors.fullName = fullName.trim() === "";
      newErrors.phoneNumber = phoneNumber.trim() === "";
      newErrors.location = location.trim() === "";

      setErrors(newErrors);

      if (newErrors.idNumber || newErrors.fullName || newErrors.phoneNumber || newErrors.location) return;
    }

    if (activeStep === 1) {
      newErrors.module = module.trim() === "";
      newErrors.description = description.trim() === "";

      setErrors(newErrors);
      if (newErrors.module || newErrors.description) return;
    }

    if (activeStep === 2) {
      newErrors.title = title.trim() === "";
      newErrors.category = category.trim() === "";

      setErrors(newErrors);
      if (newErrors.title || newErrors.category) return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let fileSizeError = false;
    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        fileSizeError = true;
        continue;
      }
      if (files[i].type.startsWith("image/")) {
        newFiles.push(files[i]);
        newPreviewUrls.push(URL.createObjectURL(files[i]));
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setErrors({ ...errors, files: fileSizeError });
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    const newPreviews = [...filePreviewUrls];

    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setUploadedFiles(newFiles);
    setFilePreviewUrls(newPreviews);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("issuer_id_number", idNumber);
      formData.append("issuer_full_name", fullName);
      formData.append("issuer_phone_number", phoneNumber);
      formData.append("issuer_location", location);
      formData.append("ticket_module", module);
      formData.append("ticket_title", title);
      formData.append("ticket_description", description);
      formData.append("ticket_category", category);

      // You might need to provide default or placeholder values for these
      formData.append("issuer_avatar", "https://i.imgur.com/avatar.jpg"); // Or handle this differently
      formData.append("upvotes", "0");
      formData.append("downvotes", "0");
      formData.append("comments", "");
      formData.append("ticket_status", "Received");

      uploadedFiles.forEach((file) => {
        formData.append("media", file, file.name);
      });

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        body: formData,
      });

  

      if (!response.ok) {
        toast.error("Failed to submit ticket.");
        throw new Error("Failed to submit");
      }

      toast.success("Ticket submitted successfully!");
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(FormData);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Submit New Issue
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{ mb: 4 }}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {showSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your issue has been submitted successfully! Redirecting to home page...
            </Alert>
          ) : (
            <>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                    Please provide your personal information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="ID Number"
                        fullWidth
                        value={idNumber}
                        onChange={(e) => {
                          setIdNumber(e.target.value);
                          setErrors({ ...errors, idNumber: false });
                        }}
                        error={errors.idNumber}
                        helperText={errors.idNumber ? "ID Number is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setErrors({ ...errors, fullName: false });
                        }}
                        error={errors.fullName}
                        helperText={errors.fullName ? "Full Name is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        fullWidth
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setErrors({ ...errors, phoneNumber: false });
                        }}
                        error={errors.phoneNumber}
                        helperText={errors.phoneNumber ? "Phone Number is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Location"
                        fullWidth
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setErrors({ ...errors, location: false });
                        }}
                        error={errors.location}
                        helperText={errors.location ? "Location is required" : ""}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                    Describe the issue details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={errors.module}>
                        <InputLabel id="module-label">Module</InputLabel>
                        <Select
                          labelId="module-label"
                          value={module}
                          label="Module"
                          onChange={(e) => {
                            setModule(e.target.value);
                            setErrors({ ...errors, module: false });
                          }}
                        >
                          {CATEGORIES.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.module && <FormHelperText>Module is required</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        multiline
                        minRows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors({ ...errors, description: false });
                        }}
                        error={errors.description}
                        helperText={errors.description ? "Description is required" : ""}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                    Provide the title and category
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setErrors({ ...errors, title: false });
                        }}
                        error={errors.title}
                        helperText={errors.title ? "Title is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={errors.category}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          value={category}
                          label="Category"
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setErrors({ ...errors, category: false });
                          }}
                        >
                          {CATEGORIES.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && <FormHelperText>Category is required</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 3 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                    Upload media (optional)
                  </Typography>
                  <input
                    accept="image/*"
                    id="file-upload"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outlined" component="span">
                      Select Images
                    </Button>
                  </label>
                  {errors.files && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      Some files exceeded the 5MB size limit and were not added.
                    </Typography>
                  )}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {filePreviewUrls.map((url, idx) => (
                      <Grid item key={idx}>
                        <Box
                          sx={{
                            position: "relative",
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <img
                            src={url}
                            alt={`upload-preview-${idx}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(idx)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              minWidth: "auto",
                              padding: "2px 6px",
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NewComplaint;