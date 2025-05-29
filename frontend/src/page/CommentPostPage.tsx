import React, { useEffect, useState, memo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../style/CommentPostPage.css';
import { api } from '../api/Api';
import { formatTime } from '../utils/FormatTime';
import { getProfileImageUrl } from '../utils/ProfileImage';
import { Post, Comment, Reply, PostdeskProps, ReplyItemProps, CommentItemProps } from '../types/Index';

const ReplyInput = memo(({ commentId, value, onChange, onSubmit, token }: { commentId: string; value: string; onChange: (id: string, val: string) => void; onSubmit: (id: string) => void; token: string | null }) => {
	if (!token) return <p className="reply-login-message">Please login to reply.</p>;
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	return (<><textarea ref={textAreaRef} value={value} onChange={e => onChange(commentId, e.target.value)} rows={3} placeholder="Write a reply..." className="comment-textarea" /> <button onClick={() => onSubmit(commentId)} className="comment-button">Send</button></>);
});

const PostDesk = ({ post_Id, title, post, likePost, topik, createdAt, username, profileImage, isLiked, onLike }: PostdeskProps) => (
	<div className="comment-post">
		<div className="comment-post-meta">
			<div className="comment-post-author-info">
				<img src={getProfileImageUrl(profileImage)} alt={username || 'User'} className="comment-post-avatar" />
				<div className="comment-post-info">
					<span className="comment-post-author">{username || 'Unknown User'}</span>
					<span className="comment-post-date">{formatTime(createdAt)}</span>
				</div>
			</div>
			<div className="comment-post-topic">{topik}</div>
		</div>
		<h2 className="comment-post-title">{title}</h2>
		<p className="comment-post-content">{post}</p>
		<div className="comment-post-actions">
			<button
				className={`comment-like-btn ${isLiked ? 'comment-like-active' : ''}`}
				onClick={() => onLike(post_Id)}
				disabled={!localStorage.getItem("token")}
			>
				{isLiked ? "❤️" : "🤍"} {likePost}
			</button>
		</div>
	</div>
);

export const ReplyItem = memo(({ reply, commentId, likedReplies, onLikeReply, onDeleteReply, onEditReply, currentUserId }: ReplyItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(reply.commentReply);
	const liked = likedReplies.includes(reply.reply_Id);
	const canModify = currentUserId && reply.user_Id === currentUserId;
	
	const handleEdit = () => {
		if (onEditReply) {
			onEditReply(reply.reply_Id, commentId, editContent.trim());
			setIsEditing(false);
		}
	};

	const handleCancelEdit = () => {
		setEditContent(reply.commentReply);
		setIsEditing(false);
	};
	
	return (
		<div className="reply-item">
			<div className="reply-header">
				<img src={getProfileImageUrl(reply.profileImage)} alt={reply.username || 'User'} className="reply-avatar" />
				<div className="reply-author-info">
					<span className="reply-author">{reply.username || 'Unknown'}</span>
					<span className="reply-date">{formatTime(reply.createdAt)}</span>
				</div>
			</div>
			<div className="reply-content">
				{isEditing ? (
					<div className="edit-form">
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="edit-textarea"
							rows={3}
						/>
						<div className="edit-actions">
							<button onClick={handleEdit} className="edit-save-btn">Save</button>
							<button onClick={handleCancelEdit} className="edit-cancel-btn">Cancel</button>
						</div>
					</div>
				) : (
					reply.commentReply
				)}
			</div>
			<div className="reply-actions">
				<button
					className={`reply-like-btn ${liked ? 'reply-like-active' : ''}`}
					onClick={() => onLikeReply(reply.reply_Id, commentId)}
					disabled={!localStorage.getItem('token')}
				>
					{liked ? '❤️' : '🤍'} {reply.likeReply}
				</button>
				{canModify && !isEditing && (
					<button
						className="reply-edit-btn"
						onClick={() => setIsEditing(true)}
						title="Edit reply"
					>
						✏️ Edit
					</button>
				)}
				{canModify && onDeleteReply && !isEditing && (
					<button
						className="reply-delete-btn"
						onClick={() => onDeleteReply(reply.reply_Id, commentId)}
						title="Delete reply"
					>
						🗑️ Delete
					</button>
				)}
			</div>
		</div>
	);
});

export const CommentItem = memo(({ comment, likedComments, onLikeComment, showReplyInput, onToggleReplyInput, replyValue, onReplyChange, onReplySubmit, replies, likedReplies, onLikeReply, fetchReplies, totalReplies, replyOffset, token, onDeleteComment, onDeleteReply, onEditComment, onEditReply, currentUserId }: CommentItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.comment);
	const liked = likedComments.includes(comment.comment_Id);
	const canModify = currentUserId && comment.user_Id === currentUserId;
	
	const handleEdit = () => {
		if (onEditComment) {
			onEditComment(comment.comment_Id, editContent.trim());
			setIsEditing(false);
		}
	};

	const handleCancelEdit = () => {
		setEditContent(comment.comment);
		setIsEditing(false);
	};
	
	return (
		<div className="comment-item">
			<div className="comment-header">
				<div className="comment-author-container">
					<img src={getProfileImageUrl(comment.profileImage)} alt={comment.username || 'User'} className="comment-avatar" />
					<div className="comment-author-details">
						<span className="comment-author">{comment.username || 'Unknown'}</span>
						<span className="comment-date">{formatTime(comment.createdAt)}</span>
					</div>
				</div>
			</div>
			<div className="comment-content">
				{isEditing ? (
					<div className="edit-form">
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="edit-textarea"
							rows={3}
						/>
						<div className="edit-actions">
							<button onClick={handleEdit} className="edit-save-btn">Save</button>
							<button onClick={handleCancelEdit} className="edit-cancel-btn">Cancel</button>
						</div>
					</div>
				) : (
					comment.comment
				)}
			</div>
			<div className="comment-actions">
				<button
					className={`comment-like-btn ${liked ? 'comment-like-active' : ''}`}
					onClick={() => onLikeComment(comment.comment_Id)}
					disabled={!token}
				>{liked ? '❤️' : '🤍'} {comment.likeComment}</button>
				<button
					className="comment-reply-btn"
					onClick={() => onToggleReplyInput(comment.comment_Id)}
				>
					Reply
				</button>
				{canModify && !isEditing && (
					<button
						className="comment-edit-btn"
						onClick={() => setIsEditing(true)}
						title="Edit comment"
					>
						✏️ Edit
					</button>
				)}
				{canModify && onDeleteComment && !isEditing && (
					<button
						className="comment-delete-btn"
						onClick={() => onDeleteComment(comment.comment_Id)}
						title="Delete comment"
					>
						🗑️ Delete
					</button>
				)}
			</div>
			{showReplyInput && (
				<div className="reply-input">
					<ReplyInput
						commentId={comment.comment_Id}
						value={replyValue}
						onChange={onReplyChange}
						onSubmit={onReplySubmit}
						token={token}
					/>
				</div>
			)}
			<div className="reply-section">
				{replies.map(r => (
					<ReplyItem
						key={r.reply_Id}
						reply={r}
						commentId={comment.comment_Id}
						likedReplies={likedReplies}
						onLikeReply={onLikeReply}
						onDeleteReply={onDeleteReply}
						onEditReply={onEditReply}
						currentUserId={currentUserId}
					/>
				))}
				{totalReplies > replyOffset && (
					<div className="reply-load-more-container">
						<button onClick={() => fetchReplies(comment.comment_Id)}>
							Load More Replies
						</button>
					</div>
				)}
			</div>
		</div>
	);
});



