// pages/ChatPage.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import useChat from '../../hooks/useChat';
import { useApp } from '../../App';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import ChatHistoryPanel from '../../components/chat/ChatHistoryPanel';
import WelcomeScreen from '../../components/chat/WelcomeScreen';
import { IconButton } from '../../components/common/Button';
import { PulseDot } from '../../components/common/Loading';
import { FlowerIcon, ClockIcon, PlusIcon, TrashIcon } from '../../components/common/Icon';
import '../../styles/chat.css';

const MIREI = {
  id: 'mirei_001',
  name: 'Mirei',
  avatar: '/assets/mirei-avatar.png',
  greeting: 'Halo! Aku Mirei, asisten virtualmu. Ada yang bisa aku bantu hari ini?'
};

// ── Emotion detection ──────────────────────────────────────────
const detectEmotion = (messages) => {
  if (!messages || messages.length === 0) return 'neutral';
  const combined = messages.slice(-4).map(m => m.content?.toLowerCase() || '').join(' ');
  if (/makasih|terima kasih/.test(combined)) return 'happy';
  if (/sedih|capek|lelah|kecewa/.test(combined)) return 'sad';
  if (/lucu|wkwk|haha|ngakak/.test(combined)) return 'laugh';
  return 'neutral';
};

const EMOTION_CFG = {
  happy:   { emoji: '😊', label: 'Senang',  glow: '#f9a8d4' },
  sad:     { emoji: '😢', label: 'Sedih',   glow: '#93c5fd' },
  laugh:   { emoji: '😂', label: 'Tertawa', glow: '#fde68a' },
  neutral: { emoji: '😌', label: 'Santai',  glow: '#a5b4fc' },
};

