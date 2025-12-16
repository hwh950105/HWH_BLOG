import axios from 'axios';

// 여러 Yahoo Finance 엔드포인트 시도
const YF_ENDPOINTS = [
  'https://query1.finance.yahoo.com/v7/finance/quote?symbols=',
  'https://query2.finance.yahoo.com/v7/finance/quote?symbols=',
];

const SYMBOLS = {
  NASDAQ: '^IXIC',
  DOW: '^DJI',
  SP500: '^GSPC',
  KOSPI: '^KS11',
  NIKKEI225: '^N225',
  HANGSENG: '^HSI',
  FTSE100: '^FTSE',
  DAX: '^GDAXI'
};

async function fetchIndex(symbolCode) {
  // 여러 엔드포인트 시도
  for (const endpoint of YF_ENDPOINTS) {
    try {
      const { data } = await axios.get(`${endpoint}${symbolCode}`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });
      
      const quote = data?.quoteResponse?.result?.[0];
      if (!quote) continue;
      
      const { regularMarketPrice, previousClose, regularMarketChange, regularMarketChangePercent } = quote;
      
      if (regularMarketPrice && previousClose) {
        return { 
          regularMarketPrice, 
          previousClose,
          change: regularMarketChange || (regularMarketPrice - previousClose),
          changePercent: regularMarketChangePercent || ((regularMarketPrice - previousClose) / previousClose * 100)
        };
      }
    } catch (err) {
      console.error(`Failed with ${endpoint}:`, err.message);
      continue; // 다음 엔드포인트 시도
    }
  }
  
  throw new Error(`All endpoints failed for ${symbolCode}`);
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


