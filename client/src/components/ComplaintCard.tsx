import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
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
  CornerDownRight,
} from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "./ImageCarousel";

const CommentBox = styled(Box)(({ theme, isReply }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  marginLeft: isReply ? theme.spacing(6) : 0,
  position: "relative",
}));

const ReplyLine = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: -20,
  top: 0,
  height: "100%",
  borderLeft: `2px solid ${theme.palette.grey[300]}`,
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
  const [replyToComment, setReplyToComment] = useState(null);

  // Parse and transform image URLs
  const imageUrls = complaint.images && Array.isArray(complaint.images) 
    ? complaint.images.map(image => {
        // Handle string JSON arrays
        if (typeof image === 'string') {
          if (image.startsWith('/uploads')) {
            return `${process.env.VITE_APP_API_URL}${image}`;
          }
          return image;
        }
        return null;
      }).filter(Boolean)
    : [];

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
      fetch(`${process.env.VITE_APP_API_URL}/comments/tickets/${complaint.ticket_id}`)
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
      const res = await fetch(`${process.env.VITE_APP_API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: complaint.ticket_id,
          author_name: commentAuthorName,
          content: newCommentContent,
          author_type: "citizen",
          is_public: true,
          parent_id: replyToComment?.comment_id || null,
        }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setNewCommentContent("");
      setShowCommentField(false);
      setReplyToComment(null);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  const handleReplyClick = (comment) => {
    setReplyToComment(comment);
    setShowCommentField(true);
  };

  const timeSince = (date) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const organizeComments = () => {
    const topLevelComments = comments.filter((comment) => !comment.parent_id);
    const repliesMap = comments.reduce((acc, comment) => {
      if (comment.parent_id) {
        if (!acc[comment.parent_id]) {
          acc[comment.parent_id] = [];
        }
        acc[comment.parent_id].push(comment);
      }
      return acc;
    }, {});

    return { topLevelComments, repliesMap };
  };

  const { topLevelComments, repliesMap } = organizeComments();

  const renderComment = (comment, isReply = false) => {
    const replies = repliesMap[comment.comment_id] || [];

    return (
      <Box key={comment.comment_id}>
        <CommentBox isReply={isReply}>
          {isReply && <ReplyLine />}
          {isReply && (
            <Box display="flex" alignItems="center" mb={1}>
              <CornerDownRight size={16} style={{ marginRight: 8 }} />
              <Typography variant="caption" color="text.secondary">
                Reply to {replyToComment?.author_name}
              </Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center" mb={1}>
            <Badge
              badgeContent={comment.author_type}
              color={comment.author_type === "admin" ? "primary" : "default"}
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: 3 }}>
                {comment.author_name?.[0]?.toUpperCase() || "?"}
              </Avatar>
            </Badge>
            <Box>
              <Typography fontWeight={400} sx={{ mr: 6, mb: -3 }}>
                {comment.author_name}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ ml: 7 }}>
            {comment.content}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 7 }}>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <ThumbsUp size={14} />
            </IconButton>
            <Typography variant="caption" sx={{ mr: 2 }}>
              {comment.upvotes || 0}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleReplyClick(comment)}
            >
              Reply
            </Typography>
          </Box>
        </CommentBox>

        {replies.length > 0 && (
          <Box sx={{ ml: 4 }}>
            {replies.map((reply) => renderComment(reply, true))}
          </Box>
        )}
      </Box>
    );
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

        {imageUrls.length > 0 && (
          <ImageCarousel
            images={imageUrls}
            height={isDetailed ? 400 : 200}
            isDetailed={isDetailed}
          />
        )}

        {isDetailed && (
          <Box mt={3}>
            <Typography variant="h6" mb={2}>
              Comments
            </Typography>
            {topLevelComments.length > 0 ? (
              topLevelComments.map((comment) => renderComment(comment))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        )}

        {showCommentField && (
          <Box mt={3} mb={2}>
            {replyToComment && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  p: 1,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Replying to <strong>{replyToComment.author_name}</strong>
                </Typography>
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => setReplyToComment(null)}
                >
                  ✕
                </IconButton>
              </Box>
            )}
            <Box display="flex">
              <Avatar sx={{ mr: 2 }}>
                {commentAuthorName?.[0]?.toUpperCase() || "?"}
              </Avatar>
              <Box flexGrow={1}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder={
                    replyToComment
                      ? "Write your reply..."
                      : "Write a comment..."
                  }
                  value={newCommentContent}
                  onChange={handleCommentChange}
                  size="small"
                />
                <Box display="flex" justifyContent="flex-end" mt={1} gap={1}>
                  <Button
                    onClick={() => {
                      setShowCommentField(false);
                      setReplyToComment(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCommentSubmit}
                    disabled={!newCommentContent.trim()}
                  >
                    {replyToComment ? "Reply" : "Comment"}
                  </Button>
                </Box>
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

        <IconButton
          onClick={() => {
            setShowCommentField(true);
            setReplyToComment(null);
          }}
        >
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