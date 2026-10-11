# V0.34D2 시험 결과

## 자동시험

- `npm test` — **PASS**: 원본 C1H 169개 블록 SHA-256 불변, 169개의 Standalone `<script>`와 Hosted 실행 순서, JS 문법, CSV V2 헤더 1,683개 고유성, Legacy ↔ CSV V2 행값 동일성.
- D2 전용 `tests/test-d2.cjs` — **PASS**: 기술별 슬롯 단계 3/4/5/7/9/11, 신축·토지정비·주택 개축·상업 특화 공사 공동 카운트, 빈 슬롯이 0일 때 착공 거부.
- 같은 Settlement로 수동 결합한 2타일 fixture — **PASS**: 물리적 타일 주택 용량의 통합, 거주지 기록 이동 없이 불필요한 추가 주택 착공 거부, V29 내부 직장 경로 비용 0.
- D2 읽기 전용 집계 — **PASS**: Person 직업·거주/근무 참조 및 RNG 소비 무변동. 현재 버전 저장·복원 후 D2 감사 통과.
- 같은 고정 시간·난수 시드의 D2 세계 두 개, 120일 전진 — **PASS**: 실제 직렬화 결과(실측 성능 타이머만 제외) 일치, RNG 호출 수 일치, 장기 전진 후 Settlement·Person 감사 0건.
- D1A `Settlement CSV` 48열 및 D0 Snapshot CSV V2 1,683열 보존 확인.

## Chromium 브라우저

`python tests/browser-smoke.py`: 데스크톱 1365×850 + 모바일 390×844 — **PASS**. 버전/패치노트 표시, 지도 타일 D2 공동 주거 정보, 기존 D1A 노동 정보, Housing CSV 버튼·11열, 저장·복원, 콘솔 JS pageerror 0건. 외부 HTTP/실제 GitHub Pages 네트워크 로딩 테스트는 이 환경에서 수행하지 않음.

## 해석 유의사항

- D2는 D1A와 달리 실제 건설·주거 결정이 바뀌므로 D1A에 대한 75년 결정론 비교를 합격 조건으로 사용할 수 없음.
- 초기 120일 시험은 **장기 성능·경제 안정성 보증이 아님**. 1년 빠른 점검 후 60~75년 자연주행을 권장.
- 신규 Settlement Housing CSV는 D1A 48열 원본을 변경하지 않고 병행 제공함.
