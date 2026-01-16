# 배포 가이드 (Git Push & GitHub Pages)

이 문서는 프로젝트 코드를 GitHub에 업로드하고, GitHub Pages를 통해 웹에 배포하는 방법을 설명합니다.

## 1. Git Push (코드 업로드)

현재 작업한 내용을 GitHub 저장소로 업로드하는 기본 과정입니다.

```bash
# 1. 변경된 모든 파일 스테이징
git add .

# 2. 커밋 메시지 작성
git commit -m "작업 내용 요약 (예: 일정 페이지 리팩토링 완료)"

# 3. GitHub로 전송
git push origin main
```

> [!NOTE]
> 만약 브랜치 이름이 `master`라면 `git push origin master`를 사용하세요.

---

## 2. GitHub Pages 배포 (Vite 최적화)

Vite 프로젝트를 GitHub Pages에 배포하는 가장 간편한 방법은 `gh-pages` 패키지를 사용하는 것입니다.

### 2.1 사전 설정 (`vite.config.ts`)

이미 설정되어 있지만, `base` 경로가 저장소 이름과 일치해야 합니다.
현재 설정: `base: '/unina_temp/'`

### 2.2 배포 패키지 설치

터미널에서 아래 명령어를 실행하여 배포용 패키지를 설치합니다.

```bash
npm install --save-dev gh-pages
```

### 2.3 스크립트 추가 (`package.json`)

`package.json`의 `scripts` 항목에 아래 내용을 추가합니다.

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### 2.4 배포 실행

아래 명령어를 실행하면 자동으로 빌드(`build` 폴더 생성) 후 GitHub의 `gh-pages` 브랜치로 업로드됩니다.

```bash
npm run deploy
```

---

## 3. GitHub Pages 활성화 및 확인

1. GitHub 저장소 페이지 접속
2. **Settings** > **Pages** 메뉴 클릭
3. **Build and deployment** > **Branch**가 `gh-pages`로 설정되어 있는지 확인
4. 상단에 표시된 URL(예: `https://thekadang.github.io/unina_temp/`)로 접속

---

## 4. 자동 배포 (GitHub Actions) - 권장

매번 수동으로 명령어를 입력하지 않고, 코드만 푸시하면 자동으로 배포되도록 설정할 수 있습니다.

1. 프로젝트 루트에 `.github/workflows/deploy.yml` 파일 생성
2. 아래 내용을 작성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build # 빌드 결과물 폴더
          branch: gh-pages
```

이 설정을 완료하면 `main` 브랜치에 코드를 `push`할 때마다 자동으로 배포가 진행됩니다.
