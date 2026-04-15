// pages/NotFoundPage.jsx
import React from 'react';
import { useApp } from '../../App';
import './notfound.css';

const NotFoundPage = () => {
  const { navigateTo } = useApp();

  const handleNavigate = (page) => {
    if (navigateTo && typeof navigateTo === 'function') {
      navigateTo(page);
    } else {
      console.warn('navigateTo function not available');
    }
  };

  return (
    <div className="notfound-wrap">
      <div className="notfound-orb" />
      <div className="notfound-content">
        <div className="notfound-big-num">404</div>
        <div className="notfound-title">Halaman Tidak Ditemukan</div>
        <p className="notfound-sub">Sepertinya kamu tersesat. Biarkan Mirei membantumu kembali!</p>
        <button className="notfound-home-btn" onClick={() => handleNavigate('home')}>
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
