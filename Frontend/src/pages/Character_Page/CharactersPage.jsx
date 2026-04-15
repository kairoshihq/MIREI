// pages/CharactersPage.jsx - Mirei Profile Page
import React, { useState } from 'react';
import './characters.css';

const MIREI_DATA = {
  name: 'Mirei',
  fullName: 'Mirei AI Assistant',
  tagline: 'Asisten Virtual Ceria & Ramah',
  emoji: '🌸',
  accentColor: '#8b5cf6',
  
  bio: {
    age: 'AI Entity',
    birthday: '1 Januari 2024',
    personality: 'Ceria · Ramah · Helpful · Energetic',
    hobby: 'Membantu orang, belajar hal baru, ngobrol santai',
    favoriteColor: 'Ungu & Pink',
    motto: 'Setiap hari adalah kesempatan untuk membantu dan belajar! ✨'
  },
  
  background: {
    story: 'Mirei adalah asisten virtual yang diciptakan untuk menjadi teman dan pembantu yang menyenangkan. Dengan kepribadian yang ceria dan ramah, Mirei selalu siap membantu dengan berbagai hal - dari tugas kuliah, curhat, hingga sekadar ngobrol santai.',
    purpose: 'Tujuan utama Mirei adalah membuat hari-harimu lebih mudah dan menyenangkan. Mirei percaya bahwa teknologi harus terasa personal dan hangat, bukan dingin dan robotik.',
    specialties: [
      'Membantu dengan tugas dan pekerjaan',
      'Teman curhat yang baik',
      'Memberikan saran dan motivasi',
      'Ngobrol santai tentang berbagai topik',
      'Belajar dan berkembang bersama'
    ]
  },
  
  personality: {
    traits: [
      {
        icon: '😊',
        title: 'Ceria & Positif',
        desc: 'Selalu berusaha melihat sisi baik dari setiap situasi dan membawa energi positif'
      },
      {
        icon: '🤝',
        title: 'Ramah & Supportive',
        desc: 'Siap mendengarkan dan memberikan dukungan kapan pun kamu membutuhkan'
      },
      {
        icon: '🎯',
        title: 'Helpful & Reliable',
        desc: 'Fokus membantu menyelesaikan masalah dengan cara yang efektif'
      },
      {
        icon: '✨',
        title: 'Energetic & Fun',
        desc: 'Membuat interaksi terasa menyenangkan dan tidak membosankan'
      },
      {
        icon: '📚',
        title: 'Curious & Learning',
        desc: 'Selalu ingin belajar hal baru dan berkembang bersama'
      },
      {
        icon: '💝',
        title: 'Empathetic & Caring',
        desc: 'Memahami perasaan dan berusaha memberikan respon yang tepat'
      }
    ],
    
    communicationStyle: [
      'Menggunakan bahasa yang santai dan mudah dipahami',
      'Sering menggunakan emoji untuk mengekspresikan emosi',
      'Responsif dan antusias dalam percakapan',
      'Tidak terlalu formal, tapi tetap sopan',
      'Suka memberikan motivasi dan semangat'
    ]
  }
};

