import { NextResponse } from 'next/server';

/**
 * INSTAGRAM PROXY ROUTE
 * Fetches data from RapidAPI server-side to bypass CORS and hide API keys.
 * specifically tuned for 'instagram120.p.rapidapi.com'
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY?.trim();
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST_INSTAGRAM?.trim() || 'instagram120.p.rapidapi.com';

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
    console.log(`Fetching Instagram data for [${username}] from host [${RAPIDAPI_HOST}]`);
    
    // As per your curl request, instagram120 requires a POST request
    const url = `https://${RAPIDAPI_HOST}/api/instagram/posts`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        username: username,
        maxId: ""
      })
    });

    // Safely parse to avoid crashing if RapidAPI throws an HTML firewall page
    const rawText = await res.text();
    let data;
    
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error(`Received HTML instead of JSON from ${RAPIDAPI_HOST}! This means the endpoint is blocked by RapidAPI proxy.`);
      return NextResponse.json({ error: 'RapidAPI returned an HTML response' }, { status: 502 });
    }
    
    if (data.message && data.message.includes('not subscribed')) {
       return NextResponse.json({ error: 'RapidAPI subscription required for Instagram endpoint' }, { status: 403 });
    }

    // Structure mapping based specifically on instagram120's 'result.edges' return format
    const postsEdges = data?.result?.edges || [];
    
    // If the account has no posts, we might not get user info easily from this specific endpoint.
    // We try to securely map the first post's owner as the global 'user' object.
    const firstPostNode = postsEdges[0]?.node;
    if (!firstPostNode || !firstPostNode.owner) {
      return NextResponse.json({ error: 'Instagram user not found, private, or has no posts.' }, { status: 404 });
    }
    
    const owner = firstPostNode.owner;

    // Map the recent posts into our dashboard's UI format
    const latestContent = postsEdges.slice(0, 5).map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id || node.code || `ig-post-${Math.random()}`,
        // Grab the best quality image or video thumbnail
        thumbnail: node.image_versions2?.candidates?.[0]?.url || node.display_url || '',
        views: Number(node.view_count || node.play_count || node.like_count || 0),
        title: node.caption?.text || 'Instagram Post',
        link: `https://www.instagram.com/p/${node.code}/`,
        publishedAt: new Date((node.taken_at || Date.now() / 1000) * 1000).toISOString()
      };
    });

    // We sum up the likes/views of the last few posts to display the "Total" metric on the dashboard
    let totalViews = latestContent.reduce((sum: number, item: any) => sum + item.views, 0);
    // Add follower count if the API provided it (instagram120 usually provides it on a different endpoint)
    if (totalViews === 0) totalViews = owner.follower_count || 1;

    return NextResponse.json({
      id: String(owner.pk || owner.id || 'unknown'),
      platform: 'instagram',
      username: owner.username || username,
      displayName: owner.full_name || username,
      // Some APIs return a secure CDN link for profile pics, we ensure it's not null
      profilePic: owner.profile_pic_url || owner.hd_profile_pic_url_info?.url || '',
      totalViews: totalViews,
      latestContent: latestContent,
    });
  } catch (error: any) {
    console.error('Instagram API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to connect to Instagram API', details: error.message }, { status: 500 });
  }
}
