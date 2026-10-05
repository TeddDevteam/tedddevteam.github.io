# JLPT Voca Dict Jetpack Compose 재구현 완료 보고서 및 아키텍처 명세서

> **상태**: 🚀 Jetpack Compose + Material 3 + Room Prepackaged DB 마이그레이션 및 구현 완료 (APK 빌드 및 단위 테스트 통과)

## 1. 구현 개요

기존 Java/XML 기반의 `JLPT_Voca_Dict` 앱을 모던 Android 표준 아키텍처(Kotlin 2.0, Jetpack Compose, Material 3, Single Activity, Navigation Compose, Room Prepackaged DB, DataStore Preferences)로 완벽하게 재구현했습니다.

- **UI 프레임워크**: Jetpack Compose + Material 3 (Sakura Rose & Slate Indigo 테마)
- **아키텍처**: MVVM / 단방향 데이터 흐름 (UiState, UiAction, ViewModel, Flow)
- **데이터 파이프라인**: `Old_Data` XML 자동 추출 ➔ 정규화 CSV/JSON ➔ `app/src/main/assets/jlpt_voca.db` Room 사전 패키징 DB
- **설정/상태 관리**: DataStore Preferences
- **오디오 & 인터랙션**: TextToSpeech (일본어/한국어/베트남어), SoundManager (자체 합성 톤 & 자연 BGM), Haptic Feedback


### 지원 기기 범위

새 앱은 **Android Phone 전용 UX**로 구현하고 검증한다.

- 휴대폰 세로 화면을 공식 지원 범위로 한다.
- 태블릿 전용 레이아웃, two-pane UI와 대형 화면 최적화는 구현하지 않는다.
- 폴더블의 펼친 화면, Chromebook 및 데스크톱 Android 환경도 초기 지원 범위에서 제외한다.
- 다양한 휴대폰 해상도와 글꼴 배율에는 대응하되, 태블릿용 breakpoint나 Window Size Class 분기는 만들지 않는다.
- 스토어에서 태블릿 설치 자체를 차단할지는 UX 지원 범위와 별도의 배포 정책으로 출시 전에 결정한다.

## 2. 현재 앱 요약

### 2.1 기술 구성

| 항목 | 현재 상태 |
|---|---|
| 언어/UI | Java + XML View |
| 모듈 | `app` 단일 모듈 |
| SDK | minSdk 26, compile/target SDK 36 |
| 앱 버전 | 1.6.5 (versionCode 65) |
| 화면 구조 | 1개 시작 Activity + 8개 학습/퀴즈 Activity |
| 데이터 | `string-array` XML 리소스에 내장 |
| 설정/통계 | 화면별 `SharedPreferences` |
| 음성 | Android `TextToSpeech` |
| 소리/BGM | `MediaPlayer` + raw MP3 |
| 배포 기능 | Play In-App Update, In-App Review |
| 이미지 | Glide + PhotoView + 별도 DialogFragment |
| 다국어 | 기본 리소스, 한국어(`ko`), 베트남어(`vi`), 미얀마어(`my`) |
| 테스트 | 예제 테스트 위주이며 현재 단위 테스트 컴파일 실패 |

주요 의존성 중 AppCompat, ConstraintLayout, Material, Glide가 오래된 버전이고, 일부 Play Core KTX 의존성은 새 앱에서 필요 여부와 최신 API를 다시 확인해야 한다. 새 프로젝트를 시작할 때는 특정 버전을 이 문서에 고정하지 말고 당시 안정 버전과 공식 BOM을 기준으로 선택한다.

### 2.2 화면과 사용자 흐름

```text
시작 화면
├─ 단어 학습 ────── 단어 퀴즈
├─ 한자 학습 ────── 한자 퀴즈
├─ 예문 학습 ────── 예문 퀴즈
└─ 보조 단어 학습 ─ 보조 단어 퀴즈 (현재 시작 화면에서 숨김)

공통 시작 옵션
├─ TTS 켜기/끄기
├─ 자동 재생 켜기/끄기
└─ 수면 모드
   ├─ TTS와 자동 재생 강제 활성화
   ├─ 화면 밝기 최소화
   └─ BGM 선택
```

시작 화면은 단어·한자·예문 학습 및 퀴즈로 이동한다. 보조 단어 버튼과 퀴즈 버튼은 코드에는 연결돼 있지만 XML에서 `gone` 상태이다. 앱 시작 시 Play의 유연한 업데이트를 확인하며, 뒤로가기를 2초 안에 두 번 눌러 종료한다.

### 2.3 학습 카드 동작

단어, 한자, 예문 학습 화면은 거의 같은 상태 머신을 사용한다.

1. 임의의 일본어 표기를 표시한다.
2. 첫 탭에서 현지어 의미를 표시하고 현지어 TTS를 실행한다.
3. 다음 탭에서 발음 표기를 표시하고 일본어 TTS를 실행한다.
4. 다음 탭에서 새 항목을 임의 선택하고 학습 횟수를 증가시킨다.

