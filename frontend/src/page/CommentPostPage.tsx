import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/CommentPostPage.css';
import defaultProfileImage from '../assets/profileImage.jpeg';

type Comment = {
  comment_id: string;
  comment: string;
  user_Id: string;
  post_Id: string;
  likeComment: number;
  username?: string;
  profileImage?: string;
};

type Post = {
  post_id: string;
  title: string;
  post: string;
  like: number;
  topik: string;
  user_Id: string;
  username?: string;
  profileImage?: string;
};

type Reply = {
  reply_id: string;
  user_Id: string;
  post_Id: string;
  comment_Id: string;
  commentReply: string;
  likeReply: number;
  username?: string;
  profileImage?: string;
};

const CommentPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<{ [commentId: string]: boolean }>({});
  const [replies, setReplies] = useState<{ [commentId: string]: Reply[] }>({});

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/user/post/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError('Error fetching post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/post/${postId}/comment`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setComments([]);
    }
  };

  const fetchReplies = async (commentId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/post/${postId}/comment/${commentId}/reply`);
      if (!res.ok) throw new Error('Failed to fetch replies');
      const data = await res.json();
      setReplies(prev => ({ ...prev, [commentId]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      setReplies(prev => ({ ...prev, [commentId]: [] }));
    }
  };

  const handleAddComment = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !newComment.trim()) return;
    try {
      await fetch(`http://localhost:3000/api/user/post/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_Id: userId, comment: newComment }),
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Error adding comment');
    }
  };

  const handleReplyInputChange = (commentId: string, value: string) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };

  const handleShowReplyInput = (commentId: string) => {
    setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    if (!replies[commentId]) fetchReplies(commentId);
  };

  const handleAddReply = async (commentId: string) => {
    const userId = localStorage.getItem('userId');
    const replyText = replyInputs[commentId];
    if (!userId || !replyText || !replyText.trim()) return;
    try {
      await fetch(`http://localhost:3000/api/user/post/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_Id: userId, commentReply: replyText }),
      });
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
      fetchReplies(commentId);
    } catch (err) {
      // handle error
    }
  };

  if (loading) {
    return <div className="commentPage-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="commentPage-container"><p>{error}</p></div>;
  }

  return (
    <div className="commentPage-container">
      {post && (
        <div className="commentPage-post" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src={post.profileImage ? `http://localhost:3000/uploads/${post.profileImage}` : defaultProfileImage}
            alt={post.username || 'User'}
            style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h2>{post.title}</h2>
            <p><em>By: {post.username || 'Unknown User'}</em></p>
            <p>{post.post}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>❤️ {post.like}</span>
              <span className="topic">{post.topik}</span>
            </div>
            <hr />
          </div>
        </div>
      )}

      <div className="commentPage-comments-section">
        <h3>Comments:</h3>
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.comment_id} className="commentPage-single-comment" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={c.profileImage ? `http://localhost:3000/uploads/${c.profileImage}` : defaultProfileImage}
                  alt={c.username || 'User'}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <p>
                    <strong>{c.username || 'Unknown User'}:</strong> {c.comment}
                  </p>
                  <small>❤️ {c.likeComment}</small>
                </div>
                <button className="commentPage-reply-btn" onClick={() => handleShowReplyInput(c.comment_id)}>
                  {showReplyInput[c.comment_id] ? 'Cancel' : 'Reply'}
                </button>
              </div>
              {showReplyInput[c.comment_id] && (
                <div style={{ marginLeft: '3rem', marginTop: '0.5rem' }}>
                  <textarea
                    value={replyInputs[c.comment_id] || ''}
                    onChange={e => handleReplyInputChange(c.comment_id, e.target.value)}
                    rows={2}
                    placeholder="Write a reply..."
                    className="commentPage-textarea"
                  />
                  <button onClick={() => handleAddReply(c.comment_id)} className="commentPage-button" style={{ marginTop: 4 }}>
                    Add Reply
                  </button>
                </div>
              )}
              {replies[c.comment_id] && replies[c.comment_id].length > 0 && (
                <div className="commentPage-replies-section" style={{ marginLeft: '3rem', marginTop: '0.5rem' }}>
                  {replies[c.comment_id].map((r) => (
                    <div key={r.reply_id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 2 }}>
                      <img
                        src={r.profileImage ? `http://localhost:3000/uploads/${r.profileImage}` : defaultProfileImage}
                        alt={r.username || 'User'}
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ margin: 0 }}><strong>{r.username || 'Unknown User'}:</strong> {r.commentReply}</p>
                        <small>❤️ {r.likeReply}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>

      <div className="commentPage-input-section">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          className="commentPage-textarea"
        />
        <button onClick={handleAddComment} className="commentPage-button">
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentPostPage;
