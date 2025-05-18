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
  Badge,
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
import { formatDistanceToNow } from "date-fns";

const StyledCardMedia = styled(CardMedia)(() => ({
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const CommentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const STATUSES = [{ value: "Received", label: "Received", color: "#FF9800" }];

const StatusIcon = ({ status }) => {
  switch (status) {
    case "Received":
      return <Clock size={16} color="#FF9800" />;
    default:
      return null;
  }
};

const ComplaintCard = ({ complaint, isDetailed = false }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [downvotes, setDownvotes] = useState(complaint.downvotes);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);
  const [commentAuthorName, setCommentAuthorName] = useState(null);
  const [isPromptingName, setIsPromptingName] = useState(false);

  const statusInfo =
    STATUSES.find((s) => s.value === complaint.ticket_status) || STATUSES[0];

  const handleVote = (type) => {
    if (type === "up") {
      setUpvoted(!upvoted);
      setUpvotes((prev) => prev + (upvoted ? -1 : 1));
      if (downvoted) {
        setDownvoted(false);
        setDownvotes((prev) => prev - 1);
      }
    } else {
      setDownvoted(!downvoted);
      setDownvotes((prev) => prev + (downvoted ? -1 : 1));
      if (upvoted) {
        setUpvoted(false);
        setUpvotes((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    if (isDetailed && complaint.ticket_id) {
      fetch(`http://localhost:5000/api/comments/tickets/${complaint.ticket_id}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error(err));
    }
  }, [isDetailed, complaint.ticket_id]);

  const handleCommentChange = (e) => {
    setNewCommentContent(e.target.value);
    if (!commentAuthorName && !isPromptingName && e.target.value.trim()) {
      setIsPromptingName(true);
      const name = prompt("Please enter your name:");
      setIsPromptingName(false);
      if (name?.trim()) {
        setCommentAuthorName(name.trim());
      } else {
        setNewCommentContent("");
        setShowCommentField(false);
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newCommentContent.trim() || !commentAuthorName) return;
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: complaint.ticket_id,
          author_name: commentAuthorName,
          content: newCommentContent,
          author_type: "citizen",
          is_public: true,
        }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setNewCommentContent("");
      setCommentAuthorName(null);
      setShowCommentField(false);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  const timeSince = (date) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2" fontWeight={600} mr={1}>
              {complaint.issuer_full_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeSince(complaint.createdAt)}
            </Typography>
          </Box>
          <Chip
            icon={<StatusIcon status={complaint.ticket_status} />}
            label={complaint.ticket_status}
            size="small"
            sx={{ bgcolor: `${statusInfo.color}20`, color: statusInfo.color }}
          />
        </Box>

        <Typography
          component={RouterLink}
          to={`/complaints/${complaint.ticket_id}`}
          variant="h6"
          sx={{
            mt: 2,
            textDecoration: "none",
            color: "text.primary",
            "&:hover": { color: "primary.main" },
          }}
        >
          {complaint.ticket_title}
        </Typography>

        <Typography variant="body1" mt={1} mb={2}>
          {complaint.ticket_description}
        </Typography>

        {complaint.images?.[0] && (
          <StyledCardMedia
            component="img"
            image={complaint.images[0]}
            height={isDetailed ? 400 : 200}
            sx={{ borderRadius: 1, mb: 2 }}
          />
        )}

        {isDetailed && (
          <Box mt={2}>
            <Typography variant="h6" mb={1}>
              Comments
            </Typography>
            {comments.map((comment, idx) => (
              <CommentBox key={idx}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Badge
                    badgeContent={comment.author_type}
                    color="primary"
                    overlap="circular"
                    anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                    }}
                  >
                    <Avatar sx={{ width: 44, height: 44, mr: 3}}>
                      {comment.author_name?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                  </Badge>
                  <Typography fontWeight={400} >
                    {comment.author_name}
                  </Typography>
                  
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <IconButton size="small" sx={{ p: 0.5 }}>
                    <ThumbsUp size={14} />
                  </IconButton>
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    {comment.upvotes}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ cursor: "pointer" }}
                  >
                    Reply
                  </Typography>
                </Box>
              </CommentBox>
            ))}
          </Box>
        )}

        {showCommentField && (
          <Box display="flex" mt={2}>
            <Avatar sx={{ mr: 1 }}>
              {commentAuthorName?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Box flexGrow={1}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={newCommentContent}
                onChange={handleCommentChange}
                size="small"
              />
              <Box display="flex" justifyContent="flex-end" mt={1} gap={1}>
                <Button onClick={() => setShowCommentField(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCommentSubmit}
                  disabled={!newCommentContent.trim()}
                >
                  Comment
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1 }}>
        <IconButton
          onClick={() => handleVote("up")}
          color={upvoted ? "primary" : "default"}
        >
          <ThumbsUp size={20} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {upvotes}
        </Typography>

        <IconButton
          onClick={() => handleVote("down")}
          color={downvoted ? "error" : "default"}
        >
          <ThumbsDown size={20} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {downvotes}
        </Typography>

        <IconButton onClick={() => setShowCommentField(true)}>
          <MessageSquare size={20} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {comments.length}
        </Typography>

        <Box flexGrow={1} />

        {!isDetailed && (
          <Button
            component={RouterLink}
            to={`/complaints/${complaint.ticket_id}`}
            size="small"
          >
            View Details
          </Button>
        )}

        <IconButton>
          <Share2 size={20} />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ComplaintCard;