자동 재생은 약 4초마다 같은 탭 동작을 실행한다. 수면 모드는 자동 재생과 TTS를 켜고 화면 밝기를 낮추며 선택한 BGM을 반복 재생한다. 수동 모드에서는 처음 사용하는 사용자에게 손가락 안내 이미지를 깜빡여 탭을 유도한다. 히라가나/가타카나 표 이미지를 확대 가능한 팝업으로 열 수 있다.

학습 필터는 다음과 같다.

| 유형 | 필터 |
|---|---|
| 단어 | 전체, N5/N4, N3/N2, N1 |
| 한자 | 전체, N5/N4, N3/N2, N1 |
| 예문 | 전체, 일상, 여행, 비즈니스 |
| 보조 단어 | 별도 필터 없음 |

현재 항목 선택은 완전 무작위이므로 직전 항목이 연속으로 다시 나올 수 있고, 세션 내 미학습 항목 우선 정책은 없다.

### 2.4 퀴즈 동작

- 임의의 정답 1개와 서로 다른 오답 3개를 골라 4지선다로 섞는다.
- 정답을 맞히면 다음 문제 전환 전 약 2초 동안 결과와 획득 점수를 표시한다.
- 문제별 최초 획득 가능 점수는 10점이다.
- 오답을 고를 때마다 `10 → 6 → 3 → 1`로 획득 가능 점수가 감소한다.
- 총점이 100점 단위를 넘을 때 축하 메시지를 표시한다.
- 일본어와 현지어 영역을 눌러 질문/답변 방향을 바꿀 수 있다.
- 질문을 눌러 일본어 TTS를 재생하며, TTS가 꺼진 경우 활성화를 안내한다.
- 필터 선택과 최초 사용 안내 여부는 화면별 환경설정에 저장한다.

문장 퀴즈의 레이아웃은 3개 답변을 사용하고, 단어·한자·보조 단어 퀴즈는 4개 답변을 사용한다. 새 구현에서는 이 차이가 의도된 UX인지 데이터/화면 제약인지 먼저 확인한 후 명시적으로 모델링해야 한다.

### 2.5 데이터 현황

기본 리소스의 전체 데이터 수는 다음과 같다.

| 콘텐츠 | 전체 | 세부 분류 |
|---|---:|---|
| 단어 | 6,883 | N5/N4 1,280, N3/N2 3,140, N1 2,463 |
| 한자 | 5,632 | N5/N4 961, N3/N2 2,617, N1 2,054 |
| 예문 | 2,147 | 일상 1,501, 여행 458, 비즈니스 188 |
| 보조 단어 | 224 | 분류 없음 |

데이터는 표기, 후리가나, 발음 표기, 의미를 각각 별도 배열로 관리하며 같은 인덱스를 한 레코드로 간주한다. 현재 확인한 각 병렬 배열의 길이는 서로 일치한다.

언어별 구성은 다음과 같다.

- 기본 리소스: 일본어 원문, 후리가나, 발음 표기, 의미를 모두 포함한다.
- 한국어: 발음 표기와 의미를 번역 리소스로 덮어쓴다.
- 베트남어/미얀마어: 주로 의미를 번역 리소스로 덮어쓴다.
- 일본어 원문과 후리가나는 공통 기본 리소스를 사용한다.

XML의 배열 순서가 관계를 표현하므로 한 파일에서 항목 하나만 누락돼도 이후 데이터가 모두 잘못 연결될 위험이 있다. 중복된 `all_*` 배열도 APK 크기와 유지보수 비용을 증가시킨다.

### 2.6 저장 상태

화면별로 서로 다른 `SharedPreferences` 파일을 사용한다.

- 학습 화면: 선택 필터, 누적 학습 횟수, 손가락 안내 노출 여부, 리뷰 요청 여부
- 퀴즈 화면: 선택 필터, 손가락 안내 노출 여부, 리뷰 요청 여부
- 시작 화면 옵션: Intent extra로만 전달되며 영구 저장되지 않음
- 퀴즈 점수: 현재 세션 상태이며 프로세스 재생성 시 보존되지 않음

같은 의미의 키가 여러 파일에 흩어져 있어 전역 설정인지 콘텐츠별 설정인지 경계가 불명확하다. Compose 앱에서는 타입 안전한 단일 설정 모델로 정리할 필요가 있다.

## 3. 현재 구조의 문제점과 재구현 우선순위

### 3.1 높은 우선순위

1. **대규모 코드 중복**  
   8개 학습/퀴즈 Activity가 UI 초기화, 필터 선택, 무작위 선택, TTS, 점수, 리뷰, 수명주기 코드를 반복한다. 콘텐츠 유형별 차이를 데이터와 설정으로 표현하고 공통 엔진을 사용해야 한다.

2. **UI와 도메인 로직 결합**  
   `Activity`가 화면 표시뿐 아니라 랜덤 문제 생성, 점수 계산, 저장, 타이머, 미디어 자원 해제까지 담당한다. 회전, 백그라운드 전환, 프로세스 재생성에 취약하고 단위 테스트하기 어렵다.

