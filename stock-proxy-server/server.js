const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// 나스닥 데이터
app.get("/api/nasdaq", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching NASDAQ data");
  }
});

app.get("/api/nasdaq2", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC"
    );
    const { regularMarketPrice, previousClose } =
      response.data.chart.result[0].meta;
    res.json({ regularMarketPrice, previousClose });
  } catch (error) {
    res.status(500).json({ error: "Error fetching NASDAQ data" });
  }
});

// 다우존스 데이터
app.get("/api/dow", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching DOW data");
  }
});

app.get("/api/dow2", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC"
    );
    const { regularMarketPrice, previousClose } =
      response.data.chart.result[0].meta;
    res.json({ regularMarketPrice, previousClose });
  } catch (error) {
    res.status(500).json({ error: "Error fetching DOW data" });
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log("Proxy server running on http://localhost:3000");
});
