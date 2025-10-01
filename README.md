# HWH BLOG

Vue 3 + Vite로 구축된 개인 블로그 웹사이트

## 🚀 주요 기능

- **📝 블로그**: Vue-Notion을 통한 노트 렌더링
- **📊 주식 지수**: 실시간 주요 지수 정보 (NASDAQ, DOW, S&P500 등)
- **🪙 암호화폐**: 코인 시세 정보
- **🚀 프로젝트 쇼케이스**: 개발 프로젝트 소개

## 🛠️ 기술 스택

- **Frontend**: Vue 3, Vite, Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router
- **Charts**: Chart.js
- **API**: Vercel Serverless Functions
- **Deployment**: Vercel

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 🌐 배포

이 프로젝트는 Vercel에 최적화되어 있습니다.

```bash
# Vercel CLI로 배포
vercel
```

또는 GitHub 연동으로 자동 배포가 가능합니다.

## 📁 프로젝트 구조

```
├── api/                 # Vercel Serverless Functions
├── src/
│   ├── components/      # Vue 컴포넌트
│   ├── views/           # 페이지 컴포넌트
│   ├── stores/          # Pinia 스토어
│   └── router/          # 라우터 설정
├── public/              # 정적 파일
└── vercel.json          # Vercel 설정
```

## 🔧 API 엔드포인트

- `/api/indices` - 주식 지수 데이터
- `/api/nasdaq2` - 나스닥 상세 데이터
- `/api/dow2` - 다우존스 상세 데이터

## 📄 라이선스

MIT License