3. **취약한 병렬 배열 데이터 모델**  
   레코드 식별자와 스키마가 없고 배열 인덱스가 유일한 연결 수단이다. 마이그레이션 전에 모든 언어와 모든 필드의 길이, 빈 값, 중복 ID, 분류 합계를 자동 검증해야 한다.

4. **수명주기와 상태 복원**  
   `Handler`, `Runnable`, `MediaPlayer`, TTS가 Activity에 직접 묶여 있다. 타이머 중복 등록과 복귀 시 상태 불일치 가능성이 있다. ViewModel 상태와 lifecycle-aware coroutine/effect로 분리해야 한다.

5. **테스트 기준선 실패**  
   `./gradlew.bat testDebugUnitTest --no-daemon` 실행 시 메인 소스 컴파일은 성공하지만, `ListviewAdapterTest`가 존재하지 않는 `ListviewItem`을 참조해 테스트 컴파일이 실패한다. 테스트 1개는 null 목록에서 `size()`를 호출하므로 참조가 복구돼도 실패할 테스트이다.

### 3.2 중간 우선순위

- 모든 Activity가 외부 진입 의도가 없는데도 `exported=true`이다. 런처 Activity만 외부 노출하고 나머지는 Navigation 목적지로 바꾼다.
- 인터넷 권한은 Play 업데이트/리뷰 외 앱 기능에는 필요하지 않아 보인다. 새 의존성 결정 후 권한 필요성을 재검토한다.
- 물리 화면 대각선을 계산한 뒤 방향을 바꾸는 코드가 있다. 새 앱은 Phone 세로 화면만 지원하므로 이 판별을 제거하고 방향 정책을 앱 수준에서 일관되게 적용한다.
- 고정 크기와 별도 `layout-land` 복제본이 많다. 반응형 레이아웃과 접근성 글꼴 배율을 지원한다.
- Emoji를 설정 컨트롤의 유일한 레이블처럼 사용한다. 아이콘, 접근성 설명, 명시적 텍스트를 제공한다.
- 비활성화된 보조 단어 기능, 사용되지 않는 `VocaRepository`, `TtsManager`, `SoundEffectManager`, `FlashCardType`이 존재한다. 새 앱에 옮기기 전 유지/삭제 여부를 결정한다.
- Java 8 source/target 및 여러 deprecated API 경고가 있다.
- `README.md`는 프로젝트 이름 한 줄뿐이어서 데이터 생성/검증/릴리스 절차를 알 수 없다.

### 3.3 유지해야 할 장점

- 네트워크 없이 전체 콘텐츠를 사용할 수 있다.
- 단순한 탭 기반 학습 흐름과 즉시 TTS 피드백이 명확하다.
- 난이도/상황별 필터가 이미 정리돼 있다.
- 라이트/다크 색상 리소스를 이미 갖추고 있다.
- 수면 모드, BGM, 문자표 팝업 등 앱 고유 기능이 있다.
- 한국어, 베트남어, 미얀마어 번역 데이터가 이미 구축돼 있다.

## 4. 목표 제품 범위

### 4.1 1차 출시(MVP)에 포함

- 홈 화면과 학습 옵션
- 단어, 한자, 예문 학습
- 단어, 한자, 예문 퀴즈
- 기존 4개 언어 리소스와 오프라인 동작
- 콘텐츠 필터
- 일본어/현지어 TTS
- 자동 재생과 수면 모드/BGM
- 누적 학습 횟수와 선택 필터 저장
- 라이트/다크 테마와 다양한 Phone 화면 크기 대응
- 앱 업데이트 및 리뷰 요청 정책
- 데이터 무결성, 학습 엔진, 퀴즈 엔진 테스트

### 4.2 결정 후 포함

- 보조 단어 학습/퀴즈를 사용자에게 다시 노출할지 여부
- 기존 학습 횟수와 필터 설정 마이그레이션
- 히라가나/가타카나 이미지 팝업 유지 또는 Compose 기반 문자표로 교체
- 퀴즈 최고 점수, 오답 기록, 학습 진도 등 신규 기능

### 4.3 초기 범위에서 제외 권장

- 계정, 서버 동기화, 로그인
- 온라인 사전 검색
- 과도한 모듈 분리
- 기존 앱에 없던 학습 알고리즘(SRS 등)의 동시 도입

기능 이식과 학습 방식 변경을 한 번에 하면 기존 앱과의 동등성 검증이 어려워진다. 먼저 기능 동등성을 확보하고, SRS/즐겨찾기/검색은 후속 버전에서 추가하는 편이 안전하다.

## 5. 제안 아키텍처

### 5.1 모듈 구성

첫 버전은 다음 3개 모듈이면 충분하다.

