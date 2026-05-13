export const maskAddress = (address: string) => {
  if (address.length <= 10) {
    return address; // 주소가 너무 짧으면 마스킹하지 않음
  }

  const start = address.slice(0, 6); // 앞 6자리
  const end = address.slice(-4); // 뒤 4자리
  return `${start}...${end}`; // 중간은 ...으로 마스킹
};

export const maskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return email; // 로컬 파트가 너무 짧으면 마스킹하지 않음
  }

  const maskedLocalPart = `${localPart[0]}...${localPart[localPart.length - 1]}`;
  return `${maskedLocalPart}@${domain}`;
};
