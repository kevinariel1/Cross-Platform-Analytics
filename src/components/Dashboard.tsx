'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, LayoutDashboard, Instagram, Youtube, Video, Search } from 'lucide-react';
import { SocialAccount } from '../types/social';
import { socialApiService } from '../services/socialApi';
import PlatformCard from './PlatformCard';

export default function Dashboard() {
  const [usernames, setUsernames] = useState({
    tiktok: '',
    instagram: '',
    youtube: ''
  });
  
  const [accounts, setAccounts] = useState<{ [key: string]: SocialAccount | null }>({
    tiktok: null,
    instagram: null,
    youtube: null
  });

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    tiktok: false,
    instagram: false,
    youtube: false
  });

  const fetchPlatformData = async (platform: 'tiktok' | 'instagram' | 'youtube') => {
    if (!usernames[platform]) return;
    
    setLoading(prev => ({ ...prev, [platform]: true }));
    try {
      const data = await socialApiService.getAccountData(platform, usernames[platform]);
      setAccounts(prev => ({ ...prev, [platform]: data }));
    } catch (error) {
      console.error(`Error fetching ${platform} data:`, error);
      alert(`Could not find ${platform} account: ${usernames[platform]}`);
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const refreshAll = () => {
    (Object.keys(usernames) as Array<keyof typeof usernames>).forEach(platform => {
      if (usernames[platform]) {
        fetchPlatformData(platform);
      }
    });
  };

  return (
    <main className="dashboard-container">
      <header className="dashboard-header glass">
        <div className="header-left">
          <LayoutDashboard className="icon-blue" size={24} />
          <h1>View<span className="accent-blue">Tracker</span></h1>
        </div>
        
        <div className="header-right">
          <button 
            className="refresh-btn glass" 
            onClick={refreshAll}
            disabled={Object.values(loading).some(l => l)}
          >
            <RefreshCw className={Object.values(loading).some(l => l) ? 'spin' : ''} size={18} />
            Refresh All
          </button>
        </div>
      </header>

      <div className="input-grid">
        {(['tiktok', 'instagram', 'youtube'] as const).map((platform) => (
          <div key={platform} className="input-group glass">
            <div className="input-icon">
              {platform === 'tiktok' && <Video size={18} className="icon-tiktok" />}
              {platform === 'instagram' && <Instagram size={18} className="icon-ig" />}
              {platform === 'youtube' && <Youtube size={18} className="icon-yt" />}
            </div>
            <input 
              type="text" 
              placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} handle...`}
              value={usernames[platform]}
              onChange={(e) => setUsernames(prev => ({ ...prev, [platform]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && fetchPlatformData(platform)}
            />
            <button 
              className="search-btn"
              onClick={() => fetchPlatformData(platform)}
              disabled={loading[platform]}
            >
              {loading[platform] ? <RefreshCw className="spin" size={16} /> : <Search size={16} />}
            </button>
          </div>
        ))}
      </div>

      <div className="cards-grid">
        <AnimatePresence mode="popLayout">
          {(['tiktok', 'instagram', 'youtube'] as const).map((platform) => (
            accounts[platform] && (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <PlatformCard 
                  account={accounts[platform]!} 
                  isLoading={loading[platform]} 
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {!accounts.tiktok && !accounts.instagram && !accounts.youtube && (
          <div className="empty-state glass">
          <p>No accounts tracked yet. Enter usernames above to start monitoring views.</p>
        </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          margin-bottom: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .accent-blue {
          color: var(--accent-blue);
        }

        .icon-blue {
          color: var(--accent-blue);
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 1.2rem;
          border: none;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          gap: 12px;
        }

        .input-group input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 0.5rem 0;
          font-size: 0.95rem;
          outline: none;
        }

        .input-group input::placeholder {
          color: var(--text-muted);
        }

        .search-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .search-btn:hover {
          color: #fff;
          transform: scale(1.1);
        }

        .icon-yt { color: var(--youtube-red); }
        .icon-ig { color: var(--accent-pink); }
        .icon-tiktok { color: var(--tiktok-cyan); }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .input-grid {
            grid-template-columns: 1fr;
          }
          
          .cards-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
