import React, { useEffect, useState } from "react";
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
import { formatDistanceToNow } from "date-fns"; // Removed import

interface Comment {
  ticket_id: number;
  author_name: string;
  author_avatar?: string;
  author_type?: string;
  content: string;
  is_public: boolean;
  createdAt?: string;
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
  comments: Comment[];
  ticket_description: string;
  ticket_status: string;
  agent_id: number | null;
  createdAt?: string; // Removed createdAt from the interface
  images?: string[];
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
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [downvotes, setDownvotes] = useState(complaint.downvotes);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);
  const [commentAuthorName, setCommentAuthorName] = useState<string | null>(
    null
  );
  const [isPromptingName, setIsPromptingName] = useState(false);

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

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/tickets/${complaint.ticket_id}`
      );
      if (!res.ok) {
        console.error(`Failed to fetch comments: ${res.status}`);
        return;
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    if (isDetailed && complaint.ticket_id) {
      fetchComments();
    }
  }, [isDetailed, complaint.ticket_id]);

  const handleCommentButtonClick = () => {
    setShowCommentField(true);
  };

  const handleNewCommentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewCommentContent(event.target.value);
    if (
      event.target.value.trim() !== "" &&
      !commentAuthorName &&
      !isPromptingName
    ) {
      setIsPromptingName(true);
      const name = prompt("Please enter your name to comment:");
      setIsPromptingName(false);
      if (name && name.trim() !== "") {
        setCommentAuthorName(name.trim());
      } else if (!name || name.trim() === "") {
        setNewCommentContent(""); // Clear comment if name is not provided
        setShowCommentField(false); // Optionally hide the comment field
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newCommentContent.trim() || !commentAuthorName) {
      alert("Please enter your name and comment.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: complaint.ticket_id,
          author_name: commentAuthorName,
          content: newCommentContent,
          author_type: "citizen",
          is_public: true,
        }),
      });

      if (!res.ok) {
        console.error(`Failed to submit comment: ${res.status}`);
        return;
      }

      const newComment = await res.json();
      console.log("New comment from backend:", newComment); // Debugging log
      setComments((prevComments) => [...prevComments, newComment]);
      console.log("New comments state:", comments); // Debugging log
      setNewCommentContent("");
      setShowCommentField(false);
      setCommentAuthorName(null);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  const timeSince = (dateString: string | undefined) => {
    // Removed function
    if (!dateString) return "N/A";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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

        {isDetailed && Array.isArray(comments) && comments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Comments ({comments.length})
            </Typography>
            {comments.map((comment) => (
              <Box
                key={`${comment.ticket_id}-${comment.content}`}
                sx={{ mb: 2, pl: 0 }}
              >
                {" "}
                {/* Updated key */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Avatar sx={{ mr: 1 }}>
                    {comment.author_name?.charAt(0)?.toUpperCase() ?? "?"}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {comment.author_name}
                  </Typography>
                  {comment.author_type && (
                    <Chip
                      label={comment.author_type}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                  {comment.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      {timeSince(comment.createdAt)}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1">{comment.content}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {showCommentField && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "flex-start" }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1.5, mt: 1 }}>
              {commentAuthorName?.charAt(0)?.toUpperCase() ?? "?"}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={newCommentContent}
                onChange={handleNewCommentChange} // Use the new change handler
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setShowCommentField(false);
                    setNewCommentContent(""); // Clear input
                    setCommentAuthorName(null); // Clear name on cancel
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCommentSubmit}
                  disabled={!newCommentContent.trim() || !commentAuthorName}
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
          onClick={handleCommentButtonClick} // To show the comment field
          aria-label="comment"
        >
          <MessageSquare size={20} />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {Array.isArray(comments) ? comments.length : 0}
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
