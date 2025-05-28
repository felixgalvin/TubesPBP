import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/ProfilePage.css';
import { formatTime } from '../utils/FormatTime';
import { Post } from '../types/Index';
import { api } from '../api/Api';
import { getProfileImageUrl } from '../utils/ProfileImage';

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
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth/login'); return; }
    getProfile(token);
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    getPosts(userId);
  }, [userId]);

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
    setNewPassword(''); setConfirmNewPassword('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEditFile(e.target.files[0]);
  };
  // Save single field
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;

    // skip update when value unchanged
    if (editingField === 'username' && editValue === username) { cancelEdit(); return; }
    if (editingField === 'email' && editValue === email) { cancelEdit(); return; }
    if (editingField === 'profilePicture' && !editFile) { cancelEdit(); return; }

    // prepare form data
    const formData = new FormData();
    if (editingField === 'password') {
      if (!currentPassword) { alert('Enter current password'); return; }
      if (!newPassword || newPassword !== confirmNewPassword) { alert('New passwords must match'); return; }
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
      const result = await api.putFormData<{ data: any }>(`/user/${userId}`, formData, true);

      // update local state
      if (editingField === 'username') setUsername(editValue);
      if (editingField === 'email') setEmail(editValue);
      if (editingField === 'profilePicture') {
        const newUrl = result.data.profileImage || '';
        setProfilePicture(newUrl);
      }
      if (editingField === 'password') alert('Password updated');
      cancelEdit();
    } catch (err: any) {
      alert(err.message || 'Update failed');
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

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-card">
              <img src={getProfileImageUrl(profilePicture)} alt="Profile" className="profile-picture"/>

              <div className="profile-section">
                <h3 className="profile-section-title">Profile Picture</h3>
                {!editingField && <button className="theme-btn theme-btn-secondary profile-edit-btn" onClick={() => startEdit('profilePicture', '')}>Change Picture</button>}
                {editingField === 'profilePicture' && (
                  <form onSubmit={saveEdit} className="profile-edit-form">
                    <div className="theme-input-group">
                      <input type="file" accept="image/*" onChange={handleFileChange} required className="theme-input" />
                    </div>
                    {editFile && (
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
          </div>

          <div className="profile-posts">
            <div className="profile-card">
              <div className="profile-actions theme-mt">
                <Link to="/user" className="theme-btn profile-back-btn">
                  Back To Home Page
                </Link>
              </div>
              <h2 className="profile-section-title">My Posts</h2>
              {postsLoading && <p>Loading posts...</p>}
              {postsError && <p className="profile-error">{postsError}</p>}
              {!postsLoading && !postsError && posts.length === 0 && <p className="profile-empty-message">You have no posts yet.</p>}

              {posts.map(p => (
                <div key={p.post_Id} className="profile-post-item">
                  <Link to={`/post/${p.post_Id}/comment`} className="profile-post-link">
                    <div className="profile-post-header">
                      <img src={getProfileImageUrl(profilePicture)} alt={username} className="theme-profile-img"/>
                      <span className="profile-post-username">{username}</span>
                    </div>
                    <h3 className="profile-post-title">{p.title}</h3>
                    <p className="profile-post-content">{p.post}</p>
                    <div className="profile-post-meta">
                      <small className="profile-post-time">{formatTime(p.createdAt)}</small>
                    </div>
                  </Link>
                  <div className="profile-post-actions">
                    <button onClick={() => handleDeletePost(p.post_Id)} disabled={postsLoading} className="theme-btn theme-btn-danger">Delete</button>
                  </div>
                </div>
              ))}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;