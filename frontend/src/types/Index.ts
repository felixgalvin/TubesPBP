export interface User {
  user_Id: string;
  email: string;
  username: string;
  gender: string;
  profileImage: string;
  createdAt: string;
};

export interface Post {
  post_Id: string;
  title: string;
  post: string;
  likePost: number;
  topik: string;
  user_Id: string;
  createdAt: string;
  username?: string;
  profileImage?: string;
};

export interface Comment {
  comment_Id: string;
  comment: string;
  user_Id: string;
  post_Id: string;
  likeComment: number;
  createdAt: string;
  username?: string;
  profileImage?: string;
};

export interface Reply {
  reply_Id: string;
  user_Id: string;
  post_Id: string;
  comment_Id: string;
  commentReply: string;
  likeReply: number;
  createdAt: string;
  username?: string;
  profileImage?: string;
};

export interface Like {
  like_Id: string;
  user_Id: string;
  post_Id: string;
  comment_Id: string;
  reply_Id: string;
}

export interface PostdeskProps extends Post {
  isLiked:boolean
  onLike: (postId:string)=>void
}

export interface PostdeskReply extends Reply {
  isLiked: boolean;
  onLike: (postId: string) => void;
}

export interface PostdeskComment extends Comment {
  isLiked: boolean;
  onLike: (postId: string) => void;
}

export interface ReplyItemProps {
    reply: Reply;
    commentId: string;
    likedReplies: string[];
    onLikeReply: (replyId: string, commentId: string) => void;
    onDeleteReply?: (replyId: string, commentId: string) => void;
    onEditReply?: (replyId: string, commentId: string, newContent: string) => void;
    currentUserId?: string;
}

export interface CommentItemProps {
    comment: Comment;
    likedComments: string[];
    onLikeComment: (commentId: string) => void;
    onDeleteComment?: (commentId: string) => void;
    onEditComment?: (commentId: string, newContent: string) => void;
    showReplyInput: boolean;
    onToggleReplyInput: (commentId: string) => void;
    replyValue: string;
    onReplyChange: (commentId: string, val: string) => void;
    onReplySubmit: (commentId: string) => void;
    replies: Reply[];
    likedReplies: string[];
    onLikeReply: (replyId: string, commentId: string) => void;
    onDeleteReply?: (replyId: string, commentId: string) => void;
    onEditReply?: (replyId: string, commentId: string, newContent: string) => void;
    fetchReplies: (commentId: string) => void;
    totalReplies: number;
    replyOffset: number;
    token: string | null;
    currentUserId?: string;
}

export interface UserActivity {
  type: 'comment' | 'reply';
  id: string;
  content: string;
  createdAt: string;
  post: {
    post_Id: string;
    title: string;
    content: string;
    topik: string;
    createdAt: string;
    author: {
      username: string;
      profileImage: string | null;
    };
  };
}