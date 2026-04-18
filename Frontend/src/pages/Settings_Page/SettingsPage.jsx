// pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useApp } from '../../App';
import { Toggle, Select } from '../../components/common/Input';
import { ConfirmModal } from '../../components/common/Modal';
import { ToastContainer, useToast } from '../../components/common/Toast';
import { BellIcon, LockIcon, TrashIcon, PaletteIcon, GlobeIcon, AlertIcon } from '../../components/common/Icon';
import './settings.css';

const SettingsPage = () => {
  const { theme, toggleTheme } = useApp();
  const { toasts, removeToast, toast } = useToast();

  const [settings, setSettings] = useState({
    notifications: true,
    sounds: false,
    autoSave: true,
    analytics: false,
    compactMode: false,
    animations: true,
    language: 'id',
    fontSize: 'medium',
  });

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleClearHistory = () => {
    setConfirmModal({ isOpen: true, type: 'clearHistory' });
  };

  const handleDeleteAccount = () => {
    setConfirmModal({ isOpen: true, type: 'deleteAccount' });
  };

  const handleConfirm = () => {
    if (confirmModal.type === 'clearHistory') {
      console.log('Clear all chat history');
      toast.success('Riwayat chat telah dihapus');
    } else if (confirmModal.type === 'deleteAccount') {
      console.log('Delete account permanently');
      toast.success('Akun telah dihapus');
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const SECTIONS = [
    {
      title: 'Tampilan',
      icon: <PaletteIcon size={18} />,
      rows: [
        {
          label: 'Mode Gelap',
          sub: 'Gunakan tema gelap untuk tampilan nyaman',
          control: <Toggle value={theme === 'dark'} onChange={() => toggleTheme && toggleTheme()} />,
        },
        {
          label: 'Animasi',
          sub: 'Aktifkan transisi dan animasi halus',
          control: <Toggle value={settings.animations} onChange={v => set('animations', v)} />,
        },
        {
          label: 'Mode Kompak',
          sub: 'Kurangi spasi untuk tampilan yang lebih padat',
          control: <Toggle value={settings.compactMode} onChange={v => set('compactMode', v)} />,
        },
        {
          label: 'Ukuran Teks',
          sub: 'Sesuaikan ukuran teks dalam obrolan',
          control: (
            <Select
              value={settings.fontSize}
              onChange={e => set('fontSize', e.target.value)}
              options={[
                { value: 'small',  label: 'Kecil' },
                { value: 'medium', label: 'Sedang' },
                { value: 'large',  label: 'Besar' },
              ]}
            />
          ),
        },
      ],
    },
    {
      title: 'Notifikasi',
      icon: <BellIcon size={18} />,
      rows: [
        {
          label: 'Notifikasi Push',
          sub: 'Terima notifikasi saat ada balasan baru',
          control: <Toggle value={settings.notifications} onChange={v => set('notifications', v)} />,
        },
        {
          label: 'Suara',
          sub: 'Putar suara saat pesan masuk',
          control: <Toggle value={settings.sounds} onChange={v => set('sounds', v)} />,
        },
      ],
    },
    {
      title: 'Privasi & Data',
      icon: <LockIcon size={18} />,
      rows: [
        {
          label: 'Simpan Riwayat',
          sub: 'Simpan percakapan secara otomatis',
          control: <Toggle value={settings.autoSave} onChange={v => set('autoSave', v)} />,
        },
        {
          label: 'Analitik Anonim',
          sub: 'Bantu kami meningkatkan layanan',
          control: <Toggle value={settings.analytics} onChange={v => set('analytics', v)} />,
        },
      ],
    },
    {
      title: 'Bahasa',
      icon: <GlobeIcon size={18} />,
      rows: [
        {
          label: 'Bahasa Antarmuka',
          sub: 'Pilih bahasa yang digunakan aplikasi',
          control: (
            <Select
              value={settings.language}
              onChange={e => set('language', e.target.value)}
              options={[
                { value: 'id', label: 'Bahasa Indonesia' },
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
              ]}
            />
          ),
        },
      ],
    },
  ];

  return (
    <div className="settings-page-wrap">
      {/* Header */}
      <div className="animate-slideUp">
        <h1 className="settings-page-title">Pengaturan</h1>
        <p className="settings-page-sub">Sesuaikan pengalaman Mirei-mu</p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-5">
        {SECTIONS.map((section, si) => (
          <div key={si} className="settings-section-card" style={{ animationDelay: `${si*0.07}s` }}>
            <div className="settings-section-head">
              <span className="settings-section-icon">{section.icon}</span>
              <span className="settings-section-title">{section.title}</span>
            </div>
            <div className="flex flex-col">
              {section.rows.map((row, ri) => (
                <div key={ri} className={`settings-row ${ri > 0 ? 'settings-row-border' : ''}`}>
                  <div className="flex-1">
                    <div className="settings-label">{row.label}</div>
                    <div className="settings-sub">{row.sub}</div>
                  </div>
                  {row.control}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div className="settings-section-card" style={{ borderColor:'rgba(239,68,68,0.2)', animationDelay:'0.28s' }}>
          <div className="settings-section-head">
            <span className="settings-section-icon"><AlertIcon size={18} /></span>
            <span className="settings-section-title settings-section-title-danger">Zona Berbahaya</span>
          </div>
          <div className="p-5 pt-0 flex flex-col gap-[10px]">
            <button className="settings-danger-btn" onClick={handleClearHistory}>
              <TrashIcon size={16} /> Hapus Semua Riwayat Chat
            </button>
            <button className="settings-danger-btn settings-danger-btn-critical" onClick={handleDeleteAccount}>
              <TrashIcon size={16} /> Hapus Akun Permanen
            </button>
          </div>
        </div>

        {/* App info */}
        <div className="settings-info-row">
          <span className="settings-info-text">Mirei App · v1.0.0</span>
          <span className="settings-info-text">Made with ✦ in 2024</span>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={handleConfirm}
        title={confirmModal.type === 'clearHistory' ? 'Hapus Riwayat Chat' : 'Hapus Akun Permanen'}
        message={
          confirmModal.type === 'clearHistory'
            ? 'Apakah Anda yakin ingin menghapus semua riwayat chat? Tindakan ini tidak dapat dibatalkan.'
            : 'Apakah Anda yakin ingin menghapus akun permanen? Semua data akan hilang dan tidak dapat dipulihkan.'
        }
        confirmLabel={confirmModal.type === 'clearHistory' ? 'Ya, Hapus' : 'Hapus Akun'}
        danger
      />

      {/* Toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default SettingsPage;
