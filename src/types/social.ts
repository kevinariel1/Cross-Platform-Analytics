export interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  username: string;
  displayName: string;
  profilePic: string;
  totalViews: number;
  latestContent: ContentItem[];
  lastRefreshed: string;
}

export interface ContentItem {
  id: string;
  thumbnail: string;
  views: number;
  title?: string;
  link: string;
  publishedAt: string;
}

export interface AccountStats {
  tiktok?: SocialAccount;
  instagram?: SocialAccount;
  youtube?: SocialAccount;
}
