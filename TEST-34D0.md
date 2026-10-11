# V0.34D0 검증 보고서

검증 대상: V0.34C1H 원본 대비 V0.34D0. 소스 전환 및 CSV 스키마 변경이며 시뮬레이션 규칙 변경은 없음.

## 통과

| 테스트 | 결과 |
|---|---|
| C1H 원본 165개 JS / 4개 CSS 재조립 | PASS: SHA-256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` 일치 |
| 단독 JS 구문 | PASS: 166개 script |
| Hosted 태그 정적 구성 | PASS: 166개 script, 4개 stylesheet |
| CSV V2 | PASS: 1,683열, 고유 헤더 1,683개, 중복 이름 72개 해결 |
| 새 세계 Snapshot CSV Legacy/V2 | PASS: 값과 행 순서 동일, 두 형식의 기존 행·열 검증 통과 |
| PC·모바일 뷰포트 Chromium 메모리 로딩 | PASS: JS 오류 없음, 헤더 D0, 패치노트 최신 121개, CSV V2 버튼 있음 |
| D0 저장/불러오기 | PASS: D0 직렬화→역직렬화→D0 버전 재직렬화, 전용 LocalStorage 키 경유 |
| C1H vs D0, 8일 자연주행, 계측 OFF | PASS: 일별 물리 상태 SHA, 이벤트, RNG 호출 일치 |
| C1H vs D0, 8일 자연주행, 계측 ON | PASS: 일별 물리 상태 SHA, 이벤트, RNG 호출 일치 |
| 유지보수 정산 직접 비교, ON / OFF | PASS: 각각 분기 정산 3회, 물리 상태 및 RNG 일치 |

## 제한 및 후속 검증

- **96일 연속 결정론 비교는 시간 초과**로 완료하지 못했습니다. 장기 무결성 통과를 주장하지 않습니다.
- 이 환경 Chromium은 로컬 HTTP 및 file URL에 대한 직접 탐색을 차단했습니다. 그래서 Hosted 네트워크 로딩과 실제 GitHub Pages의 HTTP 동작은 미검증입니다. 코드블록·파일 경로·존재 여부·해시 등 정적 검증을 수행했으며, 독립형 HTML은 Chromium에 메모리 로딩해 테스트했습니다.
- 실제 스마트폰/태블릿 장치에서의 터치, 스크롤, 3배속 Wall, 대규모 전투 부하는 사용자 장치에서 추가 확인해야 합니다.
- 이 결과는 사용자의 61년 실제 세이브 JSON 기반 검증이 아닙니다. 실제 게임 상태는 JSON/CSV 내보내기만으로 완전히 재개할 수 없으므로 별도 SaveData를 사용한 검증이 남습니다.

## 재현 명령

```bash
npm run build
npm test
# 실제 장기 비교용 (시간이 충분한 실행환경에서)
VILOB_LONG=1 node tests/test-determinism.cjs
```