export const CommentPostPage = () => {
const navigate = useNavigate();
const { postId } = useParams<{ postId: string }>();
const [post, setPost] = useState<Post | null>(null);
const [newComment, setNewComment] = useState<string>('');
const commentLimit = 10;
const [commentOffset, setCommentOffset] = useState<number>(0);
const [totalComments, setTotalComments] = useState<number>(0);
const [comments, setComments] = useState<Comment[]>([]);
const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
const [showReplyInput, setShowReplyInput] = useState<{ [commentId: string]: boolean }>({});
const replyLimit = 10;
const [replyOffsets, setReplyOffsets] = useState<{ [commentId: string]: number }>({});
const [totalReplies, setTotalReplies] = useState<{ [commentId: string]: number }>({});
const [replies, setReplies] = useState<{ [commentId: string]: Reply[] }>({});
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [likedPosts, setLikedPosts] = useState<string[]>([]);
const [likedComments, setLikedComments] = useState<string[]>([]);
const [likedReplies, setLikedReplies] = useState<string[]>([]);
const [userIdState, setUserIdState] = useState<string | null>(null);
const [currentUsername, setCurrentUsername] = useState<string>('');
const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);

const token = localStorage.getItem('token');
// load post only when postId changes
useEffect(() => {
	if (!postId) return;
	fetchPost();
}, [postId]);