```text
:app
├─ Application, MainActivity, Navigation, DI 조립
├─ home UI
├─ study UI/ViewModel
└─ quiz UI/ViewModel

:core:model
└─ 순수 Kotlin 모델과 학습/퀴즈 규칙

:core:data
├─ Room database/DAO
├─ DataStore
├─ Repository 구현
└─ 초기 DB와 데이터 검증
```

팀 규모가 작거나 빠른 재구현이 목표라면 처음에는 `:app` 단일 모듈 안에서 `core`, `data`, `feature` 패키지만 분리하고, 빌드 시간이 실제 문제일 때 모듈로 추출해도 된다.

### 5.2 계층과 데이터 흐름

```text
Compose Screen
    ↓ UiAction
ViewModel
    ↓ use case/repository call
Repository
    ├─ Room: 학습 콘텐츠
    └─ DataStore: 설정/통계

ViewModel
    ↑ Flow/domain result
Compose Screen ← StateFlow<UiState>
```

- Composable은 `UiState`를 렌더링하고 `UiAction`만 전달한다.
- ViewModel이 카드 단계, 현재 문제, 점수, 필터와 재생 상태를 소유한다.
- 일회성 UI 효과는 명시적 effect stream으로 처리한다.
- TTS와 오디오는 Android 구현체 뒤에 인터페이스를 두어 테스트에서 fake로 대체한다.
- 시간 지연과 랜덤 생성기도 주입 가능하게 만들어 단위 테스트를 결정적으로 실행한다.

### 5.3 핵심 모델 예시

```kotlin
enum class ContentType { WORD, KANJI, SENTENCE, SUPPORT_WORD }
enum class ContentCategory { N5_N4, N3_N2, N1, DAILY, TRAVEL, BUSINESS, NONE }
enum class CardPhase { PROMPT, MEANING, PRONUNCIATION }

data class LearningItem(
    val id: String,
    val type: ContentType,
    val category: ContentCategory,
    val japanese: String,
    val reading: String?,
)

data class LearningTranslation(
    val itemId: String,
    val locale: String,
    val pronunciation: String?,
    val meaning: String,
)

data class StudySettings(
    val ttsEnabled: Boolean,
    val autoPlayEnabled: Boolean,
    val sleepModeEnabled: Boolean,
    val bgm: BgmOption,
)
```

`ALL`은 실제 콘텐츠 분류가 아니므로 DB에 저장하지 않고 DAO 쿼리의 필터 없음으로 표현한다. 일본어 원본과 언어별 번역은 별도 모델로 분리한다. 이렇게 하면 일본어를 중복 저장하지 않고도 한 항목에 여러 언어를 안정적으로 연결할 수 있다.

### 5.4 데이터 저장 선택

#### 5.4.1 권장 데이터 흐름

```text
사람이 편집하는 CSV 원본
        ↓ 변환 및 자동 검증
생성된 SQLite 데이터베이스
        ↓ 앱 assets에 포함
prepackaged Room DB
        ↓
Repository → ViewModel → Compose UI
```

XML을 한 번 Room으로 옮기는 것보다, **CSV를 원본으로 관리하고 검증된 Room DB를 반복 생성할 수 있는 파이프라인**을 만드는 것이 중요하다. 생성된 SQLite 파일은 빌드 산출물로 취급하며 사람이 직접 수정하지 않는다.

#### 5.4.2 편집 원본: 언어별 CSV 권장

JSON도 사용할 수 있지만 현재 데이터는 표 형태이고 번역 검수가 중요하므로 CSV가 더 적합하다. Excel이나 Google Sheets로 검토하기 쉽고, 언어별 누락도 찾기 쉽다.

```text
data-source/
├─ items.csv
├─ translations_en.csv
├─ translations_ko.csv
├─ translations_vi.csv
└─ translations_my.csv
```

`items.csv`는 언어와 무관한 일본어 원본만 관리한다.

```csv
id,type,category,japanese,reading
word_n5n4_000001,WORD,N5_N4,学校,がっこう
```

각 번역 파일은 안정 ID를 기준으로 현지화 데이터를 연결한다.

```csv
item_id,pronunciation,meaning
word_n5n4_000001,각코우,학교
```

한 파일에 모든 언어를 열로 넣는 방식도 가능하지만, 언어가 추가되거나 번역 담당자가 나뉠 때 충돌이 커진다. 언어별 파일 분리가 장기 유지보수에 더 유리하다. 예문에 쉼표와 줄바꿈이 포함될 수 있으므로 변환기는 RFC 4180 호환 CSV 파서를 사용하고 모든 파일의 인코딩을 UTF-8로 고정한다.

#### 5.4.3 배포 데이터: prepackaged Room DB 권장

- 약 1만 5천 개의 원본 항목을 구조화된 레코드로 다룰 수 있다.
- `all` 배열 중복 없이 유형/분류 쿼리가 가능하다.
- 안정적인 ID로 번역, 향후 즐겨찾기/오답/진도를 연결할 수 있다.
- 앱 시작마다 대형 XML 배열 전체를 메모리에 올릴 필요가 없다.
- 스키마 버전과 migration test를 적용할 수 있다.

