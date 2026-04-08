import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
});

function formatDate(yyyymmdd: string) {
  return `${yyyymmdd.slice(0,4)}-${yyyymmdd.slice(4,6)}-${yyyymmdd.slice(6,8)}`;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      dimensions: [{ name: 'date' }],
    });

    const rows = response.rows || [];

    const daily = rows.map(r => ({
      date: formatDate(r.dimensionValues?.[0]?.value || ''),
      visitors: Number(r.metricValues?.[0]?.value || 0),
      sessions: Number(r.metricValues?.[1]?.value || 0),
      pageViews: Number(r.metricValues?.[2]?.value || 0),
    }));

    const global = {
      activeUsers: daily.reduce((sum, d) => sum + d.visitors, 0),
      sessions: daily.reduce((sum, d) => sum + d.sessions, 0),
      pageViews: daily.reduce((sum, d) => sum + d.pageViews, 0),
    };

    res.status(200).json({
      daily,
      global,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}