import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PlusCircle, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import { useAuth } from "../context/AuthContext";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "Received" | "Resolved";
}

const MySubmissions: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Always prompt for ID when component mounts
  useEffect(() => {
    const promptForId = () => {
      const enteredId = prompt("SHYIRAMO INDANGAMUNTU YAWE:");
      if (enteredId) {
        setUserId(enteredId);
      } else {
        // If user cancels prompt, ask again
        promptForId();
      }
    };
    
    // Use a small timeout to ensure the prompt appears after the component renders
    const timer = setTimeout(() => {
      promptForId();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserComplaints = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/tickets/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Complaint[] = await response.json();
        setUserComplaints(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserComplaints();
    }
  }, [userId, tab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const filteredComplaints = userComplaints.filter((complaint) => {
    if (tab === 0) return true;
    if (tab === 1) return complaint.status === "Pending";
    if (tab === 2) return complaint.status === "In Review";
    if (tab === 3) return complaint.status === "Resolved";
    return true;
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            My Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your submitted issues
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="submissions tabs"
            variant="fullWidth"
          >
            <Tab label="All" sx={{ textTransform: "none", fontWeight: tab === 0 ? "bold" : "normal" }} />
            <Tab icon={<Clock size={16} />} iconPosition="start" label="Received" sx={{ textTransform: "none", fontWeight: tab === 1 ? "bold" : "normal" }} />
            <Tab icon={<CheckCircle size={16} />} iconPosition="start" label="Resolved" sx={{ textTransform: "none", fontWeight: tab === 3 ? "bold" : "normal" }} />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        ) : (
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h6">No submissions found</Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't submitted any issues yet. Create your first submission to get started.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={20} />}
              component={RouterLink}
              to="/new-complaint"
              sx={{ mt: 2 }}
            >
              Submit New Issue
            </Button>
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Submission Statistics
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Total Submissions</Typography>
            <Typography variant="body1" fontWeight="medium">{filteredComplaints.length}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
            <Typography variant="body1" fontWeight="medium">{filteredComplaints.filter(c => c.status === "Pending").length}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">In Review</Typography>
            <Typography variant="body1" fontWeight="medium">{filteredComplaints.filter(c => c.status === "In Review").length}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Resolved</Typography>
            <Typography variant="body1" fontWeight="medium">{filteredComplaints.filter(c => c.status === "Resolved").length}</Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Average Response Time
          </Typography>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "rgba(255, 122, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              48h
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            On average, issues are responded to within 48 hours by the relevant department.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Tips for Effective Submissions
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">Be Specific</Typography>
            <Typography variant="body2" color="text.secondary">
              Include details about the issue, exact location, and when you noticed it.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">Add Photos</Typography>
            <Typography variant="body2" color="text.secondary">
              Visual evidence helps authorities better understand and address the issue.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">Choose the Correct Category</Typography>
            <Typography variant="body2" color="text.secondary">
              Submitting to the right department ensures faster and more accurate handling.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MySubmissions;