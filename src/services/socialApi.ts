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
 * REAL API IMPLEMENTATION
 * This service handles real data fetching with fallbacks to mock data.
 * YouTube uses official Google Data API v3. 
 * TikTok & Instagram use an 'Aggregator' simulation pattern common in dev tasks.
 */

const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const socialApiService = {
  async getAccountData(platform: 'tiktok' | 'instagram' | 'youtube', handle: string): Promise<SocialAccount> {
    const username = handle.replace('@', '');
    
    // DELAY FOR "AJAX" FEEL: Simulate real network latencies
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    // --- REAL YOUTUBE INTEGRATION ---
    if (platform === 'youtube' && YOUTUBE_KEY) {
      try {
        // Ensure handle starts with '@' for YouTube's forHandle parameter
        const youtubeHandle = handle.startsWith('@') ? handle : `@${handle}`;
        return await this.fetchRealYouTube(youtubeHandle);
      } catch (err) {
        console.warn('YouTube API failing, falling back to mock...', err);
      }
    }

    // --- MOCK FALLBACK (TikTok, IG, or YT without key) ---
    const base = MOCK_PLATFORMS[platform];
    if (!base) throw new Error('Platform not supported');

    return {
      ...base,
      username,
      displayName: username.split(/[._]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      lastRefreshed: new Date().toISOString()
    };
  },

  async fetchRealYouTube(youtubeHandle: string): Promise<SocialAccount> {
    // 1. Get Channel Data via handle/username
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${youtubeHandle}&key=${YOUTUBE_KEY}`
    );
    const channelData = await channelRes.json();
    
    if (!channelData.items?.[0]) throw new Error('Channel not found');
    const channel = channelData.items[0];

    // 2. Get latest videos from the "Uploads" playlist (cheaper quota than Search)
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=5&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_KEY}`
    );
    const videosData = await videosRes.json();
    const videoIds = videosData.items.map((v: any) => v.contentDetails.videoId).join(',');

    // 3. Get exact views for those 5 videos
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_KEY}`
    );
    const statsData = await statsRes.json();

    return {
      id: channel.id,
      platform: 'youtube',
      username: youtubeHandle.replace('@', ''),
      displayName: channel.snippet.title,
      profilePic: channel.snippet.thumbnails.medium.url,
      totalViews: parseInt(channel.statistics.viewCount),
      lastRefreshed: new Date().toISOString(),
      latestContent: videosData.items.map((item: any, i: number) => ({
        id: item.contentDetails.videoId,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        views: parseInt(statsData.items[i]?.statistics?.viewCount || '0'),
        title: item.snippet.title,
        link: `https://youtube.com/watch?v=${item.contentDetails.videoId}`,
        publishedAt: item.snippet.publishedAt
      }))
    };
  }
};
