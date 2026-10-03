const CHANNEL_ID = 'UCJ0oQqTY9FHrXE2HtLHHsew';
const CHANNEL_HANDLE = '@gabriellanemeth4897';
const CHANNEL_URL = `https://www.youtube.com/${CHANNEL_HANDLE}`;
const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Statikus tartalék lista (ha a külső YouTube hálózat épp nem elérhető)
const FALLBACK_VIDEOS = [
  {
    id: 'MAKXalKZrGk',
    title: 'Mondjatok le...',
    published: '2024-06-20T06:03:37+00:00',
    description: 'Németh Gabriella természetgyógyász, lélekalkotás kísérő előadása.',
    url: 'https://www.youtube.com/watch?v=MAKXalKZrGk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/MAKXalKZrGk',
    thumbnailUrl: 'https://img.youtube.com/vi/MAKXalKZrGk/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/MAKXalKZrGk/maxresdefault.jpg'
  },
  {
    id: 'PSA9kBgvfNo',
    title: '3. Gyorssegély a mindennapi élethez',
    published: '2024-06-19T16:42:55+00:00',
    description: 'Praktikus tanácsok és energetikai segítség a mindennapokra.',
    url: 'https://www.youtube.com/watch?v=PSA9kBgvfNo',
    embedUrl: 'https://www.youtube-nocookie.com/embed/PSA9kBgvfNo',
    thumbnailUrl: 'https://img.youtube.com/vi/PSA9kBgvfNo/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/PSA9kBgvfNo/maxresdefault.jpg'
  },
  {
    id: 'HBIZUsoUrN8',
    title: '2. Gyorssegély a mindennapi élethez',
    published: '2024-06-19T16:42:05+00:00',
    description: 'Gyakorlati útmutató a belső harmónia és egyensúly megőrzéséhez.',
    url: 'https://www.youtube.com/watch?v=HBIZUsoUrN8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/HBIZUsoUrN8',
    thumbnailUrl: 'https://img.youtube.com/vi/HBIZUsoUrN8/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/HBIZUsoUrN8/maxresdefault.jpg'
  },
  {
    id: 'ePOk6yLond4',
    title: '1. Mostani nehéz idők segítésére',
    published: '2024-06-19T16:41:04+00:00',
    description: 'Megnyugtató és támogató gondolatok a nehézségek kezelésére.',
    url: 'https://www.youtube.com/watch?v=ePOk6yLond4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ePOk6yLond4',
    thumbnailUrl: 'https://img.youtube.com/vi/ePOk6yLond4/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/ePOk6yLond4/maxresdefault.jpg'
  },
  {
    id: 'T2mp69zrj4U',
    title: 'Merj szabadon élni!',
    published: '2024-05-10T12:00:00+00:00',
    description: 'Hogyan engedd el a korlátozó mintákat és élj teljes szabadságban.',
    url: 'https://www.youtube.com/watch?v=T2mp69zrj4U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/T2mp69zrj4U',
    thumbnailUrl: 'https://img.youtube.com/vi/T2mp69zrj4U/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/T2mp69zrj4U/maxresdefault.jpg'
  },
  {
    id: '2Oj4mg0TtOU',
    title: 'A háborút kint vagy bent éled meg...?!',
    published: '2024-04-15T12:00:00+00:00',
    description: 'Belső béke és egyensúly megteremtése a külvilág zajában.',
    url: 'https://www.youtube.com/watch?v=2Oj4mg0TtOU',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2Oj4mg0TtOU',
    thumbnailUrl: 'https://img.youtube.com/vi/2Oj4mg0TtOU/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/2Oj4mg0TtOU/maxresdefault.jpg'
  },
  {
    id: 'WI4Ag8RHPZ0',
    title: 'A SZÍV-TÉR',
    published: '2023-11-20T10:00:00+00:00',
    description: 'Kapcsolódás a szív szakrális teréhez és az öngyógyító energiákhoz.',
    url: 'https://www.youtube.com/watch?v=WI4Ag8RHPZ0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/WI4Ag8RHPZ0',
    thumbnailUrl: 'https://img.youtube.com/vi/WI4Ag8RHPZ0/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/WI4Ag8RHPZ0/maxresdefault.jpg'
  },
  {
    id: 'yZ0SkNxBB-s',
    title: 'A TEREMTŐI-TÉR',
    published: '2023-10-15T10:00:00+00:00',
    description: 'Teremtő erőnk és a belső Forrás aktiválása.',
    url: 'https://www.youtube.com/watch?v=yZ0SkNxBB-s',
    embedUrl: 'https://www.youtube-nocookie.com/embed/yZ0SkNxBB-s',
    thumbnailUrl: 'https://img.youtube.com/vi/yZ0SkNxBB-s/hqdefault.jpg',
    maxThumbnailUrl: 'https://img.youtube.com/vi/yZ0SkNxBB-s/maxresdefault.jpg'
  }
];

let cacheData = null;
let cacheTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 perc cache

function decodeXmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseFeedXml(xmlText) {
  const entries = [];
  const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  for (const entry of entryMatches) {
    const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);

    const videoId = videoIdMatch ? videoIdMatch[1].trim() : null;
    const rawTitle = titleMatch ? titleMatch[1].trim() : null;
    const published = publishedMatch ? publishedMatch[1].trim() : null;
    const desc = descMatch ? descMatch[1].trim() : '';

    if (videoId && rawTitle) {
      entries.push({
        id: videoId,
        title: decodeXmlEntities(rawTitle),
        published: published,
        description: decodeXmlEntities(desc),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        maxThumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });
    }
  }

  return entries;
}

exports.getVideos = async (req, res) => {
  const now = Date.now();

  // Ha a gyorsítótár érvényes, adjuk vissza azonnal
  if (cacheData && now - cacheTime < CACHE_TTL_MS) {
    return res.json(cacheData);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 mp timeout

    const response = await fetch(RSS_FEED_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`YouTube RSS válasz státuszkód: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsedVideos = parseFeedXml(xmlText);

    const result = {
      channel: {
        id: CHANNEL_ID,
        title: 'Németh Gabriella',
        handle: CHANNEL_HANDLE,
        url: CHANNEL_URL,
        subscribeUrl: `${CHANNEL_URL}?sub_confirmation=1`
      },
      videos: parsedVideos.length > 0 ? parsedVideos : FALLBACK_VIDEOS,
      updatedAt: new Date().toISOString()
    };

    cacheData = result;
    cacheTime = now;

    res.json(result);
  } catch (error) {
    console.warn('YouTube RSS lekérés hiba, fallback adatok használata:', error.message);

    const fallbackResult = {
      channel: {
        id: CHANNEL_ID,
        title: 'Németh Gabriella',
        handle: CHANNEL_HANDLE,
        url: CHANNEL_URL,
        subscribeUrl: `${CHANNEL_URL}?sub_confirmation=1`
      },
      videos: cacheData ? cacheData.videos : FALLBACK_VIDEOS,
      updatedAt: new Date().toISOString(),
      fromFallback: true
    };

    res.json(fallbackResult);
  }
};
