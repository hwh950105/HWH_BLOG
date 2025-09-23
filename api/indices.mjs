import axios from 'axios';

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

const SYMBOLS = {
  NASDAQ: '%5EIXIC',
  DOW: '%5EDJI',
  SP500: '%5EGSPC',
  KOSPI: '%5EKS11',
  NIKKEI225: '%5EN225',
  HANGSENG: '%5EHSI',
  FTSE100: '%5EFTSE',
  DAX: '%5EGDAXI'
};

async function fetchIndex(symbolCode) {
  const { data } = await axios.get(`${YF_BASE}${symbolCode}?region=US&lang=en-US`);
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('Invalid Yahoo Finance response');
  const { regularMarketPrice, previousClose } = meta;
  return { regularMarketPrice, previousClose };
}

export default async function handler(req, res) {
  try {
    const settled = await Promise.allSettled(
      Object.entries(SYMBOLS).map(async ([key, code]) => {
        const item = await fetchIndex(code);
        return [key, item];
      })
    );

    const payload = {};
    for (const r of settled) {
      if (r.status === 'fulfilled') {
        const [key, value] = r.value;
        payload[key] = value;
      }
    }

    // If nothing succeeded, return 502 so client can fall back
    if (Object.keys(payload).length === 0) {
      return res.status(502).json({ error: 'All index fetches failed' });
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch indices' });
  }
}


