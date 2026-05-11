import crypto from "crypto";

// use aes key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (64 characters)
const IV_LENGTH = 16; // For AES, this is always 16

const csEnCryptoAES256 = (text: string): string => {
  try {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
      console.error("Encryption key must be 64 hex characters (32 bytes).");
      return "";
    }

    const iv = crypto.randomBytes(IV_LENGTH);

    // 핵심: 'hex' 인코딩을 명시하여 64자 문자열을 32바이트 버퍼로 변환
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, 'hex'), 
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (e) {
    console.error("Encryption error:", e);
    return "";
  }
};

const csDeCryptoAES256 = (text: string): string => {
  try {
    // 1. 키 검증 (64자 Hex 확인)
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
      console.error("Encryption key must be 64 hex characters.");
      return "";
    }

    // 2. IV와 암호문 분리
    const textParts = text.split(":");
    const ivHex = textParts.shift(); // 첫 번째 파트가 IV
    const encryptedHex = textParts.join(":"); // 나머지가 암호문

    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted text format.");
    }

    // 3. 복호화 도구(Decipher) 생성
    // 암호화와 동일하게 키는 'hex'로, IV도 'hex'에서 Buffer로 변환
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );

    // 4. 복호화 진행 (Hex 문자열 -> UTF-8 평문)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (e) {
    console.error("Decryption error:", e);
    return ""; // 복호화 실패 시 빈 문자열 반환
  }
};

// const csDeCryptAES256 = (text: string) => {
//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift()!, 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!), iv);
//     let decrypted = decipher.update(encryptedText);

//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     return decrypted.toString();
// }

const csEnCryptSHA512 = (text: string, salt: string) => {
  try {
    const hash = crypto.createHash("sha512");
    hash.update(text + salt);
    const hashPassword = hash.digest("hex");

    return { errCode: 0, cryptoCode: hashPassword };
  } catch (e) {
    return { errCode: -99, cryptoCode: "" };
  }
};

export { csEnCryptoAES256, csDeCryptoAES256, csEnCryptSHA512 };

