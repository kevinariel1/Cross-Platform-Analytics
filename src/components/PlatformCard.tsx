'use client';

import React from 'react';
import { SocialAccount } from '../types/social';
import { Eye, Clock, TrendingUp, Instagram, Youtube, Video } from 'lucide-react';

interface PlatformCardProps {
  account: SocialAccount;
  isLoading?: boolean;
}

/**
 * PlatformCard Component
 * Wrapped in React.memo(): This is a performance best-practice. It tells React to 
 * ONLY re-render this card if the 'account' or 'isLoading' props actually change.
 * This makes the dashboard lighter and much more efficient when typing in the search boxes.
 */
const PlatformCard = React.memo(function PlatformCard({ account, isLoading }: PlatformCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getPlatformIcon = () => {
    switch (account.platform) {
      case 'tiktok': return <Video className="icon-tiktok" size={20} />;
      case 'instagram': return <Instagram className="icon-ig" size={20} />;
      case 'youtube': return <Youtube className="icon-yt" size={20} />;
      default: return null;
    }
  };

  const getAccentColor = () => {
    switch (account.platform) {
      case 'tiktok': return 'var(--tiktok-cyan)';
      case 'instagram': return 'var(--accent-pink)';
      case 'youtube': return 'var(--youtube-red)';
      default: return 'var(--accent-blue)';
    }
  };

  return (
    <div className={`platform-card glass ${isLoading ? 'loading' : ''}`}>
      <div className="card-header">
        <div className="user-profile">
          <img src={account.profilePic} alt={account.displayName} className="profile-img" loading="lazy" />
          <div className="user-info">
            <h3>{account.displayName}</h3>
            <p className="username">@{account.username}</p>
          </div>
        </div>
        <div className="platform-tag">
          {getPlatformIcon()}
          <span className="last-refresh">
            Last: {new Date(account.lastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="stats-main">
        <div className="stat-box">
          <div className="stat-label">
            <Eye size={14} />
            Total Views
          </div>
          <div className="stat-value" style={{ color: getAccentColor() }}>
            {formatNumber(account.totalViews)}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">
            <TrendingUp size={14} />
            Avg. Views
          </div>
          <div className="stat-value">
            {formatNumber(account.latestContent.length > 0 ? account.totalViews / account.latestContent.length : 0)}
          </div>
        </div>
      </div>

      <div className="content-list">
        <h4>Latest Content</h4>
        {account.latestContent.map((item) => (
          <div key={item.id} className="content-item">
            <div className="content-thumbnail">
              <img src={item.thumbnail} alt={item.title || 'Post'} loading="lazy" />
              <div className="content-views">
                <Eye size={10} />
                {formatNumber(item.views)}
              </div>
            </div>
            <div className="content-details">
              <p className="content-title">{item.title || 'Social Media Post'}</p>
              <p className="content-date">
                <Clock size={10} />
                {new Date(item.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .platform-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: var(--transition-smooth);
          position: relative;
        }

        .platform-card:hover {
          transform: translateY(-5px);
          border-color: var(--text-muted);
        }

        .platform-card.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .user-profile {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .profile-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--bg-accent);
        }

        .user-info h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        .platform-tag {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        
        .last-refresh {
          font-size: 0.6rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .username {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .stats-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }

        .content-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .content-list h4 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .content-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          transition: var(--transition-smooth);
        }

        .content-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .content-thumbnail {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .content-thumbnail img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          object-fit: cover;
        }

        .content-views {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 0.65rem;
          padding: 1px 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .content-details {
          flex: 1;
          min-width: 0;
        }

        .content-title {
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .content-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .icon-yt { color: var(--youtube-red); }
        .icon-ig { color: var(--accent-pink); }
        .icon-tiktok { color: var(--tiktok-cyan); }
      `}</style>
    </div>
  );
});

export default PlatformCard;