// load comments only when postId changes or after adding comment
useEffect(() => {
	if (!postId) return;
	// reset comment pagination when post changes
	setComments([]);
	setCommentOffset(0);
	setTotalComments(0);
	fetchComments();
}, [postId]);

// load user data dan stored likes setiap kali token berubah
useEffect(() => {
	const token = localStorage.getItem('token');
	if (token) {
		fetchUserData();
	} else {
		const stored = localStorage.getItem('likedPosts');
		if (stored) setLikedPosts(JSON.parse(stored));
	}
}, [token]);

// fetch user data
const fetchUserData = async () => {
	try {
		const res = await api.get<{ data: any }>('/user');
		const { data } = res;
		setUserIdState(data.user_Id);
		setLikedPosts(data.likedPosts ?? []);
		setLikedComments((data.likedComments ?? []).map(String)); // pastikan string
		setLikedReplies((data.likedReplies ?? []).map(String)); // pastikan string
		setCurrentUsername(data.username);
		setCurrentProfileImage(data.profileImage || null);
	} catch (err) {
		console.error(err);
	}
};

const fetchPost = async () => {
	setLoading(true);
	try {
		const data = await api.get<any>(`/user/post/${postId}`);
		setPost(data);
	} catch {
		setError('Error fetching post');
	} finally {
		setLoading(false);
	}
};

const fetchComments = async () => {
	try {
		const currentOffset = commentOffset;
		const result = await api.get<any>(`/user/post/${postId}/comment?limit=${commentLimit}&offset=${currentOffset}`);
		let batch: Comment[];
		let total: number;
		if (Array.isArray(result)) {
			const all = result as Comment[];
			total = all.length;
			batch = all.slice(commentOffset, commentOffset + commentLimit);
		} else {
			batch = Array.isArray(result.data) ? result.data : [];
			total = typeof result.total === 'number' ? result.total : batch.length;
		}
		setComments(prev => (currentOffset === 0 ? batch : [...prev, ...batch]));
		setCommentOffset(currentOffset + batch.length);
		setTotalComments(total);
	} catch {
		setComments([]);
	}
};

const fetchReplies = async (commentId: string) => {
	try {
		const currentOffset = replyOffsets[commentId] || 0;
		const result = await api.get<any>(`/user/post/${postId}/comment/${commentId}/reply?limit=${replyLimit}&offset=${currentOffset}`);
		let batch: Reply[];
		let total: number;
		if (Array.isArray(result)) {
			const all = result as Reply[];
			total = all.length;
			batch = all.slice(currentOffset, currentOffset + replyLimit);
		} else {
			batch = Array.isArray(result.data) ? result.data : [];
			total = typeof result.total === 'number' ? result.total : batch.length;
		}
		setReplies(prev => ({
			...prev,
			[commentId]: currentOffset === 0 ? batch : [...(prev[commentId] || []), ...batch],
		}));
		setReplyOffsets(prev => ({ ...prev, [commentId]: currentOffset + batch.length }));
		setTotalReplies(prev => ({ ...prev, [commentId]: total }));
	} catch {
		setReplies(prev => ({ ...prev, [commentId]: [] }));
	}
};

const handleAddComment = async () => {
	if (!newComment.trim()) return;
	try {
		const created: Comment = await api.post<Comment>(`/user/post/${postId}/comment`,{ comment: newComment });
		const newItem: Comment = { ...created, username: currentUsername, profileImage: currentProfileImage || undefined };
		setComments(prev => [newItem, ...prev]);
		setNewComment('');
		setError(null);
	} catch (err: any) {
		console.error(err);
		setError(err.message || 'Error adding comment');
	}
};