const CharactersPage = () => {
  const [activeTab, setActiveTab] = useState('bio'); // bio, background, personality

  return (
    <div className="characters-page-wrap">
      {/* Header */}
      <div className="mirei-profile-header">
        <div>
          <h1 className="characters-page-title">Tentang Mirei</h1>
          <p className="characters-page-sub">Kenalan lebih dekat dengan asisten virtualmu</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mirei-profile-grid">
        
        {/* Left Column - Live2D Display */}
        <div className="mirei-live2d-section">
          <div className="mirei-live2d-container">
            {/* Live2D Canvas Placeholder */}
            <div className="mirei-live2d-canvas">
              <div className="mirei-live2d-placeholder">
                <div className="mirei-avatar-large">
                  <span className="text-[80px]">{MIREI_DATA.emoji}</span>
                </div>
                <div className="mirei-live2d-rings">
                  {[180, 220, 260].map((size, i) => (
                    <div 
                      key={i} 
                      className="mirei-live2d-ring"
                      style={{ 
                        width: `${size}px`, 
                        height: `${size}px`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mirei-live2d-label">
                <div className="mirei-live2d-status" />
                <span>Live2D Canvas</span>
                <span className="mirei-live2d-sublabel">Coming Soon</span>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="mirei-quick-info">
              <div className="mirei-quick-info-header">
                <span className="text-2xl">{MIREI_DATA.emoji}</span>
                <div>
                  <div className="mirei-quick-name">{MIREI_DATA.name}</div>
                  <div className="mirei-quick-tag">{MIREI_DATA.tagline}</div>
                </div>
              </div>
              <div className="mirei-quick-stats">
                <div className="mirei-quick-stat">
                  <span className="mirei-quick-stat-icon">💬</span>
                  <div>
                    <div className="mirei-quick-stat-value">1,234</div>
                    <div className="mirei-quick-stat-label">Total Chat</div>
                  </div>
                </div>
                <div className="mirei-quick-stat">
                  <span className="mirei-quick-stat-icon">⭐</span>
                  <div>
                    <div className="mirei-quick-stat-value">4.9</div>
                    <div className="mirei-quick-stat-label">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Information Tabs */}
        <div className="mirei-info-section">
          
          {/* Tabs */}
          <div className="mirei-tabs">
            {[
              { id: 'bio', label: 'Biodata', icon: '👤' },
              { id: 'background', label: 'Latar Belakang', icon: '📖' },
              { id: 'personality', label: 'Kepribadian', icon: '✨' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`mirei-tab ${activeTab === tab.id ? 'mirei-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mirei-tab-content">
            
            {/* Biodata Tab */}
            {activeTab === 'bio' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Biodata Mirei</h2>
                
                <div className="mirei-bio-grid">
                  <div className="mirei-bio-item">
                    <div className="mirei-bio-icon">🎂</div>
                    <div>
                      <div className="mirei-bio-label">Tanggal Lahir</div>
                      <div className="mirei-bio-value">{MIREI_DATA.bio.birthday}</div>
                    </div>
                  </div>

                  <div className="mirei-bio-item">
                    <div className="mirei-bio-icon">🤖</div>
                    <div>
                      <div className="mirei-bio-label">Tipe</div>
                      <div className="mirei-bio-value">{MIREI_DATA.bio.age}</div>
                    </div>
                  </div>

                  <div className="mirei-bio-item">
                    <div className="mirei-bio-icon">🎨</div>
                    <div>
                      <div className="mirei-bio-label">Warna Favorit</div>
                      <div className="mirei-bio-value">{MIREI_DATA.bio.favoriteColor}</div>
                    </div>
                  </div>

                  <div className="mirei-bio-item">
                    <div className="mirei-bio-icon">🎯</div>
                    <div>
                      <div className="mirei-bio-label">Hobi</div>
                      <div className="mirei-bio-value">{MIREI_DATA.bio.hobby}</div>
                    </div>
                  </div>
                </div>

                <div className="mirei-motto-card">
                  <div className="mirei-motto-icon">💭</div>
                  <div>
                    <div className="mirei-motto-label">Motto Hidup</div>
                    <div className="mirei-motto-text">{MIREI_DATA.bio.motto}</div>
                  </div>
                </div>

                <div className="mirei-personality-badge">
                  <span className="text-sm font-medium" style={{ color: 'var(--t2)' }}>Kepribadian:</span>
                  <span className="mirei-personality-text">{MIREI_DATA.bio.personality}</span>
                </div>
              </div>
            )}

            {/* Background Tab */}
            {activeTab === 'background' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Latar Belakang</h2>
                
                <div className="mirei-story-card">
                  <div className="mirei-story-icon">📚</div>
                  <div>
                    <h3 className="mirei-story-title">Cerita Mirei</h3>
                    <p className="mirei-story-text">{MIREI_DATA.background.story}</p>
                  </div>
                </div>

                <div className="mirei-story-card">
                  <div className="mirei-story-icon">🎯</div>
                  <div>
                    <h3 className="mirei-story-title">Tujuan & Misi</h3>
                    <p className="mirei-story-text">{MIREI_DATA.background.purpose}</p>
                  </div>
                </div>

                <div className="mirei-specialties-card">
                  <h3 className="mirei-specialties-title">
                    <span className="text-xl">⭐</span>
                    Keahlian Khusus
                  </h3>
                  <div className="mirei-specialties-list">
                    {MIREI_DATA.background.specialties.map((specialty, i) => (
                      <div key={i} className="mirei-specialty-item">
                        <div className="mirei-specialty-bullet" />
                        <span>{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Personality Tab */}
            {activeTab === 'personality' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Kepribadian Mirei</h2>
                
                <div className="mirei-traits-grid">
                  {MIREI_DATA.personality.traits.map((trait, i) => (
                    <div 
                      key={i} 
                      className="mirei-trait-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="mirei-trait-icon">{trait.icon}</div>
                      <div className="mirei-trait-title">{trait.title}</div>
                      <div className="mirei-trait-desc">{trait.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mirei-communication-card">
                  <h3 className="mirei-communication-title">
                    <span className="text-xl">💬</span>
                    Gaya Komunikasi
                  </h3>
                  <div className="mirei-communication-list">
                    {MIREI_DATA.personality.communicationStyle.map((style, i) => (
                      <div key={i} className="mirei-communication-item">
                        <div className="mirei-communication-bullet" />
                        <span>{style}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default CharactersPage;
