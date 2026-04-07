import { NextResponse } from 'next/server';

/**
 * TIKTOK PROXY ROUTE
 * Fetches data from RapidAPI server-side to bypass CORS and hide API keys.
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY?.trim();
const RAPIDAPI_HOST = 'tiktok-api23.p.rapidapi.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  if (!RAPIDAPI_KEY) {
    return NextResponse.json({ error: 'RapidAPI Key not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch User Info
    console.log(`Fetching TikTok User Info for: ${username}`);
    const infoRes = await fetch(`https://${RAPIDAPI_HOST}/api/user/info?uniqueId=${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    const infoData = await infoRes.json();
    
    // Handle RapidAPI errors early
    if (infoData.message && infoData.message.includes('not subscribed')) {
       return NextResponse.json({ error: 'RapidAPI subscription required' }, { status: 403 });
    }

    const user = infoData.userInfo?.user || infoData.user || infoData;
    const stats = infoData.userInfo?.stats || infoData.stats || infoData.statistics || user.stats || {};
    const secUid = user.secUid || user.sec_uid;

    if (!user || (!user.uniqueId && !user.unique_id)) {
      return NextResponse.json({ error: 'TikTok user not found', debug: infoData }, { status: 404 });
    }

    // 2. Fetch Latest Posts if secUid exists
    let latestContent: any[] = [];
    if (secUid) {
      try {
        console.log(`Fetching TikTok Posts for secUid: ${secUid}`);
        const postsRes = await fetch(`https://${RAPIDAPI_HOST}/api/user/posts?secUid=${secUid}&count=5&cursor=0`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
          },
        });
        const postsData = await postsRes.json();
        
        // Debug post structure: tiktok-api23 sometimes uses 'itemList' or 'aweme_list' or 'data.posts'
        console.log('TikTok Posts Data (keys):', postsData ? Object.keys(postsData) : 'null/undefined');
        const posts = postsData?.itemList || 
                      postsData?.posts || 
                      postsData?.aweme_list || 
                      postsData?.items || 
                      postsData?.data?.posts || 
                      postsData?.data?.itemList || 
                      [];
        
        latestContent = (Array.isArray(posts) ? posts : []).slice(0, 5).map((item: any) => {
          // Video stats mapping: tiktok-api23 uses stats.playCount or statistics.play_count
          const vStats = item?.stats || item?.statistics || {};
          const vCover = item?.video?.cover || item?.video?.dynamic_cover || item?.video?.origin_cover || '';

          return {
            id: item?.id || item?.aweme_id || `tt-v-${Math.random()}`,
            thumbnail: vCover,
            views: Number(vStats?.playCount || vStats?.play_count || 0),
            title: item?.desc || item?.title || 'TikTok Video',
            link: item?.id ? `https://www.tiktok.com/@${username}/video/${item.id}` : '#',
            publishedAt: item?.createTime ? new Date(item.createTime * 1000).toISOString() : new Date().toISOString()
          };
        });
      } catch (postErr) {
        console.warn('Failed to fetch TikTok posts:', postErr);
      }
    }

    // Calculate total views: Sum of latest video views is often better than account likes
    let calculatedViews = Number(stats?.playCount || stats?.videoViews || 0);
    if (calculatedViews === 0 && latestContent.length > 0) {
      calculatedViews = latestContent.reduce((sum, item) => sum + (item.views || 0), 0);
    }
    
    // Last fallback to heartCount if we literally have no view data
    if (calculatedViews === 0) {
      calculatedViews = Number(stats?.heartCount || stats?.followerCount || 0);
    }

    // Return final mapped data
    return NextResponse.json({
      id: String(user?.id || user?.uid || 'unknown'),
      platform: 'tiktok',
      username: user?.uniqueId || user?.unique_id || username,
      displayName: user?.nickname || user?.nickName || user?.uniqueId || username,
      profilePic: user?.avatarLarger || user?.avatarMedium || user?.avatarThumb || user?.avatar_larger || '',
      totalViews: calculatedViews,
      latestContent: latestContent,
    });
  } catch (error: any) {
    console.error('TikTok API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to connect to TikTok API', details: error.message }, { status: 500 });
  }
}
