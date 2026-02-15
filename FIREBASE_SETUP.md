# Firebase 데이터 만들기

## 1. Firebase 프로젝트 생성

1. **[Firebase Console](https://console.firebase.google.com/)** 접속 후 **프로젝트 추가** 클릭
2. 프로젝트 이름 입력 (예: `investment-dashboard`) → **계속**
3. Google Analytics 사용 여부 선택 후 **프로젝트 만들기**
4. 생성이 끝나면 **콘솔로 이동**

---

## 2. Firestore 데이터베이스 만들기

1. 왼쪽 메뉴에서 **빌드** → **Firestore Database** 선택
2. **데이터베이스 만들기** 클릭
3. **보안 규칙** 선택
   - **테스트 모드로 시작**: 개발 중에는 이걸로 시작 (약 30일 후 규칙 수정 안내)
   - **프로덕션 모드**: 나중에 규칙에서 `transactions` 읽기/쓰기 허용 규칙 추가 필요
4. 위치 선택 (예: `asia-northeast3` 서울) → **사용 설정**

이제 **Firestore 데이터**가 생성되었습니다.  
`transactions` 컬렉션은 **첫 문서가 추가될 때** 자동으로 만들어집니다. 터미널에서 다음을 실행하면 컬렉션이 생성됩니다:

```bash
npm run create-collection
```

---

## 3. 웹 앱 설정값 가져오기

1. 프로젝트 설정(톱니바퀴) → **일반** 탭
2. 아래로 내려 **내 앱**에서 **웹(</>)** 아이콘 클릭
3. 앱 닉네임 입력 (예: `web`) → **앱 등록**
4. 나오는 `firebaseConfig` 객체에서 아래 값을 복사:

| 환경 변수 | config 키 |
|-----------|------------|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

5. 프로젝트 루트에 **`.env`** 파일을 만들고 다음 형식으로 붙여넣기:

```
VITE_FIREBASE_API_KEY=여기에_apiKey_값
VITE_FIREBASE_AUTH_DOMAIN=여기에_authDomain_값
VITE_FIREBASE_PROJECT_ID=여기에_projectId_값
VITE_FIREBASE_STORAGE_BUCKET=여기에_storageBucket_값
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_값
VITE_FIREBASE_APP_ID=여기에_appId_값
```

---

## 4. (선택) 샘플 데이터 넣기

`.env` 설정 후 터미널에서:

```bash
npm run seed
```

실행하면 Firestore `transactions` 컬렉션에 샘플 내역이 몇 건 추가됩니다. 앱을 켜면 바로 목록에서 확인할 수 있습니다.

---

## 5. Firestore 보안 규칙 (배포 시)

나중에 프로덕션용 규칙을 쓰려면 **Firestore** → **규칙**에서 예시처럼 설정할 수 있습니다 (테스트용이라 인증 없이 허용):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, write: if true;  // 개발용. 배포 시 인증 조건으로 변경
    }
  }
}
```

실제 서비스 시에는 `request.auth != null` 등으로 읽기/쓰기를 제한하는 것이 좋습니다.