권장 테이블 구조는 다음과 같다.

```text
learning_item
├─ id TEXT PRIMARY KEY
├─ type TEXT NOT NULL
├─ category TEXT NOT NULL
├─ japanese TEXT NOT NULL
└─ reading TEXT

translation
├─ item_id TEXT NOT NULL → learning_item.id
├─ locale TEXT NOT NULL
├─ pronunciation TEXT
├─ meaning TEXT NOT NULL
└─ PRIMARY KEY(item_id, locale)
```

주요 조회 조건에 다음 인덱스를 둔다.

- `learning_item(type, category)`
- `translation(locale, item_id)`

DB는 앱의 `assets`에 포함하고 Room의 사전 생성 DB 기능으로 연다. 스키마가 바뀔 때 앱 업데이트가 기존 사용자 DB를 정상적으로 올릴 수 있도록 Room schema export와 migration test를 함께 관리한다.

#### 5.4.4 `all_*` 배열 중복 제거

현재 단어 데이터는 다음 관계를 가진다.

```text
N5/N4 1,280 + N3/N2 3,140 + N1 2,463 = 전체 6,883
```

한자와 예문도 세부 분류의 합계가 전체 수량과 같다. 마이그레이션 도구에서 `all_*` 배열이 세부 배열을 합친 결과와 항목 단위로 동일한지 검증한 뒤, 새 원본에서는 `all_*` 데이터를 제거한다.

```sql
-- 전체 단어
SELECT *
FROM learning_item
WHERE type = 'WORD';

-- N5/N4 단어
SELECT *
FROM learning_item
WHERE type = 'WORD'
  AND category = 'N5_N4';
```

`ALL` 선택은 데이터 값이 아니라 UI/쿼리의 `category = null` 조건으로 처리한다.

#### 5.4.5 안정 ID 정책

배열 인덱스나 일본어 문자열의 hash를 ID로 직접 사용하지 않는다. 문자열 오탈자를 수정하거나 배열 순서를 바꿨을 때 ID가 변하면 즐겨찾기, 오답 기록과 진도가 다른 항목에 연결될 수 있기 때문이다.

초기 변환 시 다음처럼 읽을 수 있는 고정 ID를 한 번 발급하고 이후에는 변경하지 않는다.

```text
word_n5n4_000001
kanji_n3n2_000542
sentence_daily_001203
support_word_000057
```

- 항목의 표기나 번역이 수정돼도 ID를 유지한다.
- 분류가 바뀌어도 가능하면 기존 ID를 유지한다.
- 삭제된 ID는 다른 항목에 재사용하지 않는다.
- 사용자 진도 테이블은 이 ID를 외래 키로 참조한다.

#### 5.4.6 XML 마이그레이션 및 검증 파이프라인

기존 XML을 사람이 수동으로 복사하지 않고, 일회성 추출 도구와 반복 실행 가능한 생성 도구를 작성한다.

1. 기본 `values`의 일본어, 후리가나, 발음, 의미 배열을 읽는다.
2. 동일 인덱스의 필드를 하나의 레코드로 결합한다.
3. `values-ko`, `values-vi`, `values-my` 데이터를 같은 안정 ID에 연결한다.
4. `all_*`과 세부 분류 배열의 내용 및 순서를 비교한다.
5. 정규화된 언어별 CSV를 생성한다.
6. CSV 전체를 검증한다.
7. 검증된 CSV로 SQLite DB를 생성한다.
8. Room이 생성 DB의 schema와 데이터를 열 수 있는지 테스트한다.

필수 검증 규칙은 다음과 같다.

- 같은 콘텐츠/분류의 병렬 배열 길이가 동일하다.
- 세부 분류의 합계와 `all_*`의 수량이 동일하다.
- `all_*`의 각 레코드와 세부 배열을 합친 레코드가 동일하다.
- `id`, `type`, `category`, `japanese`, 기본 의미는 비어 있지 않다.
- ID 및 `(item_id, locale)` 조합이 중복되지 않는다.
- 모든 번역이 존재하는 `item_id`를 참조한다.
- locale별 누락 번역과 빈 값을 오류 또는 명시적 경고로 출력한다.
- XML entity, 쉼표, 따옴표, 줄바꿈과 UTF-8 문자가 왕복 변환 후 보존된다.
- XML 원본과 생성 DB의 레코드 수, 샘플 값 및 checksum이 일치한다.

초기 변환이 끝난 뒤에는 XML 학습 데이터를 더 이상 편집하지 않고 CSV만 원본으로 사용한다. 기존 XML은 일정 기간 읽기 전용 백업으로 보존한 후 기능 동등성 검증이 끝나면 제거한다.

#### 5.4.7 Android 리소스와 데이터의 경계

정리 후 `strings.xml`에는 UI 문구만 남긴다.

```xml
<string name="app_name">JLPT Vocabulary</string>
<string name="study">학습</string>
<string name="quiz">퀴즈</string>
<string name="correct">정답입니다</string>
<string name="total_learned">학습 횟수: %1$d</string>
```

