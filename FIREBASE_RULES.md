# Firestore 보안 규칙 적용 방법

프로젝트 루트의 `firestore.rules` 내용을 Firebase에 반영하는 방법입니다.

---

## 방법 1: Firebase 콘솔에서 직접 붙여넣기

1. [Firebase Console](https://console.firebase.google.com/) → 프로젝트 **finance-67a87** 선택
2. 왼쪽 메뉴 **Firestore Database** → 상단 **규칙** 탭
3. 아래 규칙으로 **기존 내용을 통째로 교체** 후 **게시**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, write: if true;
    }
  }
}
```

- `if true` → 누구나 `transactions` 읽기/쓰기 가능 (개인용·테스트용)
- 실제 서비스 시에는 `if request.auth != null` 등으로 제한하는 것을 권장합니다.

---

## 방법 2: Firebase CLI로 배포

1. CLI 설치 및 로그인 (한 번만):

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. 프로젝트에서 초기화 (한 번만):

   ```bash
   firebase init firestore
   ```

   - 기존 `firestore.rules` 파일 사용 선택
   - 규칙 파일 경로: `firestore.rules` (기본값)

3. 규칙 배포:

   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 규칙 설명

| 규칙 | 의미 |
|------|------|
| `match /transactions/{docId}` | `transactions` 컬렉션의 모든 문서 |
| `allow read, write: if true` | 인증 없이 읽기·쓰기 허용 (개인용) |
| `allow read, write: if request.auth != null` | 로그인한 사용자만 허용 |

로그인(Google, 이메일 등)을 붙이면 `request.auth != null`로 바꾸고, 필요 시 `request.auth.uid`로 본인 문서만 허용하도록 수정하면 됩니다.
