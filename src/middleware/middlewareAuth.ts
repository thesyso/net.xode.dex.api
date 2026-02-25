export default function middlewareAuth(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
  }
  const token = authHeader.split(' ')[1]; // "Bearer <token>" 형식에서 토큰 추출
  if (!token) {
    return res.status(401).json({ success: false, message: '유효한 인증 정보가 없습니다.' });
  } 
  // 토큰 검증 로직 (예: JWT 검증)
  // jwt.verify(token, 'your_secret
  //   (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ success: false, message: '인증 실패: 유효하지 않은 토큰입니다.' });
  //     }
  //     req.user = decoded; // 검증된 사용자 정보 저장
  //     next(); // 다음 미들웨어로 이동
  //   });
  next(); // 임시로 토큰 검증 없이 다음으로 이동
}