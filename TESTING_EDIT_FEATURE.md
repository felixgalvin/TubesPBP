# Testing Fitur Edit Comment & Reply

## ✅ Setup Environment
Backend server sudah berjalan di: http://localhost:3000
Frontend server sudah berjalan di: http://localhost:5175

## 🧪 Cara Testing Fitur Edit:

### 1. Login ke Aplikasi
- Buka http://localhost:5175
- Login dengan akun yang sudah ada

### 2. Test Edit Comment
1. Buka halaman post dengan klik pada salah satu post
2. Buat comment baru jika belum ada
3. Pada comment yang Anda buat, akan muncul tombol **✏️ Edit**
4. Klik tombol Edit
5. Form textarea akan muncul dengan isi comment saat ini
6. Edit isi comment sesuai keinginan
7. Klik **Save** untuk menyimpan atau **Cancel** untuk membatalkan

### 3. Test Edit Reply
1. Pada comment yang ada, klik tombol **Reply**
2. Buat reply baru
3. Pada reply yang Anda buat, akan muncul tombol **✏️ Edit**
4. Klik tombol Edit
5. Form textarea akan muncul dengan isi reply saat ini
6. Edit isi reply sesuai keinginan
7. Klik **Save** untuk menyimpan atau **Cancel** untuk membatalkan

## 🔒 Security Features
- Tombol Edit hanya muncul pada comment/reply milik user yang login
- Hanya pemilik comment/reply yang bisa mengedit
- Validasi di backend memastikan user ownership
- Authorization token diperlukan untuk semua operasi edit

## 🎨 UI/UX Features
- Edit button dengan emoji ✏️ 
- Form edit dengan textarea responsive
- Save button (biru) dan Cancel button (abu-abu)
- Tombol delete disembunyikan saat mode edit aktif
- Smooth transitions dan hover effects

## 📝 API Endpoints Baru
- `PUT /api/user/post/:postId/comment/:commentId` - Edit comment
- `PUT /api/user/post/:postId/comment/:commentId/reply/:replyId` - Edit reply

## 🚀 Scripts NPM
- `npm run backend` - Jalankan backend server saja
- `npm run dev` - Jalankan frontend server saja  
- `npm run start:dev` - Jalankan kedua server bersamaan (perlu install concurrently)

Selamat mencoba! 🎉