저장 위치를 다음처럼 명확히 구분한다.

| 데이터 | 저장 위치 |
|---|---|
| 버튼명, 안내문, 오류 메시지 등 UI 번역 | locale별 `strings.xml` |
| 단어, 한자, 예문, 발음 및 의미 | CSV 원본 → prepackaged Room DB |
| TTS, 자동 재생, BGM, 마지막 필터 | Preferences DataStore |
| 즐겨찾기, 항목별 진도, 오답 기록 | 사용자용 Room 테이블 |

#### 5.4.8 사용자 상태: Preferences DataStore 권장

- TTS/자동 재생/수면 모드/BGM
- 콘텐츠 유형별 마지막 필터
- 튜토리얼 표시 여부
- 누적 학습 횟수 및 리뷰 요청 플래그

즐겨찾기, 항목별 진도, 오답 기록을 추가한다면 그 상태는 Preferences가 아니라 별도 Room 테이블로 저장한다.

### 5.5 주요 화면

1. `HomeRoute`
   - 콘텐츠 유형별 학습/퀴즈 진입
   - TTS, 자동 재생, 수면 모드, BGM 설정
   - 숨겨진 보조 단어 처리 결정 반영

2. `StudyRoute(type)`
   - 공통 화면 하나를 콘텐츠 유형과 필터 정의로 구성
   - 카드 단계, TTS 재생, 자동 진행, 누적 횟수
   - 히라가나/가타카나 도움말

3. `QuizRoute(type)`
   - 공통 퀴즈 엔진
   - 질문 방향, 답변 수, 필터를 유형별 설정으로 주입
   - 점수와 정답/오답 피드백

4. `KanaChartDialog`
   - 초기에는 기존 이미지를 `Dialog`와 zoom 가능한 Compose 콘텐츠로 재사용
   - 후속으로 접근성 좋은 텍스트 문자표를 검토

## 6. 상세 구현 단계

### Phase 0. 기준선 고정 및 제품 결정

- 현재 작업 트리의 미커밋 변경을 별도 커밋/브랜치로 보존한다.
- 기존 앱의 주요 화면을 Phone 세로 화면, 라이트/다크, 각 언어로 캡처한다.
- 보조 단어 공개 여부, 문장 퀴즈 답변 수, 기존 설정 마이그레이션 여부를 결정한다.
- 기존 동작을 기준으로 기능 동등성 체크리스트를 확정한다.
- 깨진 기존 테스트를 제거하거나 현재 모델에 맞게 교체해 기준 빌드를 녹색으로 만든다.

완료 조건: 기존 앱의 debug APK 빌드와 최소 smoke test가 재현 가능하고, 제품 결정 3건이 기록돼 있다.

### Phase 1. 새 Compose 기반 구성

- Kotlin DSL과 Version Catalog를 사용하는 새 Gradle 구성 준비
- Compose, Material 3, Navigation Compose, Lifecycle, Coroutines, Room, DataStore 추가
- 단일 `MainActivity`와 앱 테마 생성
- Navigation graph와 빈 Home/Study/Quiz route 생성
- lint, unit test, Android test CI 명령 정의

완료 조건: 빈 앱이 minSdk 26 Phone에서 실행되고 라이트/다크, 시스템 back, 세로 화면 정책을 통과한다.

### Phase 2. 데이터 변환 파이프라인

- `items.csv`와 locale별 번역 CSV schema 및 안정 ID 규칙 확정
- 기존 XML 배열을 읽어 정규화 CSV를 생성하는 일회성 추출 도구 작성
- `all_*`이 세부 분류 배열의 합과 실제 레코드 단위로 같은지 확인한 뒤 중복 제거
- CSV를 입력받아 prepackaged SQLite DB를 생성하는 반복 실행 가능 도구 작성
- 병렬 배열 길이, 분류 합계, 필수 값, ID/번역 중복, 외래 키, locale 누락, UTF-8 왕복 변환과 checksum을 자동 검증
- Room entity, DAO, database, repository 구현
- Room schema export와 생성 DB open/migration test 구현
- 무작위 항목과 오답 후보를 효율적으로 가져오는 쿼리/정책 구현
- 데이터 수정 절차와 검증 명령을 `README`에 기록

완료 조건: 기존 수량(단어 6,883, 한자 5,632, 예문 2,147, 보조 단어 224)과 모든 분류 수량이 일치하고, XML → CSV → DB 왕복 검증 및 Room open test가 자동으로 통과한다.

### Phase 3. 설정과 홈 화면

- `StudySettings`와 콘텐츠별 마지막 필터를 DataStore로 저장
- 수면 모드 활성화 시 TTS/자동 재생을 유도하는 규칙 구현
- 홈 화면을 Material 3 기반 Phone 세로 레이아웃으로 구현
- TalkBack용 레이블, 48dp 이상 터치 영역, 글꼴 배율 대응
- 연속 두 번 뒤로가기 정책은 최신 back API로 구현하거나 일반 back 종료로 단순화할지 결정

