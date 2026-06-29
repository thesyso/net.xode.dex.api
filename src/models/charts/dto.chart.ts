export interface IDXCharts {
  chain: string;
  interval: string; // '1m', '5m', '15m', '30m', '1h', '4h', '1d'
  pairKey: string; // 'BTC/USDT', 'ETH/USDT', 'XRP/USDT', ...
  baseAssetId: string; // 'BTC', 'ETH', 'XRP', ...
  quoteAssetId: string; // 'USDT', 'BTC', 'ETH', ...
  bucketTime: Date; // '분' 단위로 정규화된 시간 (초, 밀리초는 00.000)
  open: number;
  high: number;
  low: number;
  close: number;
  volumeBase: number;
  volumeQuote: number;
  tradeCount: number;
  createdAt: Date;
  updatedAt: Date;
}