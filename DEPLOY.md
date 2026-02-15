# 사이트 배포 (Firebase Hosting)

프로젝트를 **실제 사이트(URL)** 로 배포하는 방법입니다.

---

## 1. Firebase CLI 설치 (한 번만)

```bash
npm install -g firebase-tools
```

---

## 2. 로그인

```bash
firebase login
```

브라우저가 열리면 Google 계정으로 로그인하세요. (finance-67a87 프로젝트 소유 계정)

---

## 3. 빌드 & 배포

```bash
npm run deploy
```

또는 단계별로:

```bash
npm run build
firebase deploy --only hosting
```

---

## 4. 배포 완료 후

배포가 끝나면 터미널에 **Hosting URL**이 나옵니다.

- 예: `https://finance-67a87.web.app`
- 또는: `https://finance-67a87.firebaseapp.com`

이 주소로 접속하면 나간 돈 관리 대시보드가 열립니다.

---

## 커스텀 도메인 (선택)

Firebase Console → Hosting → 도메인 연결에서 본인 도메인을 붙일 수 있습니다.

---

## 참고

- `.env`의 Firebase 설정은 **빌드 시** `dist`에 포함됩니다. 공개 저장소에 올릴 때는 `.env`를 제외했으므로, **배포 환경**에서는 Vercel/Netlify 등에서 환경 변수를 설정하거나, Firebase Hosting으로 배포할 때 빌드한 뒤 `dist`만 올리면 됩니다.
- **Firebase Hosting**은 빌드 결과물(`dist`)만 업로드하므로, 로컬에서 `npm run build`로 만든 결과가 그대로 배포됩니다. (환경 변수는 빌드할 때 이미 반영됨)
