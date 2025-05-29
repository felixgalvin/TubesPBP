import defaultProfileImage from '../assets/profileImage.jpeg';

const UPLOAD_BASE_URL = 'http://localhost:3000/uploads';

export const getProfileImageUrl = (filename?: string | null): string => {
  // Return default image if filename is null, undefined, or empty
  if (!filename) {
    return defaultProfileImage;
  }
  
  // If it's already a full URL, return as is
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Otherwise, prepend the base URL
  return `${UPLOAD_BASE_URL}/${filename}`;
};