완료 조건: 앱 재시작 후 설정이 복원되고 지원 Phone 해상도 및 큰 글꼴에서 조작 가능하다.

### Phase 4. 공통 학습 엔진과 화면

- 순수 Kotlin `StudySession`/reducer로 카드 상태 머신 구현
- `StudyViewModel`과 `StudyUiState` 구현
- 단어 유형부터 Compose 화면을 완성한 뒤 한자/예문 설정을 연결
- 반복 없는 셔플 백(shuffle bag) 또는 기존 완전 무작위 중 제품 결정을 적용
- lifecycle-aware 자동 재생 구현: 화면이 STARTED일 때만 타이머 동작
- TTS 초기화, 언어 미설치 안내, 중단/해제를 gateway로 분리
- BGM/효과음과 수면 모드 밝기 효과를 화면 수명주기에 맞게 처리
- 히라가나/가타카나 다이얼로그 구현

완료 조건: 세 콘텐츠 유형에서 수동/자동/수면 모드의 단계 전이가 기존 기준과 일치하며 백그라운드에서 TTS·타이머·BGM이 계속되지 않는다.

### Phase 5. 공통 퀴즈 엔진과 화면

- 정답 1개 + 고유 오답 후보 생성기를 순수 Kotlin으로 구현
- 점수 전이 `10 → 6 → 3 → 1`과 100점 milestone 구현
- 질문 방향 전환, 답변 잠금, 다음 문제 지연을 상태로 모델링
- 정답/오답 사운드와 애니메이션을 Compose로 구현
- 단어, 한자, 예문에 공통 엔진 연결
- 필요하면 보조 단어를 feature flag로 연결

완료 조건: 동일 후보 중복이 없고, 정답은 항상 하나이며, 연속 오답과 빠른 다중 탭에서도 점수와 다음 문제 전환이 정확하다.

### Phase 6. 배포 기능과 마이그레이션

- 최신 공식 Play In-App Update/Review API로 교체하고 호출 정책을 중앙화
- 기존 앱을 업데이트하는 경우 SharedPreferences → DataStore 일회성 마이그레이션 구현
- `applicationId`, 서명, versionCode, backup/data extraction 정책 확인
- 런처 외 컴포넌트 외부 노출 제거
- 필요하지 않은 INTERNET 권한과 제3자 라이브러리 제거
- R8 release 빌드와 baseline profile을 검토

완료 조건: 기존 설치 위 업그레이드 테스트에서 필요한 사용자 상태가 유지되고, release bundle 설치 및 핵심 흐름이 정상 동작한다.

### Phase 7. 안정화와 출시

- 지원 언어별 전체 화면 smoke test
- 지원 범위의 소형/대형 Phone 세로 화면, 다크 모드, 큰 글꼴, TalkBack 점검
- TTS 데이터 없음/지원 언어 없음/오디오 포커스 상실 시나리오 점검
- 프로세스 재생성과 기기 회전 시 세로 방향 유지 정책 테스트
- 성능 점검: cold start, DB 최초 복사, 쿼리, 메모리, APK/AAB 크기
- 개인정보/데이터 안전 양식과 스토어 설명 갱신
- 단계적 출시와 크래시/ANR 모니터링

완료 조건: 아래 테스트 게이트를 모두 통과하고 치명적/높은 심각도 결함이 없다.

## 7. 테스트 계획

### 7.1 단위 테스트

- 카드 단계 전이와 새 항목 선택
- 자동 재생 이벤트와 일시정지/재개
- 퀴즈 후보의 고유성 및 정답 포함 보장
- 오답 횟수별 점수와 milestone
- 필터별 repository 결과 수
- 수면 모드 설정 규칙
- locale fallback 규칙

### 7.2 데이터 테스트

- 원본 배열 길이와 분류 합계
- 변환 전후 필드 값 비교
- 모든 foreign key와 안정 ID
- 지원 언어별 누락/빈 번역 리포트
- Room migration test

### 7.3 Compose/UI 테스트

- 홈 → 학습/퀴즈 navigation
- 필터 전환과 복원
- 학습 카드 3단계 표시
- 정답/오답 후 버튼 상태와 점수 표시
- 설정 persistence
- 접근성 semantics와 content description

### 7.4 기기 테스트

- API 26부터 target SDK 기준 최신 API까지 Phone의 여러 화면 해상도와 밀도, 세로 화면
- 라이트/다크, 글꼴 1.0x/최대 배율
- 한국어/베트남어/미얀마어/기타 locale fallback
- TTS 엔진 있음/없음
- 백그라운드/포그라운드, 전화/오디오 포커스 이벤트

### 7.5 자동화 명령 예시

```text
./gradlew lintDebug testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew assembleRelease bundleRelease
```

CI에서는 PR마다 lint와 unit test를 실행하고, main 브랜치 또는 릴리스 후보에서 emulator UI test와 release bundle 빌드를 실행한다.

