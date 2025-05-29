import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/ProfilePage.css';
import { formatTime } from '../utils/FormatTime';
import { Post } from '../types/Index';
import { api } from '../api/Api';
import { getProfileImageUrl } from '../utils/ProfileImage';

interface UserActivity {
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');  const [userId, setUserId] = useState<string | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'activity'>('posts');
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostData, setEditPostData] = useState({
    title: '',
    post: '',
    topik: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth/login'); return; }
    getProfile(token);
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    getPosts(userId);
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'activity' && userActivity.length === 0) {
      getUserActivity();
    }
  }, [activeTab]);

  const getProfile = async (token: string) => {
    try {
      const { data } = await api.get<{ data: any }>('/user', true);
      setUsername(data.username);
      setEmail(data.email);
      setProfilePicture(data.profileImage);
      setUserId(data.user_Id.toString());
    } catch {
      setError('Failed to load user data');
    }
  };
  const getPosts = async (uid: string) => {
    setPostsLoading(true);
    try {
      const data = await api.get<Post[]>(`/user/${uid}/posts`, true);
      setPosts(data);
    } catch {
      setPostsError('Unable to load your posts');
    } finally {
      setPostsLoading(false);
    }
  };
  const getUserActivity = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setActivityLoading(true);
    setActivityError(null);

    try {
      const result = await api.get<{
        comments: UserActivity[];
        replies: UserActivity[];
        allActivity: UserActivity[];
      }>('/user/activity', true);
      
      setUserActivity(result.allActivity || []);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      setActivityError("Failed to load activity");
    } finally {
      setActivityLoading(false);
    }
  };

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
    setEditFile(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };
  const cancelEdit = () => {
    setEditingField(null); setEditValue(''); setEditFile(null); setCurrentPassword('');
    setNewPassword(''); setConfirmNewPassword(''); setShowProfileOptions(false);
  };  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the selected file is the same as current profile picture
    if (await isSameImage(file, profilePicture)) {
      alert("profilePicture should be different");
      e.target.value = ''; // Clear the input
      return;
    }
    
    setEditFile(file);
  };
  // Function to compare if selected file is same as current profile picture
  const isSameImage = async (newFile: File, currentProfileImage: string | null): Promise<boolean> => {
    if (!currentProfileImage) return false; // No current image, so it's definitely different
    
    try {
      // Extract filename from current profile image path
      const currentImageName = currentProfileImage.split('/').pop() || currentProfileImage;
      
      // Quick check: if filenames are exactly the same
      if (newFile.name === currentImageName) {
        return true;
      }
      
      // Get current image as blob for more thorough comparison
      const currentImageUrl = getProfileImageUrl(currentProfileImage);
      const response = await fetch(currentImageUrl);
      if (!response.ok) return false;
      
      const currentBlob = await response.blob();
      
      // Compare file sizes first (quick check)
      if (newFile.size !== currentBlob.size) return false;
      
      // If sizes are the same, do byte-by-byte comparison
      const newFileBuffer = await newFile.arrayBuffer();
      const currentBuffer = await currentBlob.arrayBuffer();
      
      if (newFileBuffer.byteLength !== currentBuffer.byteLength) return false;
      
      const newArray = new Uint8Array(newFileBuffer);
      const currentArray = new Uint8Array(currentBuffer);
      
      // Compare first 1024 bytes for performance (should be enough for most cases)
      const compareLength = Math.min(1024, newArray.length);
      for (let i = 0; i < compareLength; i++) {
        if (newArray[i] !== currentArray[i]) return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error comparing images:', error);
      return false; // If there's an error, assume they're different
    }
  };

  // Remove profile picture function
  const removeProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture and use the default?')) return;
    
    if (!currentPassword) {
      alert('Please enter your current password first');
      return;
    }

    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('removeProfileImage', 'true');

    try {
      if (!userId) throw new Error('User ID missing');
      await api.putFormData<{ data: any }>(`/user/${userId}`, formData, true);
      
      setProfilePicture(null); // Set to null for default
      alert('Profile picture removed successfully');
      setShowProfileOptions(false);
      setCurrentPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to remove profile picture');
    }
  };  // Save single field
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;

    // skip update when value unchanged
    if (editingField === 'username' && editValue === username) { alert("Username should be different"); return; }
    if (editingField === 'email' && editValue === email) { alert("email should be different"); return; }
    if (editingField === 'profilePicture') {
      if (!editFile) { 
        alert("Please select a profile picture"); 
        return; 
      }
      
      // Check if the selected file is the same as current profile picture
      if (await isSameImage(editFile, profilePicture)) {
        alert("profilePicture should be different");
        return;
      }
    }

    // prepare form data
    const formData = new FormData();
    if (editingField === 'password') {
      if (!currentPassword) { alert('Enter current password'); return; }
      if (!newPassword || newPassword !== confirmNewPassword) { alert('New passwords must match'); return; }
      if (currentPassword === newPassword) { alert('Current password and new password should be different'); return; }
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    } else {
      if (!currentPassword) { alert('Enter current password'); return; }
      formData.append('currentPassword', currentPassword);
      if (editingField === 'profilePicture' && editFile) {
        formData.append('profileImage', editFile);
      } else {
        formData.append(editingField, editValue);
      }
    }

    try {
      if (!userId) throw new Error('User ID missing');
      const result = await api.putFormData<{ data: any }>(`/user/${userId}`, formData, true);      // update local state
      if (editingField === 'username') setUsername(editValue);
      if (editingField === 'email') setEmail(editValue);
      if (editingField === 'profilePicture') {
        const newUrl = result.data.profileImage || null;
        setProfilePicture(newUrl);
      }
      if (editingField === 'password') alert('Password updated');
      cancelEdit();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }  };

  // Start editing a post
  const startEditPost = (post: Post) => {
    setEditingPost(post.post_Id);
    setEditPostData({
      title: post.title,
      post: post.post,
      topik: post.topik
    });
  };

  // Cancel editing post
  const cancelEditPost = () => {
    setEditingPost(null);
    setEditPostData({
      title: '',
      post: '',
      topik: ''
    });
  };

  // Save edited post
  const saveEditPost = async (postId: string) => {
    if (!editPostData.title.trim() || !editPostData.post.trim() || !editPostData.topik.trim()) {
      alert('All fields are required');
      return;
    }    try {
      await api.put(`/user/post/${postId}`, {
        title: editPostData.title.trim(),
        post: editPostData.post, // Don't trim to preserve line breaks
        topik: editPostData.topik.trim()
      }, true);

      // Update local state
      setPosts(prev => prev.map(p => 
        p.post_Id === postId 
          ? { ...p, title: editPostData.title.trim(), post: editPostData.post, topik: editPostData.topik.trim() }
          : p
      ));

      alert('Post updated successfully');
      cancelEditPost();
    } catch (err: any) {
      alert(err.message || 'Failed to update post');
    }
  };
  // Delete handler with confirmation
  const handleDeletePost = async (postId: string) => {
    if (!userId) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setPostsLoading(true);

    try {
      await api.delete(`/user/post/${postId}`, true);
      setPosts(prev => prev.filter(p => p.post_Id !== postId));
    } catch (err) {
      console.error(err);
      setPostsError('Unable to delete post');
    } finally {
      setPostsLoading(false);
    }
  };

  // Render activity item (comments/replies)
  const renderActivityItem = (activity: UserActivity) => (
    <div key={`${activity.type}-${activity.id}`} className="profile-activity-item">
      <div className="activity-header">
        <span className={`activity-type ${activity.type}`}>
          {activity.type === 'comment' ? '💬 Comment' : '↩️ Reply'}
        </span>
        <span className="activity-time">
          {new Date(activity.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="activity-content" style={{ whiteSpace: 'pre-wrap' }}>
        {activity.content}
      </div>
      
      <div className="activity-post-info">
        <h5>On post: "{activity.post.title}"</h5>
        <p className="activity-post-author">
          by {activity.post.author.username} • #{activity.post.topik}
        </p>
        <button 
          onClick={() => navigate(`/post/${activity.post.post_Id}/comment`)}
          className="theme-btn theme-btn-secondary activity-view-post-btn"
        >
          View Post
        </button>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-card">
              <img src={getProfileImageUrl(profilePicture)} alt="Profile" className="profile-picture"/>              <div className="profile-section">
                <h3 className="profile-section-title">Profile Picture</h3>
                {!editingField && (
                  <div className="profile-picture-actions">
                    <button className="theme-btn theme-btn-secondary profile-edit-btn" onClick={() => startEdit('profilePicture', '')}>Change Picture</button>
                    {profilePicture && (
                      <button 
                        className="theme-btn theme-btn-danger profile-edit-btn" 
                        onClick={() => setShowProfileOptions(true)}
                      >
                        Remove Picture
                      </button>
                    )}
                  </div>
                )}

                {showProfileOptions && (
                  <div className="profile-options-modal">
                    <div className="profile-options-content">
                      <h4>Remove Profile Picture</h4>
                      <p>This will set your profile picture to the default avatar.</p>
                      <div className="theme-input-group">
                        <input 
                          type="password" 
                          placeholder="Enter current password" 
                          value={currentPassword} 
                          onChange={e => setCurrentPassword(e.target.value)} 
                          className="theme-input" 
                        />
                      </div>
                      <div className="profile-form-actions">
                        <button 
                          onClick={removeProfilePicture} 
                          className="theme-btn theme-btn-danger"
                          disabled={!currentPassword.trim()}
                        >
                          Remove Picture
                        </button>
                        <button 
                          onClick={() => {
                            setShowProfileOptions(false);
                            setCurrentPassword('');
                          }} 
                          className="theme-btn theme-btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}                
                
                {editingField === 'profilePicture' && (
                  <form onSubmit={saveEdit} className="profile-edit-form">
                    <div className="theme-input-group1">
                      <label className="profile-file-label">
                        Choose New Profile Picture
                        <input type="file" accept="image/*" onChange={handleFileChange} className="theme-input profile-file-input" />
                      </label>
                    </div>
                    
                    {/* Always show Cancel button when in edit mode */}
                    <div className="profile-form-actions">
                      <button type="button" className="theme-btn theme-btn-secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                    
                    {editFile && (
                      <div className="profile-preview">
                        <img 
                          src={URL.createObjectURL(editFile)} 
                          alt="Preview" 
                          className="profile-preview-image"
                        />
                        <p className="profile-preview-text">Preview of new profile picture</p>
                      </div>
                    )}
                    
                    {editFile && (
                      <>
                        <div className="theme-input-group">
                          <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="theme-input" />
                        </div>
                        <div className="profile-form-actions">
                          <button type="submit" className="theme-btn">Save Picture</button>
                          <button type="button" className="theme-btn theme-btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>

              <div className="profile-section">
                <h3 className="profile-section-title">Account Information</h3>
                <div className="profile-fields">

                  {(editingField === null || editingField === 'username') && (
                    <div className="profile-field">
                      <div className="profile-field-label">Username</div>
                      <div className="profile-field-value">{username}</div>
                      {!editingField && <button className="theme-btn theme-btn-secondary profile-edit-btn" onClick={() => startEdit('username', username)}>Edit</button>}
                      {editingField === 'username' && (
                        <form onSubmit={saveEdit} className="profile-edit-form">
                          <div className="theme-input-group">
                            <input value={editValue} onChange={e => setEditValue(e.target.value)} required className="theme-input" />
                          </div>                          
                          {editValue.trim() && (
                            <>
                              <div className="theme-input-group">
                                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="theme-input" />
                              </div>
                              <div className="profile-form-actions">
                                <button type="submit" className="theme-btn">Save</button>
                                <button type="button" className="theme-btn theme-btn-secondary" onClick={cancelEdit}>Cancel</button>
                              </div>
                            </>
                          )}
                        </form>
                      )}
                    </div>
                  )}

                  {(editingField === null || editingField === 'email') && (
                    <div className="profile-field">
                      <div className="profile-field-label">Email</div>
                      <div className="profile-field-value">{email}</div>
                      {!editingField && <button className="theme-btn theme-btn-secondary profile-edit-btn" onClick={() => startEdit('email', email)}>Edit</button>}
                      {editingField === 'email' && (
                        <form onSubmit={saveEdit} className="profile-edit-form">
                          <div className="theme-input-group">
                            <input type="email" value={editValue} onChange={e => setEditValue(e.target.value)} required className="theme-input" />
                          </div>
                          {editValue.trim() && (
                            <>
                              <div className="theme-input-group">
                                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="theme-input" />
                              </div>
                              <div className="profile-form-actions">
                                <button type="submit" className="theme-btn">Save</button>
                                <button type="button" className="theme-btn theme-btn-secondary" onClick={cancelEdit}>Cancel</button>
                              </div>
                            </>
                          )}
                        </form>
                      )}
                    </div>
                  )}

                  {(editingField === null || editingField === 'password') && (
                    <div className="profile-field">
                      <div className="profile-field-label">Password</div>
                      <div className="profile-field-value">••••••••</div>
                      {!editingField && <button className="theme-btn theme-btn-secondary profile-edit-btn" onClick={() => startEdit('password', '')}>Change Password</button>}
                      {editingField === 'password' && (
                        <form onSubmit={saveEdit} className="profile-edit-form">
                          <div className="theme-input-group">
                            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="theme-input" />
                          </div>
                          <div className="theme-input-group">
                            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="theme-input" />
                          </div>
                          <div className="theme-input-group">
                            <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required className="theme-input" />
                          </div>
                          <div className="profile-form-actions">
                            <button type="submit" className="theme-btn">Save</button>
                            <button type="button" className="theme-btn theme-btn-secondary" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>          <div className="profile-posts">
            <div className="profile-card">
              <div className="profile-actions theme-mt">
                <Link to="/user" className="theme-btn profile-back-btn">
                  Back To Home Page
                </Link>
              </div>
                {/* Tab Navigation */}
              <div className="tab-navigation">
                <button 
                  className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  My Posts
                </button>
                <button 
                  className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  Comments & Replies
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'posts' && (
                  <div className="profile-posts-content">
                    {postsLoading && <p>Loading posts...</p>}
                    {postsError && <p className="profile-error">{postsError}</p>}
                    {!postsLoading && !postsError && posts.length === 0 && (
                      <p className="profile-empty-message">You have no posts yet.</p>
                    )}
                    
                    {posts.map(p => (
                <div key={p.post_Id} className="profile-post-item">
                  {editingPost === p.post_Id ? (
                    // Edit mode
                    <div className="profile-post-edit-form">
                      <div className="profile-post-header">
                        <img src={getProfileImageUrl(profilePicture)} alt={username} className="theme-profile-img"/>
                        <span className="profile-post-username">{username}</span>
                      </div>
                      
                      <div className="post-edit-fields">
                        <div className="theme-input-group">
                          <label className="theme-label">Title</label>
                          <input
                            type="text"
                            value={editPostData.title}
                            onChange={(e) => setEditPostData(prev => ({ ...prev, title: e.target.value }))}
                            className="theme-input"
                            placeholder="Enter post title"
                          />
                        </div>
                          <div className="theme-input-group">
                          <label className="theme-label">Content</label>
                          <textarea
                            value={editPostData.post}
                            onChange={(e) => setEditPostData(prev => ({ ...prev, post: e.target.value }))}
                            className="theme-input post-edit-textarea"
                            placeholder="Enter post content... (Press Enter for new lines)"
                            rows={5}
                            style={{ whiteSpace: 'pre-wrap' }}
                          />
                        </div>
                        
                        <div className="theme-input-group">
                          <label className="theme-label">Topic</label>
                          <select
                            value={editPostData.topik}
                            onChange={(e) => setEditPostData(prev => ({ ...prev, topik: e.target.value }))}
                            className="theme-input"
                          >
                            <option value="">-- Select Topic --</option>
                            <option value="Sports">Sports</option>
                            <option value="Game">Game</option>
                            <option value="Music">Music</option>
                            <option value="Otomotif">Otomotif</option>
                            <option value="War">War</option>
                            <option value="Daily Life">Daily Life</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="profile-post-actions">
                        <button 
                          onClick={() => saveEditPost(p.post_Id)} 
                          disabled={postsLoading}
                          className="theme-btn theme-btn-success"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={cancelEditPost} 
                          disabled={postsLoading}
                          className="theme-btn theme-btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <Link to={`/post/${p.post_Id}/comment`} className="profile-post-link">
                        <div className="profile-post-header">
                          <img src={getProfileImageUrl(profilePicture)} alt={username} className="theme-profile-img"/>
                          <span className="profile-post-username">{username}</span>
                        </div>                        <h3 className="profile-post-title">{p.title}</h3>
                        <div 
                          className="profile-post-content"
                          style={{ whiteSpace: 'pre-wrap' }}
                        >
                          {p.post}
                        </div>
                        <div className="profile-post-meta">
                          <small className="profile-post-time">{formatTime(p.createdAt)}</small>
                          <span className="profile-post-topic">{p.topik}</span>
                        </div>
                      </Link>
                      <div className="profile-post-actions">
                        <button 
                          onClick={() => startEditPost(p)} 
                          disabled={postsLoading || editingPost !== null}
                          className="theme-btn theme-btn-primary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePost(p.post_Id)} 
                          disabled={postsLoading || editingPost !== null}
                          className="theme-btn theme-btn-danger"
                        >
                          Delete
                        </button>                      </div>
                    </>
                  )}
                </div>
              ))}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="profile-activity-content">
                    {activityLoading && <p>Loading activity...</p>}
                    {activityError && <p className="profile-error">{activityError}</p>}
                    
                    {!activityLoading && userActivity.length === 0 && (
                      <p className="profile-empty-message">
                        No comments or replies yet. Start engaging with posts!
                      </p>
                    )}
                    
                    {userActivity.map(renderActivityItem)}
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;