const handleReplyInputChange = (commentId: string, value: string) => {
	setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
};

const handleShowReplyInput = (commentId: string) => {
	setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
	if (!showReplyInput[commentId] && !replies[commentId]) {
		fetchReplies(commentId);
	}
};

const handleAddReply = async (commentId: string) => {
	if (!replyInputs[commentId]?.trim()) return;
	try {
		const created: Reply = await api.post<Reply>(`/user/post/${postId}/comment/${commentId}/reply`,{ commentReply: replyInputs[commentId] });
		const newReply: Reply = { ...created, username: currentUsername, profileImage: currentProfileImage || undefined };
		setReplies(prev => ({
			...prev,
			[commentId]: [newReply, ...(prev[commentId] || [])]
		}));
		setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
		setError(null);
	} catch (err: any) {
		console.error(err);
		setError(err.message || 'Error adding reply');
	}
};

const handleLike = async (postId: string) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const data = await api.post<{ likePost: number }>(`/user/post/${postId}/like`,{},true);

		setPost((prev) =>
			prev && prev.post_Id === postId ? { ...prev, likePost: data.likePost } : prev
		);
		setLikedPosts((prev) => {
			const updated = prev.includes(postId)
				? prev.filter((id) => id !== postId)
				: [...prev, postId];
			localStorage.setItem("likedPosts", JSON.stringify(updated));
			return updated;
		});
	} catch (error) {
		console.error("Error updating like:", error);
		alert("you not login");
	}
};

const handleLikeComment = async (commentId: string) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const data = await api.post<{ likeComment: number }>(`/user/post/${postId}/comment/${commentId}/like`,{},true);

		setComments((prev) =>
			prev.map((c) =>
				c.comment_Id === commentId ? { ...c, likeComment: data.likeComment } : c
			)
		);

		const likeStatus = await api.get<{ liked: boolean }>(`/user/like/check?commentId=${commentId}`);

		setLikedComments((prev) => {
			if (likeStatus.liked) {
				// Pastikan id ada di array
				return prev.includes(commentId) ? prev : [...prev, commentId];
			} else {
				// Pastikan id tidak ada di array
				return prev.filter((id) => id !== commentId);
			}
		});
	} catch (error) {
		console.error("Error updating like for comment:", error);
	}
};

const handleLikeReply = async (replyId: string, commentId: string) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const data = await api.post<{ likeReply: number }>(`/user/post/${postId}/comment/${commentId}/reply/${replyId}/like`,{},true);

		setReplies((prev) => {
			const updatedReplies = prev[commentId]?.map((r) =>
				r.reply_Id === replyId ? { ...r, likeReply: data.likeReply } : r
			);
			return { ...prev, [commentId]: updatedReplies };
		});

		const likeStatus = await api.get<{ liked: boolean }>(`/user/like/check?replyId=${replyId}`);
		setLikedReplies((prev) => {
			if (likeStatus.liked) {
				return prev.includes(replyId) ? prev : [...prev, replyId];
			} else {
				return prev.filter((id) => id !== replyId);
			}
		});
	} catch (error) {
		console.error("Error updating like for reply:", error);
	}
};

const handleEditComment = async (commentId: string, newContent: string) => {
	if (!newContent.trim()) return;
	
	try {
		await api.put(`/user/post/${postId}/comment/${commentId}`, { comment: newContent });
		
		// Update comment in local state
		setComments((prev) =>
			prev.map((c) =>
				c.comment_Id === commentId ? { ...c, comment: newContent } : c
			)
		);
		
		console.log("Comment updated successfully");
	} catch (error) {
		console.error("Error updating comment:", error);
		alert("Failed to update comment. Please try again.");
	}
};

const handleEditReply = async (replyId: string, commentId: string, newContent: string) => {
	if (!newContent.trim()) return;
	
	try {
		await api.put(`/user/post/${postId}/comment/${commentId}/reply/${replyId}`, { commentReply: newContent });
		
		// Update reply in local state
		setReplies((prev) => {
			const updatedReplies = prev[commentId]?.map((r) =>
				r.reply_Id === replyId ? { ...r, commentReply: newContent } : r
			) || [];
			return { ...prev, [commentId]: updatedReplies };
		});
		
		console.log("Reply updated successfully");
	} catch (error) {
		console.error("Error updating reply:", error);
		alert("Failed to update reply. Please try again.");
	}
};