## 8. 기능 동등성 체크리스트

- [ ] 홈에서 단어/한자/예문 학습 및 퀴즈 진입
- [ ] 콘텐츠별 모든 필터와 수량 일치
- [ ] 카드의 일본어 → 의미 → 발음 → 다음 항목 흐름
- [ ] 일본어 및 현지어 TTS
- [ ] TTS 미설치 안내
- [ ] 4초 자동 재생과 백그라운드 중지
- [ ] 수면 모드 밝기/BGM/자동 재생
- [ ] 누적 학습 횟수 표시, 저장, 초기화
- [ ] 문자표 확대 보기
- [ ] 질문 방향 전환
- [ ] 고유 오답 후보와 점수 감소 규칙
- [ ] 정답/오답/클릭 효과음
- [ ] 100점 단위 축하 피드백
- [ ] Phone 세로 화면의 지원 해상도와 라이트/다크 테마
- [ ] ko/vi/my/default 언어 표시
- [ ] 업데이트 및 리뷰 흐름
- [ ] 기존 설치 업그레이드(해당 시)

## 9. 주요 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| XML 데이터 변환 시 인덱스 어긋남 | 잘못된 번역/발음 노출 | 수량, checksum, 샘플 대조를 자동화하고 원본을 보존 |
| 한 번에 전체 재작성 | 기능 누락 발견이 늦음 | 콘텐츠 유형 하나를 vertical slice로 완성 후 확장 |
| TTS/미디어 수명주기 오류 | 중복 재생, 누수, 백그라운드 재생 | gateway 분리, lifecycle-aware effect, 기기 테스트 |
| 기존 사용자 상태 손실 | 사용자 불만 | 필요한 키 목록 확정 후 DataStore migration test |
| Compose 도입과 신규 기능 동시 개발 | 일정과 디버깅 복잡도 증가 | 1차 출시는 기능 동등성에 집중 |
| 현재 미커밋 변경과 충돌 | 작업 유실 | 재구현 시작 전에 현재 변경을 커밋/브랜치로 보존 |

## 10. 권장 작업 순서와 예상 산출물

| 순서 | 산출물 |
|---:|---|
| 1 | 기능 동등성 표, 화면 캡처, 제품 결정 기록 |
| 2 | 새 Compose 앱 뼈대와 CI |
| 3 | XML → 정규화 데이터 → prepackaged Room DB 변환기 |
| 4 | Repository/DataStore 및 데이터 테스트 |
| 5 | Home + 단어 학습 vertical slice |
| 6 | 단어 퀴즈 vertical slice |
| 7 | 한자/예문 확장 및 보조 단어 결정 반영 |
| 8 | 수면 모드, TTS, BGM, 문자표 |
| 9 | 설정 마이그레이션, Play 기능, 보안 정리 |
| 10 | 접근성, 성능, 다국어, release 검증 |

가장 중요한 첫 구현 단위는 **홈 → 단어 학습 → 단어 퀴즈 → 설정 저장 → 프로세스 재생성 복원**까지 이어지는 vertical slice다. 이 흐름에서 아키텍처와 데이터 모델을 검증한 뒤 한자와 예문을 설정만 바꿔 재사용할 수 있어야 한다.

## 11. 구현 전 확정할 질문

1. 기존 앱과 같은 Play Store 앱으로 업데이트할 것인가, 별도 앱으로 출시할 것인가?
2. 현재 숨겨진 보조 단어 224개 기능을 공개할 것인가?
3. 기존의 완전 무작위 출제와 반복 없는 세션 중 어느 경험을 원하는가?
4. 문장 퀴즈의 답변 3개를 유지할 것인가, 다른 퀴즈처럼 4개로 통일할 것인가?
5. 학습 횟수와 필터만 이전하면 되는가, 신규 진도/오답/즐겨찾기까지 1차 범위에 넣을 것인가?
6. 기존 화면 스타일을 최대한 보존할 것인가, Material 3 기준으로 새 디자인을 적용할 것인가?

## 12. 분석 기준 파일

- 빌드/설정: `build.gradle`, `app/build.gradle`, `gradle.properties`
- 앱 진입/노출: `app/src/main/AndroidManifest.xml`
- 화면 동작: `app/src/main/java/com/teddapps/jlpt_voca_dict/FlashCard*Activity.java`
- 데이터: `app/src/main/res/values*/strings_words.xml`, `strings_kanjis.xml`, `strings_supp_sentences.xml`
- 화면: `app/src/main/res/layout*/*.xml`
- 미디어: `app/src/main/res/raw/*`
- 현재 테스트: `app/src/test`, `app/src/androidTest`

분석 시점의 작업 트리에는 빌드 설정, Manifest, 여러 Activity, 색상/Drawable 변경과 새 `data`, `model`, `util` 파일이 커밋되지 않은 상태로 존재했다. 이 문서는 그 변경을 수정하지 않고 현재 파일 내용을 기준으로 작성했다.
