// components/common/Modal/ConfirmModal.jsx
// Pengganti window.confirm() yang dipakai di ProfilePage & SettingsPage
import React from 'react';
import Modal from './Modal';
import Button from '../Button/Button';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  danger = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="small"
    footer={
      <>
        <Button variant="secondary" size="medium" onClick={onClose}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} size="medium" onClick={() => { onConfirm?.(); onClose?.(); }}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p style={{ color: 'var(--t2)', fontSize: '13.5px', lineHeight: 1.6 }}>{message}</p>
  </Modal>
);

export default ConfirmModal;
