import Comment from "../models/comment.model.js";

//post a comment

export const addComment = async (req,res)=> {
  const { ticket_id, author_type, content, is_public, author_name, author_avatar, parent_id } = req.body;

  try{
    const newComment = await Comment.create({
        ticket_id,
        author_type,
        content,
        is_public,
        author_name,
        author_avatar,
        parent_id: parent_id || null,
    })

    res.status(201).json(newComment);
  } catch(err) {
    console.error(err)
    res.status(500).json({message: "Failed to post comment"})
  }
}

export const getTicketComments = async (req, res) => {
  const ticketId = req.params.id;
  const viewMode = req.query.viewMode || "public";

  try {
    const comments = await Comment.findAll({
      where: {
        ticket_id: ticketId,
        ...(viewMode === "public" ? { is_public: true } : {}),
      },
      order: [["created_at", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments." });
  }
};