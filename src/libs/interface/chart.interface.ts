interface SwapCandle1m {
  /** 토큰 페어(Pool) 주소 */
  pairAddress: string;
  
  /** '분' 단위로 정형화된 시간 (MongoDB의 ISODate) */
  timestamp: Date;
  
  /** 시작가 */
  open: number;
  
  /** 최고가 */
  high: number;
  
  /** 최저가 */
  low: number;
  
  /** 종가 (현재가) */
  close: number;
  
  /** 해당 1분간의 스왑 거래량 */
  volume: number;
}