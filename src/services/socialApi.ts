import { SocialAccount, ContentItem } from '../types/social';

// Mock data for demonstration
const MOCK_PLATFORMS: Record<string, SocialAccount> = {
  youtube: {
    id: 'yt-1',
    platform: 'youtube',
    username: 'CodingChannel',
    displayName: 'Code with Kevin',
    profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    totalViews: 1250000,
    latestContent: Array.from({ length: 5 }).map((_, i) => ({
      id: `yt-v-${i}`,
      thumbnail: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=120&fit=crop&q=${i}`,
      views: 15000 + (Math.random() * 50000),
      title: `Next.js Masterclass Part ${5 - i}`,
      link: '#',
      publishedAt: new Date(Date.now() - i * 86400000).toISOString()
    })),
    lastRefreshed: new Date().toISOString()
  },
  instagram: {
    id: 'ig-1',
    platform: 'instagram',
    username: 'kevin.dev',
    displayName: 'Kevin Ariel',
    profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    totalViews: 450000,
    latestContent: Array.from({ length: 5 }).map((_, i) => ({
      id: `ig-p-${i}`,
      thumbnail: `https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=200&h=200&fit=crop&q=${i}`,
      views: 5000 + (Math.random() * 20000),
      link: '#',
      publishedAt: new Date(Date.now() - i * 172800000).toISOString()
    })),
    lastRefreshed: new Date().toISOString()
  },
  tiktok: {
    id: 'tt-1',
    platform: 'tiktok',
    username: 'kevin_codes',
    displayName: 'Kevin Codes',
    profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
    totalViews: 3200000,
    latestContent: Array.from({ length: 5 }).map((_, i) => ({
      id: `tt-v-${i}`,
      thumbnail: `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=300&fit=crop&q=${i}`,
      views: 120000 + (Math.random() * 400000),
      link: '#',
      publishedAt: new Date(Date.now() - i * 43200000).toISOString()
    })),
    lastRefreshed: new Date().toISOString()
  }
};

/**
 * Service to fetch social media data.
 * 
 * [PROBLEM SOLVING]: To overcome platform API limitations (CORS and Auth),
 * this service uses a Unified Interface pattern. In a production environment,
 * you would replace the logic below with:
 * 1. Official YouTube Data API v3 (Accessible via Google Cloud)
 * 2. RapidAPI (TikTok / Instagram Scraper APIs) which bypass platform blocks.
 * 3. Next.js API Routes to proxy requests and keep API keys secure.
 */
export const socialApiService = {
  async getAccountData(platform: 'tiktok' | 'instagram' | 'youtube', username: string): Promise<SocialAccount> {
    // Simulate real network delay/bottleneck
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

    const base = MOCK_PLATFORMS[platform];
    if (!base) throw new Error('Platform not supported');

    return {
      ...base,
      username: username.replace('@', ''),
      displayName: username.split(/[._]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      lastRefreshed: new Date().toISOString()
    };
  }
};
