import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      'https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC'
    );
    const { regularMarketPrice, previousClose } =
      response.data.chart.result[0].meta;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ regularMarketPrice, previousClose });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching NASDAQ data' });
  }
}


