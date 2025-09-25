# Notion 기능 제거 가이드

현재 블로그에서 Notion 기능을 제거하려면 다음 작업이 필요합니다:

## 제거할 파일들
- `src/views/Notionlist.vue` (전체 파일)
- `src/views/Note.vue` (전체 파일)

## 수정할 파일들

### 1. src/router/index.js
```javascript
// 제거할 라우트들
{
  path: '/Note/:id',
  name: 'Note',
  component: () => import('../views/Note.vue')
},
{
  path: '/Notionlist',
  name: 'Notionlist',
  component: () => import('../views/Notionlist.vue')
}
```

### 2. src/App.vue
```vue
<!-- 제거할 네비게이션 링크 -->
<router-link to="/Notionlist" class="nav-link">🗊 Note</router-link>
```

### 3. package.json
```json
// dependencies에서 제거
"vue-notion": "^3.0.0"
```

## 제거 명령어
```bash
npm uninstall vue-notion
```

**⚠️ 주의**: 제거 시 블로그의 핵심 기능인 노트 시스템이 사라집니다.