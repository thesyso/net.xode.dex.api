import crypto from 'crypto';

const randomCryptoString = (length: number): string => {
    // 원하는 길이의 랜덤 바이트를 생성하고, 이를 hexadecimal로 변환
    const randomBytes = crypto.randomBytes(length);
    return randomBytes.toString('hex');
};

const randomString = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

export { randomCryptoString, randomString };