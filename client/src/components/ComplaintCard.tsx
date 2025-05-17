import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  TextField,
  styled,
} from "@mui/material";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  comments: string[]; // Assuming comments is an array of strings or objects
  ticket_description: string;
  ticket_status: string;
  agent_id: number | null;
  createdAt?: string; // Assuming your API returns a creation timestamp
  images?: string[]; // Assuming your API might return an array of image URLs
}

interface ComplaintCardProps {
  complaint: Ticket;
  isDetailed?: boolean;
}

interface Status {
  value: string;
  label: string;
  color: string;
}

const STATUSES: Status[] = [
  { value: "Received", label: "Received", color: "#FF9800" },
  // Add other statuses and their colors based on your API
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Received":
      return <Clock size={16} color="#FF9800" />;
    // Add icons for other statuses as needed
    default:
      return null;
  }
};

const StyledCardMedia = styled(CardMedia)(() => ({
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  isDetailed = false,
}) => {
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [downvotes, setDownvotes] = useState(complaint.downvotes);
  const [comment, setComment] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);

  const statusInfo =
    STATUSES.find((s) => s.value === complaint.ticket_status) || STATUSES[0];

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoted(false);
      setUpvotes((prev) => prev - 1);
    } else {
      setUpvoted(true);
      setUpvotes((prev) => prev + 1);
      if (downvoted) {
        setDownvoted(false);
        setDownvotes((prev) => prev - 1);
      }
    }
    // In a real app, you would also make an API call to update the upvote count on the server.
  };

  const handleDownvote = () => {
    if (downvoted) {
      setDownvoted(false);
      setDownvotes((prev) => prev - 1);
    } else {
      setDownvoted(true);
      setDownvotes((prev) => prev + 1);
      if (upvoted) {
        setUpvoted(false);
        setUpvotes((prev) => prev - 1);
      }
    }
    // In a real app, you would also make an API call to update the downvote count on the server.
  };

  const handleCommentSubmit = () => {
    // In a real application, this would send the comment to an API
    if (comment.trim()) {
      alert("Comment submitted: " + comment);
      setComment("");
      setShowCommentField(false);
    }
  };

  const timeSince = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {/* <Avatar src={complaint.issuer_avatar} sx={{ mr: 1.5 }}>
            {complaint.issuer_full_name.charAt(0).toUpperCase() ?? "?"}
          </Avatar> */}
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mr: 1 }}>
            {complaint.issuer_full_name}
          </Typography>
          {complaint.createdAt && (
            <Typography variant="caption" color="text.secondary">
              {timeSince(complaint.createdAt)}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            icon={<StatusIcon status={complaint.ticket_status} />}
            label={complaint.ticket_status}
            size="small"
            sx={{
              bgcolor: `${statusInfo.color}20`,
              color: statusInfo.color,
              fontWeight: "medium",
              "& .MuiChip-icon": {
                color: statusInfo.color,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to={`/complaints/${complaint.ticket_id}`}
              sx={{
                color: "text.primary",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "none",
                },
              }}
            >
              {complaint.ticket_title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            {complaint.ticket_module && (
              <Chip
                label={complaint.ticket_module}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 122, 0, 0.1)",
                  color: "primary.main",
                  fontWeight: "medium",
                }}
              />
            )}
            {complaint.issuer_location && (
              <Chip
                label={complaint.issuer_location}
                size="small"
                sx={{
                  bgcolor: "rgba(33, 150, 243, 0.1)",
                  color: "secondary.main",
                  fontWeight: "medium",
                }}
              />
            )}
          </Box>

          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            {complaint.ticket_description}
          </Typography>
        </Box>

        {complaint.images && complaint.images.length > 0 && (
          <StyledCardMedia
            component="img"
            height={isDetailed ? 400 : 200}
            image={complaint.images[0]}
            alt={complaint.ticket_title}
            sx={{
              borderRadius: 1,
              mb: 2,
            }}
          />
        )}

        {isDetailed &&
          Array.isArray(complaint.comments) &&
          complaint.comments.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Comments ({complaint.comments.length})
              </Typography>
              {complaint.comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 2, pl: 0 }}>
                  {" "}
                  {/* Adjust pl based on comment structure if needed */}
                  <Typography variant="body2">
                    {comment} {/* Assuming comments are just strings for now */}
                  </Typography>
                  {/* You might need to adjust this based on the actual structure of your comments */}
                </Box>
              ))}
            </Box>
          )}

        {showCommentField && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "flex-start" }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 32, height: 32, mr: 1.5, mt: 1 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => setShowCommentField(false)}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                  sx={{ textTransform: "none" }}
                >
                  Comment
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <IconButton
          onClick={handleUpvote}
          color={upvoted ? "primary" : "default"}
          aria-label="upvote"
        >
          <ThumbsUp size={20} />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {upvotes}
        </Typography>

        <IconButton
          onClick={handleDownvote}
          color={downvoted ? "error" : "default"}
          aria-label="downvote"
        >
          <ThumbsDown size={20} />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {downvotes}
        </Typography>

        <IconButton
          onClick={() => setShowCommentField(!showCommentField)}
          aria-label="comment"
        >
          <MessageSquare size={20} />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {Array.isArray(complaint.comments) ? complaint.comments.length : 0}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {!isDetailed && (
          <Button
            component={RouterLink}
            to={`/complaints/${complaint.ticket_id}`}
            size="small"
            sx={{ textTransform: "none" }}
          >
            View Details
          </Button>
        )}

        <IconButton aria-label="share">
          <Share2 size={20} />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ComplaintCard;
