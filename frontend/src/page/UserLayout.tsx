import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import profileImage from '../assets/profileImage.jpeg';

const UserLayout = () => {
  return (
    <section className="bodyHome">
        <main className="posts">
          <Outlet /> {/* DI SINI HALAMAN CHILD AKAN DITAMPILKAN */}
        </main>
    </section>
  );
};

export default UserLayout;
