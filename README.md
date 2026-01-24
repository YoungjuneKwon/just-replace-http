# Just Replace HTTP

HTTP 요청 문자열 중 일부를 원하는 문자열로 대체해서 요청하는 크롬 확장 프로그램

## 주요 기능

- **설정 화면 제공**: 패턴을 쉽게 관리할 수 있는 팝업 UI
- **IndexedDB 저장**: 설정 내용을 브라우저의 IndexedDB에 안전하게 저장
- **HTTP 요청 감시**: 모든 HTTP 요청을 감시하여 설정된 패턴에 따라 URL 변환
- **정규식 지원**: 정규식 패턴 매칭과 그룹 참조($1, $2 등) 지원
- **On/Off 토글**: 각 패턴을 개별적으로 활성화/비활성화 가능
- **활성화 상태 표시**: 확장 프로그램 아이콘에 활성화된 패턴 개수를 배지로 표시하여 창을 열지 않아도 replace 처리 중임을 확인 가능
- **무료**: Requestly의 replace 기능을 무료로 제공

## 설치 방법

1. 이 저장소를 클론하거나 다운로드합니다
2. Chrome 브라우저를 열고 `chrome://extensions/` 로 이동합니다
3. 우측 상단의 "개발자 모드"를 활성화합니다
4. "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다
5. 다운로드한 폴더를 선택합니다

## 사용 방법

### 패턴 추가

1. Chrome 도구 모음에서 확장 프로그램 아이콘을 클릭합니다
2. "새 패턴 추가" 섹션에서:
   - **원본 패턴**: 정규식 패턴을 입력합니다 (예: `https://old-domain\.com/(.*)`)
   - **대체 문자열**: 변경할 문자열을 입력합니다 (예: `https://new-domain.com/$1`)
3. "추가" 버튼을 클릭합니다

### 패턴 관리

- **On/Off 토글**: 체크박스를 클릭하여 패턴을 활성화/비활성화합니다
- **패턴 삭제**: "삭제" 버튼을 클릭하여 패턴을 제거합니다
- **활성화 상태 확인**: 확장 프로그램 아이콘에 표시되는 녹색 배지 숫자로 현재 활성화된 패턴의 개수를 확인할 수 있습니다

### 정규식 예제

#### 도메인 변경
```
원본 패턴: https://api\.example\.com/(.*)
대체 문자열: https://api.newdomain.com/$1
```

#### 경로 변경
```
원본 패턴: https://example\.com/old-path/(.*)
대체 문자열: https://example.com/new-path/$1
```

#### 쿼리 파라미터 변경
```
원본 패턴: (https://example\.com/.*)\?old=(.*)
대체 문자열: $1?new=$2
```

## 기술 스택

- **Manifest V3**: 최신 Chrome Extension API 사용
- **IndexedDB**: 패턴 데이터의 영구 저장
- **declarativeNetRequest API**: 효율적인 HTTP 요청 수정
- **Vanilla JavaScript**: 외부 라이브러리 의존성 없음

## 파일 구조

```
just-replace-http/
├── manifest.json       # 확장 프로그램 설정
├── popup.html          # 팝업 UI 구조
├── popup.css           # 팝업 스타일
├── popup.js            # 팝업 로직 및 IndexedDB 관리
├── background.js       # 백그라운드 서비스 워커 (HTTP 요청 가로채기)
├── icons/              # 확장 프로그램 아이콘
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 권한 설명

- **declarativeNetRequest**: HTTP 요청을 가로채고 수정하기 위해 필요
- **declarativeNetRequestWithHostAccess**: 모든 호스트에 대한 요청 수정 권한
- **storage**: 패턴 데이터를 IndexedDB에 저장하기 위해 필요
- **host_permissions (all_urls)**: 모든 URL에 대한 요청을 처리하기 위해 필요

## 주의사항

- 정규식 패턴은 유효한 JavaScript 정규식이어야 합니다
- 잘못된 패턴은 추가되지 않으며 오류 메시지가 표시됩니다
- 패턴 변경 사항은 즉시 적용됩니다
- 너무 광범위한 패턴은 의도하지 않은 요청도 수정할 수 있으니 주의하세요

## 라이선스

MIT License

## 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!