// ── Live2D Panel ───────────────────────────────────────────────
const Live2DPanel = ({ emotion }) => {
  const cfg = EMOTION_CFG[emotion] || EMOTION_CFG.neutral;
  return (
    <div style={{
      width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: 'rgba(255,255,255,0.025)',
      borderLeft: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'180px', height:'180px',
        borderRadius:'50%', background:`radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
        opacity:0.09, pointerEvents:'none', transition:'background 0.6s ease' }} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 18px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize:'15px', fontWeight:600, color:'var(--t1)' }}>Mirei</span>
        <span style={{ fontSize:'10.5px', padding:'3px 10px', borderRadius:'99px',
          background:`${cfg.glow}14`, color:cfg.glow, border:`1px solid ${cfg.glow}40`,
          transition:'all 0.5s ease' }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' }}>
          <div style={{ position:'relative', width:'130px', height:'130px',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:'84px', height:'84px', borderRadius:'50%',
              background:'linear-gradient(135deg,#1e1f2e,#2a1f3d)',
              border:'2px solid rgba(139,92,246,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'38px', zIndex:3, position:'relative',
              boxShadow:`0 0 22px ${cfg.glow}40`, transition:'all 0.5s ease' }}>
              {cfg.emoji}
            </div>
            {[98, 114, 130].map((s, i) => (
              <div key={i} style={{ position:'absolute', width:`${s}px`, height:`${s}px`,
                borderRadius:'50%', border:`1px solid ${cfg.glow}${['40','25','12'][i]}`,
                animation:`liveRingPulse 3s ${i*0.5}s infinite ease-in-out` }} />
            ))}
          </div>
          <span style={{ fontSize:'10.5px', color:'var(--t3)', letterSpacing:'0.04em' }}>Live2D Canvas</span>
        </div>
      </div>

      <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', gap:'6px', justifyContent:'center' }}>
          {Object.entries(EMOTION_CFG).map(([key, v]) => (
            <div key={key} title={v.label} style={{
              width:'30px', height:'30px', borderRadius:'8px', fontSize:'15px',
              display:'flex', alignItems:'center', justifyContent:'center',
              background: emotion===key ? `${v.glow}20` : 'rgba(255,255,255,0.05)',
              border:`1px solid ${emotion===key ? `${v.glow}50` : 'rgba(255,255,255,0.08)'}`,
              opacity: emotion===key ? 1 : 0.4, transition:'all 0.2s ease',
            }}>{v.emoji}</div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginTop:'8px' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#a78bfa',
            animation:'livePulseDot 2s infinite' }} />
          <span style={{ fontSize:'11px', color:'var(--t3)' }}>
            Ekspresi: <strong style={{ color:'#a78bfa' }}>{cfg.label}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

// ── ChatPage ───────────────────────────────────────────────────
const ChatPage = () => {
  const { messages, sendMessage, isLoading, clearChat, newChat, loadSession } = useChat(MIREI);
  const { activePage, notifyChatMessage, user } = useApp();
  const emotion = useMemo(() => detectEmotion(messages), [messages]);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const prevLengthRef = useRef(messages.length);

  // Tampilkan welcome screen saat pertama masuk atau ganti akun
  const [showWelcome, setShowWelcome] = useState(true);
  const lastUserRef = useRef(user?.id);

  // Track berapa kali halaman chat aktif → untuk reset animasi welcome
  const [welcomeKey, setWelcomeKey] = useState(0);
  const wasActiveRef = useRef(activePage === 'chat');

  useEffect(() => {
    const isNowActive = activePage === 'chat';
    if (isNowActive && !wasActiveRef.current) {
      // Baru kembali ke halaman chat → reset animasi
      setWelcomeKey(k => k + 1);
    }
    wasActiveRef.current = isNowActive;
  }, [activePage]);

  useEffect(() => {
    if (user?.id !== lastUserRef.current) {
      setShowWelcome(true);
      lastUserRef.current = user?.id;
    }
  }, [user?.id]);

  // Detect new AI messages and notify sidebar
  useEffect(() => {
    const prev = prevLengthRef.current;
    const curr = messages.length;
    if (curr > prev) {
      const lastMsg = messages[curr - 1];
      if (lastMsg?.role === 'assistant' && activePage !== 'chat') {
        notifyChatMessage?.();
      }
    }
    prevLengthRef.current = curr;
  }, [messages, activePage, notifyChatMessage]);

  const handleViewHistory = () => {
    setHistoryPanelOpen(true);
  };

  const handleNewChat = () => {
    newChat();
  };

  const handleSelectChat = (chat) => {
    loadSession(chat.id);
    setShowWelcome(false);
    setHistoryPanelOpen(false);
  };

  const handleWelcomeStart = (firstMessage) => {
    setShowWelcome(false);
    sendMessage(firstMessage);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Chat History Panel */}
      <ChatHistoryPanel
        isOpen={historyPanelOpen}
        onClose={() => setHistoryPanelOpen(false)}
        onSelectChat={handleSelectChat}
      />

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">{/* Topbar */}
        <div className="flex items-center justify-between flex-shrink-0" style={{
          padding:'14px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)',
          background:'rgba(12,14,22,0.6)', backdropFilter:'blur(12px)',
          WebkitBackdropFilter:'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-lg" style={{
              background:'linear-gradient(135deg,#7c3aed,#ec4899)',
              boxShadow:'0 0 14px rgba(139,92,246,0.4)' }}>
              <FlowerIcon size={20} color="#fff" />
            </div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color:'var(--t1)' }}>{MIREI.name}</div>
              <div className="text-[11px] flex items-center gap-[5px]" style={{
                color:isLoading?'#a78bfa':'#10b981' }}>
                <PulseDot
                  color={isLoading ? '#a78bfa' : '#10b981'}
                  animate={isLoading}
                />
                {isLoading ? 'Mengetik...' : 'Online'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleViewHistory}
              title="Lihat riwayat chat"
              icon={<ClockIcon size={15} />}
            />
            <IconButton
              onClick={handleNewChat}
              title="Percakapan baru"
              icon={<PlusIcon size={15} />}
            />
            <IconButton
              onClick={clearChat}
              title="Hapus percakapan"
              icon={<TrashIcon size={15} />}
            />
          </div>
        </div>

        {showWelcome ? (
          <WelcomeScreen key={welcomeKey} username={user?.username} onStart={handleWelcomeStart} active={activePage === 'chat'} />
        ) : (
          <>
            <ChatWindow messages={messages} isLoading={isLoading} character={MIREI} />
            <ChatInput onSend={sendMessage} disabled={isLoading} placeholder={`Kirim pesan ke ${MIREI.name}...`} />
          </>
        )}
      </div>

      {/* Live2D panel */}
      <Live2DPanel emotion={emotion} />
    </div>
  );
};

export default ChatPage;