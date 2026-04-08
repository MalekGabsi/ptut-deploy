import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
});

const property = `properties/${process.env.GA4_PROPERTY_ID}`;

function formatDate(d: string) {
  return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {

    const dateRange = [{ startDate: '30daysAgo', endDate: 'today' }];

    // ───────────── 1. TRAFIC GLOBAL ─────────────
    const [traffic] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    });

    const daily = (traffic.rows || []).map(r => ({
      date: formatDate(r.dimensionValues?.[0]?.value || ''),
      visitors: Number(r.metricValues?.[0]?.value || 0),
      sessions: Number(r.metricValues?.[1]?.value || 0),
      pageViews: Number(r.metricValues?.[2]?.value || 0),
    }));

    const global = {
      activeUsers: daily.reduce((a,b)=>a+b.visitors,0),
      sessions: daily.reduce((a,b)=>a+b.sessions,0),
      pageViews: daily.reduce((a,b)=>a+b.pageViews,0),
    };

    // ───────────── 2. PAGES ─────────────
    const [pagesRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });

    const pages = (pagesRes.rows || []).map(r => ({
      path: r.dimensionValues?.[0]?.value,
      views: Number(r.metricValues?.[0]?.value || 0),
      users: Number(r.metricValues?.[1]?.value || 0),
      bounceRate: Number(r.metricValues?.[2]?.value || 0).toFixed(1),
      avgDuration: Number(r.metricValues?.[3]?.value || 0).toFixed(1),
    }));

    // ───────────── 3. PAYS ─────────────
    const [geoRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const geo = (geoRes.rows || []).map(r => ({
      country: r.dimensionValues?.[0]?.value,
      users: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── 4. VILLES ─────────────
    const [cityRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const cities = (cityRes.rows || []).map(r => ({
      city: r.dimensionValues?.[0]?.value,
      users: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── 5. DEVICES ─────────────
    const [deviceRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const devices = (deviceRes.rows || []).map(r => ({
      device: r.dimensionValues?.[0]?.value,
      users: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── 6. NAVIGATEURS ─────────────
    const [browserRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'sessions' }],
    });

    const browsers = (browserRes.rows || []).map(r => ({
      browser: r.dimensionValues?.[0]?.value,
      sessions: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── 7. SOURCES ─────────────
    const [sourceRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    });

    const sources = (sourceRes.rows || []).map(r => ({
      channel: r.dimensionValues?.[0]?.value,
      sessions: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── 8. EVENTS ─────────────
    const [eventRes] = await client.runReport({
      property,
      dateRanges: dateRange,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });

    const events = (eventRes.rows || []).map(r => ({
      event: r.dimensionValues?.[0]?.value,
      count: Number(r.metricValues?.[0]?.value || 0),
    }));

    // ───────────── RESPONSE FINAL ─────────────
    res.status(200).json({
      daily,
      global,
      pages,
      geo,
      cities,
      devices,
      browsers,
      sources,
      events,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
}