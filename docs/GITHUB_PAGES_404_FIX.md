# main.jsx 404 / yeongwoo-seo.github.io/src/main.jsx 404 해결

브라우저가 `yeongwoo-seo.github.io/src/main.jsx` 를 요청해서 404가 나는 경우, **빌드 결과가 아닌 소스 코드**가 서빙되고 있는 상태입니다.

---

## 1. 접속 주소 확인

반드시 아래 주소로 접속하세요 (끝에 `/finance/` 포함).

- ✅ **https://yeongwoo-seo.github.io/finance/**
- ❌ https://yeongwoo-seo.github.io (이렇게 열면 안 됨)

---

## 2. GitHub Pages가 gh-pages 브랜치를 보게 하기

1. GitHub **finance** 저장소 → **Settings** → **Pages**
2. **Build and deployment** 섹션에서:
   - **Source**: **Deploy from a branch**
   - **Branch**: **gh-pages** (드롭다운에서 선택)
   - **Folder**: **/ (root)**
3. **Save** 클릭

지금 **Branch**가 **main** 이면, 소스용 `index.html`이 서빙되기 때문에 `/src/main.jsx` 404가 납니다. **반드시 gh-pages 로 바꿔야** 빌드된 사이트가 올라갑니다.

---

## 3. gh-pages 브랜치가 있는지 확인

- 저장소 상단 **main** 옆 브랜치 선택 → **gh-pages** 가 보여야 합니다.
- 없으면 **Actions** 탭에서 "Deploy to GitHub Pages" 워크플로가 **한 번이라도 성공**했는지 확인하세요.
- 워크플로가 실패했다면 **Secrets** 에 `VITE_FIREBASE_*` 7개가 들어 있는지 확인한 뒤, main 에 다시 푸시해서 워크플로를 재실행하세요.

---

## 4. 정리

| 확인 항목 | 해야 할 것 |
|-----------|------------|
| 접속 URL | `https://yeongwoo-seo.github.io/finance/` 로 열기 |
| Pages Source | **Deploy from a branch** → **gh-pages** |
| gh-pages 브랜치 | 없으면 Actions 성공 후 생성됨 → 시크릿 설정 후 main 푸시 |

이렇게 하면 빌드된 사이트만 서빙되어 `/src/main.jsx` 404는 사라집니다.
