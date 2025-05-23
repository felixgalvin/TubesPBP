
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