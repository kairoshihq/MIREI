// components/common/Input/Select.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Input.css';

const Select = ({ value, onChange, options = [], className = '', style = {} }) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  const selected = options.find(o => o.value === value);

  const calcPos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleOpen = () => {
    if (!open) calcPos();
    setOpen(v => !v);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const update = () => calcPos();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  const handleSelect = (opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  };

  const dropdown = open && ReactDOM.createPortal(
    <div
      ref={dropRef}
      className="custom-select-dropdown"
      style={{
        position: 'fixed',
        top: dropPos.top,
        left: dropPos.left,
        minWidth: dropPos.width,
      }}
    >
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`custom-select-option ${isActive ? 'custom-select-option-active' : ''}`}
            onClick={() => handleSelect(opt)}
          >
            {isActive ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span style={{ width: 13, flexShrink: 0 }} />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>,
    document.body
  );

  return (
    <div
      className={`custom-select-wrap ${className}`}
      style={style}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`custom-select-trigger ${open ? 'custom-select-trigger-open' : ''}`}
        onClick={handleOpen}
      >
        <span className="custom-select-value">{selected?.label ?? '—'}</span>
        <svg
          className={`custom-select-chevron ${open ? 'custom-select-chevron-open' : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {dropdown}
    </div>
  );
};

export default Select;
