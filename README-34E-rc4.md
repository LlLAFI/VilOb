# Village Observer V0.34E-rc4 — Macro Cycle & Snapshot Hotpath

- 기준선: V0.34E-rc3 (V0.34D3B3B 호환)
- 상태: **내부 실험판**. 정식 V0.34E 출시 아님.
- 개발일: 2026-10-13

## 구현 변경

1. **Snapshot 중복 초기화 제거**: F5(가격)와 F5A(개척 재정) Snapshot 확장부의 `attach(w)`가 상위 레거시 초기화 연쇄를 다시 반복하던 경로를 제한했다. 대신 각 계층의 필수 `ensure(w)`/금융 상태 처리(`updateMonetary`), F5A 국가 통계 정규화를 같은 Snapshot 단계에서 수행한다. 상속된 하위 Snapshot 체인은 계속 기존 상태 갱신·연간 기록을 실행한다. 이는 `src/legacy/119.js` 및 `src/legacy/122.js`에 적용되는 **릴리스 변환**이며 기본 레거시 원본/원본 재구성은 불변이다.
2. **3일 주기 선택형 세부 계측**: 월드의 사회·이주·교역·폐허·이상 검사와 Settlement 유지보수·개발 함수를 E01 30일 프로파일러의 추가 선택 계측 대상으로 등록했다. 평상시 계측은 **OFF**, 사용자가 시작할 때만 임시 래퍼를 설치하며 종료 후 복구한다.
3. **로컬 A/B 비교 도구 E-04**: `tools/benchmark-local.html`에서 B3B 또는 RC3를 기준 버전으로 지정할 수 있다. 매일 `World.advanceOneDay()` 시간을 수집하고 3일 주기 처리일(`_v24Subday === 2`) 합계, 일반 날짜 합계, Snapshot 시간 및 Snapshot 제외 주기 처리시간을 분리한다. 두 버전의 상태 지문, RNG 호출과 Snapshot 호출 수를 비교한다. HTML과 세이브 파일은 로컬 브라우저에서만 처리한다.
4. **저장/버전 표기**: `V0.34E-rc4` 버전, 로컬 저장 키, 패치노트, 내보내기 파일명을 동기화하고 RC3/RC2/RC1/B3B 저장파일 가져오기를 허용한다.

## 변경하지 않은 것

- 3일 주기의 **실행 간격 자체**, 자동 Snapshot 호출 주기, 사람·식량·자원·Gold·무기·전투·AI·경제 밸런스는 변경하지 않았다.
- 기존 Snapshot 1,683열, Food Flow 48열, Devlog 인터페이스와 인게임 통계 UI를 유지한다.
- 거대한 `World.advanceOneDay` 전체의 레거시 재작성이나 3일 주기 시뮬레이션 로직 제거는 하지 않았다. 실제 계측 결과에 근거한 후속 작업으로 남긴다.

## 검증 및 해석

- RC3/RC4 **150일 직접 회귀**: 10회 중간점검 주요 국가·타일·주거·개척 상태, RNG 일치. Snapshot 국가별 결과와 같은 날짜 수동 Snapshot 반복 3회 시 RNG·주거/개척/재정 상태 일치.
- **60일 경량 합성 회귀**: 원본 B3B 대비 주요 상태/RNG 일치, 세이브 가져오기/복원, Food Flow CSV 생성.
- **정적·브라우저 시험**: Hosted/Standalone 빌드, 원본 레거시/CSV 스키마 검사 PASS. Chromium PC/모바일 Standalone 시작 및 프로파일러 패널 JS 오류 0. 로컬 비교 도구 30일 1회 JSON 내보내기와 상태·RNG 검사 PASS.
- **성능**: 별도 Snapshot 반복 테스트에서 후보가 대체로 빨랐으나 회차간 편차가 있으며 실제 61년차 135MB 저장파일로 확인하지 않았다. 작은 브라우저 저장 상태와 인구 추가 합성 월드의 전체 SIM A/B도 큰 편차가 있어, **일정한 전체 개선율은 아직 주장하지 않는다**.
- 전체 장시간 `npm test`, 60일×2회 대용량 로컬 A/B, Hosted 실제 URL 접속은 미완료.

## 61년차 동일 세이브 사용 방법

1. `benchmark-local.html`을 Chrome/Edge에서 열고 보유 중인 61년차 B3B 원본 세이브를 선택한다.
2. **기준 HTML 종류 = B3B** 선택, `index-B3B-baseline.html`과 이번 `index.html`(RC4)을 고른다.
3. 60일 × 2회 교차 실행 후 결과 JSON을 내보낸다. 상세 프로파일러는 끈 상태로 비교한다.
4. RC3 대비 순수 변경 효과를 알고 싶다면 **기준 HTML 종류 = RC3**으로 바꾸고 RC3의 독립 실행 `index.html`을 기준 HTML로 선택한다.
5. 비교 결과의 `macroNonSnapshotMedianMs`, `snapshotMedianMs`, `semanticRngAndSnapshotMatch`를 함께 확인한다.

**출시 판정:** RC4 내부 시험판. 실제 후기세계 SIM 시간 20~30% 단축 목표는 아직 미달/미확인. 다음 RC에서는 3일 처리 내 Person.act·직업 검토·물류 탐색의 추가 구조 최적화를 결정한다.