const handleDeleteComment = async (commentId: string) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	if (!window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
		return;
	}

	try {
		await api.delete(`/user/post/${postId}/comment/${commentId}`);
		
		// Remove comment from local state
		setComments((prev) => prev.filter((c) => c.comment_Id !== commentId));
		
		// Remove any replies for this comment
		setReplies((prev) => {
			const updated = { ...prev };
			delete updated[commentId];
			return updated;
		});
		
		// Update total comment count
		setTotalComments((prev) => Math.max(0, prev - 1));
		
		console.log("Comment deleted successfully");
	} catch (error) {
		console.error("Error deleting comment:", error);
		alert("Failed to delete comment. Please try again.");
	}
};

const handleDeleteReply = async (replyId: string, commentId: string) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	if (!window.confirm("Are you sure you want to delete this reply? This action cannot be undone.")) {
		return;
	}

	try {
		await api.delete(`/user/post/${postId}/comment/${commentId}/reply/${replyId}`);
		
		// Remove reply from local state
		setReplies((prev) => {
			const updatedReplies = prev[commentId]?.filter((r) => r.reply_Id !== replyId) || [];
			return { ...prev, [commentId]: updatedReplies };
		});
		
		// Update total reply count for this comment
		setTotalReplies((prev) => ({
			...prev,
			[commentId]: Math.max(0, (prev[commentId] || 0) - 1)
		}));
		
		console.log("Reply deleted successfully");
	} catch (error) {
		console.error("Error deleting reply:", error);
		alert("Failed to delete reply. Please try again.");
	}
};
if (loading) return <div className="comment-page"><div className="comment-container"><p>Loading...</p></div></div>;
	return (
		<div className="comment-page">
			<div className="comment-container">
				{post && <PostDesk key={post.post_Id} {...post} onLike={handleLike} isLiked={likedPosts.includes(post.post_Id)} />}
				<div className="comment-section">
					<h3 className="comment-section-title">Comments</h3>
					{comments.length > 0 ? (
						<>							{comments.map(c => (
								<CommentItem
									key={c.comment_Id}
									comment={c}
									likedComments={likedComments}
									onLikeComment={handleLikeComment}
									showReplyInput={!!showReplyInput[c.comment_Id]}
									onToggleReplyInput={handleShowReplyInput}
									replyValue={replyInputs[c.comment_Id] || ''}
									onReplyChange={handleReplyInputChange}
									onReplySubmit={handleAddReply}
									replies={replies[c.comment_Id] || []}
									likedReplies={likedReplies}
									onLikeReply={handleLikeReply}
									fetchReplies={fetchReplies}
									totalReplies={totalReplies[c.comment_Id] || 0}
									replyOffset={replyOffsets[c.comment_Id] || 0}
									token={token}
									onDeleteComment={handleDeleteComment}
									onDeleteReply={handleDeleteReply}
									onEditComment={handleEditComment}
									onEditReply={handleEditReply}
									currentUserId={userIdState || undefined}
								/>
							))}
							{/* Load more comments if available */}
							{comments.length < totalComments && (
								<div className="comment-load-more-container">
									<button
										onClick={fetchComments}
										className="theme-btn comment-load-more-btn"
									>
										Load More Comments
									</button>
								</div>
							)}
						</>
					) : (
						<p className="comment-empty-message">No comments yet. Be the first to comment!</p>
					)}
				</div>
				<div className="comment-input-section">
					{token ? (
						<>
							<textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} placeholder="Write a comment..." className="comment-textarea" />
							<div className="comment-actions-container">
								<button onClick={handleAddComment} className="theme-btn comment-submit-button">Add Comment</button>
								<Link to="/" className="theme-btn theme-btn-secondary">Back To Home Page</Link>
							</div>
						</>
					) : (
						<div className="comment-guest-prompt">
							<p className="comment-login-message">Please login to comment, like, or reply.</p>
							<Link to="/auth/login" className="theme-btn theme-btn-secondary">Login</Link>
							<Link to="/" className="theme-btn theme-btn-secondary">Back To Home Page</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommentPostPage;
