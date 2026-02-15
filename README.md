# 나간 돈 관리 대시보드

토스(Toss) 스타일의 깔끔한 UI와 Firebase Firestore 실시간 동기화를 결합한 개인 나간 돈 관리 대시보드입니다.

## 기술 스택

- **Frontend**: React 18 + Vite + Tailwind CSS
- **DB/실시간**: Firebase Firestore
- **아이콘**: Lucide React

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 설정 (데이터 만들기)

**자세한 단계는 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) 참고.**

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. **Firestore Database** 생성 (테스트 모드로 시작 가능)
3. 프로젝트 설정 → 일반 → 앱 추가 → 웹(</>) 선택 후 설정값 복사
4. 프로젝트 루트에 `.env` 파일 생성 후 `.env.example` 참고해 아래 변수 입력:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. (선택) 샘플 데이터 넣기

```bash
npm run seed
```

Firestore `transactions` 컬렉션에 샘플 내역이 추가됩니다.

### 4. Firestore 인덱스 (선택)

목록을 `createdAt` 기준 내림차순으로 보려면 복합 인덱스가 필요할 수 있습니다.  
첫 실행 시 콘솔에 표시되는 인덱스 생성 링크를 클릭해 생성하면 됩니다.

### 5. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 사용 방법

하단에서 **카테고리**(선택 박스), **내용**, **금액**을 입력한 뒤 **입력** 버튼을 누릅니다.  
금액에 `-`를 붙이면 지출(minus), 없으면 수입(plus)으로 저장됩니다.

## 데이터 구조 (Firestore)

`transactions` 컬렉션:

| 필드       | 타입   | 설명        |
|-----------|--------|-------------|
| category  | string | 카테고리명  |
| content   | string | 내용        |
| amount    | number | 금액 (음수 가능) |
| type      | string | `plus` / `minus` |
| createdAt | timestamp | 서버 시각 |

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run preview` — 빌드 결과 미리보기
- `npm run deploy` — 빌드 후 Firebase Hosting 배포 (Firebase CLI 필요)

## GitHub Pages로 사이트 띄우기 (main 푸시 시 자동 배포)

**`GET .../src/main.jsx 404`** 가 나오면, Pages가 **main 브랜치(소스)** 를 서빙하고 있는 상태입니다.  
→ **Settings → Pages** 에서 **Branch를 gh-pages 로** 바꾸고, 접속 주소는 반드시 **https://yeongwoo-seo.github.io/finance/** (끝에 `/finance/`) 로 열어야 합니다.  
자세한 확인 절차는 [docs/GITHUB_PAGES_404_FIX.md](docs/GITHUB_PAGES_404_FIX.md) 를 보세요.

### 1. 저장소 시크릿 추가 (한 번만)

GitHub 저장소 **Settings → Secrets and variables → Actions** 에서 **New repository secret** 로 아래 7개 추가:

| Name | Value (로컬 .env에서 복사) |
|------|----------------------------|
| `VITE_FIREBASE_API_KEY` | .env의 값 |
| `VITE_FIREBASE_AUTH_DOMAIN` | .env의 값 |
| `VITE_FIREBASE_PROJECT_ID` | .env의 값 |
| `VITE_FIREBASE_STORAGE_BUCKET` | .env의 값 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | .env의 값 |
| `VITE_FIREBASE_APP_ID` | .env의 값 |
| `VITE_FIREBASE_MEASUREMENT_ID` | .env의 값 (있으면) |

### 2. GitHub Pages 켜기 (브랜치에서 배포)

**Settings → Pages** 에서  
- **Build and deployment → Source**: **Deploy from a branch** 선택  
- **Branch**: `gh-pages` 선택, **Folder**: `/ (root)`  
- Save

이후 **main**에 푸시하면 Actions가 빌드하고 **gh-pages** 브랜치에 올립니다.  
(처음 한 번은 위 1번 시크릿을 넣은 뒤 main에 푸시해 워크플로가 성공해야 gh-pages 브랜치가 생깁니다.)

### 3. 배포 후 주소

`https://yeongwoo-seo.github.io/finance/` 에서 확인할 수 있습니다.

**Firebase Hosting** 을 쓰면 [DEPLOY.md](./DEPLOY.md) 를 보고, 그때는 `vite.config.js` 의 `base` 를 `'/'` 로 바꾼 뒤 빌드·배포하면 됩니다.
