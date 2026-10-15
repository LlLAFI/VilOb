# V0.34F1A1 검증 보고서

## 범위

V0.34F1A로부터 CSV 출력 형식·버전/저장 호환·로컬 A/B 검증 툴만 변경. **세계 모델 불변**이 패스 기준.

## 검증 결과

| 테스트 | 결과 | 비고 |
|---|---|---|
| C1H 원본 169개 소스 보호 해시 | PASS | `tools/build.mjs --check-only` |
| Standalone/Hosted JS 포함 | PASS | 각각 186 scripts |
| Snapshot CSV V2 1,683열 | PASS | 기존 CSV 동작 유지 |
| F1 ↔ F1A 동일 시드 90일 | PASS | 상태/RNG 동일, F1A 계측 검증 |
| F1A ↔ F1A1 동일 시드 90일 | PASS | 상태/RNG 동일 |
| Food Flow 신규 CSV | PASS | 52열, 1행당 1레코드, CRLF |
| 식량 이상 CSV | PASS | 13열, 행 수/헤더 정상 |
| CSV 특수문자 escaping | PASS | 쉼표, 큰따옴표, 실제 줄바꿈 |
| 물리 식량·점령 장부 | PASS | D3 감사, 공동 재고 점령 제한 유지 |
| 이전 F1A 세이브 F1A1 읽기 | PASS | 자체 F1A1 세이브 복원도 통과 |
| PC(1440×900)/모바일(390×844) Chromium | PASS | 0 JS pageerror, 버전 표시 |
| 로컬 비교 도구 브라우저 동작 | PASS | 소형 F1 저장파일 선택→두 HTML 30일→RNG/지문 일치→결과 JSON 다운로드 |
| 사용자 35년 세이브 직접 대조 | 미실시 | 원본 세이브는 사용자 PC에만 있음 |
| 150년 PC ×10 성능 목표 | 미실시 | 60년·114년 기존 실물 기록은 F1A1 목표 검증과 별개 |

## 재현 명령

```
npm run build
npm run test:static
F1A1_DAYS=180 node tests/test-f1a1.cjs
python tools/browser-f1a1-smoke.py
```

브라우저 테스트는 `/usr/bin/chromium`와 Playwright가 있는 환경에서 `set_content`를 사용했음. 정상 로컬 파일 브라우저에서의 `file://` 실행은 사용자 PC에서 재확인할 필요가 있음.

## 결정론 시험의 해석

`test-f1a1.cjs`는 두 독립 VM을 동일 난수 상태에서 초기화하고 30일 간격으로 세계 핵심 직렬화 상태와 RNG 호출 수를 비교한다. 저장 호환성 테스트에서는 **월드 복원 직후의 비직렬화 캐시나 별도 초기화 난수 호출 때문에** 라이브 월드와 복원 월드의 JSON 문자를 그대로 비교하지 않는다. 저장 불러오기 및 물리 감사에 초점을 둔다.

브라우저 로컬 도구는 World 생성·복원에 사용하는 초기 조건을 통제하고, 두 버전에서 실제 다운로드된 HTML을 로딩한다. 결과 JSON은 양 버전 실제 버전 문자열·세계 지문·RNG 호출·인구·시간 측정이 포함되지만 인게임 ×10의 평활 SIM/BATCH 자체는 아니다.
