import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
});

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

    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}