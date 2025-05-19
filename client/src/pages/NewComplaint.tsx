import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Category {
  category_id: number;
  category_title: string;
}

interface Module {
  module_id: number;
  module_name: string;
}

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

  // API data
  const [modules, setModules] = useState<Module[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

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

  // Reordered steps
  const steps = [
    "Personal Information",
    "Title & Category",
    "Issue Details",
    "Media",
  ];

  // Fetch modules on component mount
  useEffect(() => {
    async function fetchModules() {
      setLoadingModules(true);
      try {
        const res = await fetch(`${process.env.VITE_APP_API_URL}/modules`);
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        setModules(data);
      } catch (error) {
        console.error("Failed to fetch modules", error);
        toast.error("Failed to load modules");
      } finally {
        setLoadingModules(false);
      }
    }

    fetchModules();
  }, []);

  // Fetch categories when module changes
  useEffect(() => {
    async function fetchCategories() {
      if (!module) {
        setFilteredCategories([]);
        return;
      }

      setLoadingCategories(true);
      try {
        const res = await fetch(
          `${process.env.VITE_APP_API_URL}/categories/id/${module}`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setFilteredCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    // Also fetch all categories for initial load
    async function fetchAllCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${process.env.VITE_APP_API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchAllCategories();
    if (module) fetchCategories();
  }, [module]);

  const handleNext = () => {
    const newErrors = { ...errors };

    if (activeStep === 0) {
      newErrors.idNumber = idNumber.trim() === "";
      newErrors.fullName = fullName.trim() === "";
      newErrors.phoneNumber = phoneNumber.trim() === "";
      newErrors.location = location.trim() === "";

      setErrors(newErrors);

      if (
        newErrors.idNumber ||
        newErrors.fullName ||
        newErrors.phoneNumber ||
        newErrors.location
      )
        return;
    }

    if (activeStep === 1) {
      newErrors.title = title.trim() === "";
      newErrors.category = category.trim() === "";
      newErrors.module = module.trim() === "";

      setErrors(newErrors);
      if (newErrors.title || newErrors.category || newErrors.module) return;
    }

    if (activeStep === 2) {
      newErrors.description = description.trim() === "";

      setErrors(newErrors);
      if (newErrors.description) return;
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
      formData.append("module_id", module);
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

      const response = await fetch(`${process.env.VITE_APP_API_URL}/tickets`, {
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

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
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
              Your issue has been submitted successfully! Redirecting to home
              page...
            </Alert>
          ) : (
            <>
              {activeStep === 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 3 }}
                  >
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
                        helperText={
                          errors.idNumber ? "ID Number is required" : ""
                        }
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
                        helperText={
                          errors.fullName ? "Full Name is required" : ""
                        }
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
                        helperText={
                          errors.phoneNumber ? "Phone Number is required" : ""
                        }
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
                        helperText={
                          errors.location ? "Location is required" : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 3 }}
                  >
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
                      <FormControl fullWidth error={errors.module}>
                        <InputLabel id="module-label">Module</InputLabel>
                        <Select
                          labelId="module-label"
                          value={module}
                          label="Module"
                          onChange={(e) => {
                            setModule(e.target.value);
                            setErrors({ ...errors, module: false });
                            setCategory(""); // Reset category when module changes
                          }}
                        >
                          {loadingModules ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} />
                              &nbsp;Loading...
                            </MenuItem>
                          ) : (
                            modules.map((mod) => (
                              <MenuItem
                                key={mod.module_id}
                                value={mod.module_id.toString()}
                              >
                                {mod.module_name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.module && (
                          <FormHelperText>Module is required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={errors.category}
                        disabled={!module}
                      >
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
                          {loadingCategories ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} />
                              &nbsp;Loading...
                            </MenuItem>
                          ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <MenuItem
                                key={cat.category_id}
                                value={cat.category_id.toString()}
                              >
                                {cat.category_title}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {module
                                ? "No categories available for this module"
                                : "Select a module first"}
                            </MenuItem>
                          )}
                        </Select>
                        {errors.category && (
                          <FormHelperText>Category is required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 3 }}
                  >
                    Describe the issue details
                  </Typography>
                  <Grid container spacing={2}>
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
                        helperText={
                          errors.description ? "Description is required" : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 3 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 3 }}
                  >
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
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
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

              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
              >
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
