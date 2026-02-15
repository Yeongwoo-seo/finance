# 투자금 관리 대시보드

토스(Toss) 스타일의 깔끔한 UI와 Firebase Firestore 실시간 동기화를 결합한 개인 투자금 관리 대시보드입니다.

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
