import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
// import { getComplaintById } from "../utils/mockData";
// import { formatDate } from "date-fns";

interface Comment {
  ticket_id: number;
  author_name: string;
  author_avatar?: string;
  author_type?: string;
  content: string;
  is_public: boolean;
}
interface Ticket {
  ticket_id: number;
  issuer_id_number: string;
  issuer_full_name: string;
  issuer_avatar: string;
  issuer_phone_number: string;
  issuer_location: string;
  ticket_module: string;
  ticket_title: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[]; // This must be an array
  ticket_description: string;
  ticket_status: string;
  agent_id?: number | null;
  images?: string[];
}

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:5000/api/tickets/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ticket: ${response.status}`);
        }

        const rawData = await response.json();

        // Transform API response to match the structure ComplaintCard expects
        const transformedTicket: Ticket = {
          ...rawData,
          // Handle comments: if it's a string, convert to array of Comment objects
          comments:
            typeof rawData.comments === "string"
              ? [
                  {
                    ticket_id: Number(id),
                    author_name: rawData.issuer_full_name,
                    content: rawData.comments,
                    is_public: true,
                  },
                ]
              : Array.isArray(rawData.comments)
              ? rawData.comments
              : [],
        };

        setTicket(transformedTicket);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch ticket details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // // In a real application, you would fetch the complaint data from an API
  // const complaint = id ? getComplaintById(id) : undefined;

  if (error || !ticket) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        {id ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Complaint not found
            </Alert>
            <Button
              onClick={() => navigate("/")}
              startIcon={<ArrowLeft size={18} />}
            >
              Back to Home
            </Button>
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }
  const formatDate = (timestamp?: string) => {
    return timestamp
      ? new Date(timestamp).toLocaleString()
      : new Date().toLocaleString();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Complaint Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tracking ID: {ticket.ticket_id}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <ComplaintCard complaint={ticket} isDetailed />
        </Paper>

        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Timeline
          </Typography>

          <Box
            sx={{
              position: "relative",
              ml: 2,
              pl: 3,
              borderLeft: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 3,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  position: "absolute",
                  left: -31,
                  top: 6,
                  zIndex: 1,
                }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Complaint Submitted
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {/* {new Date(complaint.createdAt).toLocaleString()} */}
                  {formatDate()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your complaint has been received and is pending review.
                </Typography>
              </Box>
            </Box>

            {ticket.ticket_status !== "Received" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 3,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "info.main",
                    position: "absolute",
                    left: -31,
                    top: 6,
                    zIndex: 1,
                  }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Under Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {/* {new Date(complaint.updatedAt).toLocaleString()} */}
                    {formatDate()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your complaint is being reviewed by the relevant department.
                  </Typography>
                </Box>
              </Box>
            )}

            {ticket.ticket_status === "Resolved" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    position: "absolute",
                    left: -31,
                    top: 6,
                    zIndex: 1,
                  }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Resolved
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your complaint has been resolved. Thank you for your
                    patience.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ComplaintDetail;
