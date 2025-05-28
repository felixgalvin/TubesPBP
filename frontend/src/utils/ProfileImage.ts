import defaultProfileImage from '../assets/profileImage.jpeg';

const UPLOAD_BASE_URL = 'http://localhost:3000/uploads';

export const getProfileImageUrl = (filename?: string | null): string =>
    filename ? `${UPLOAD_BASE_URL}/${filename}` : defaultProfileImage;