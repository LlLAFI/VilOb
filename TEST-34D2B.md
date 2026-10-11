# V0.34D2B — 검증 결과 (2026-10-11)

## 통과

- 원본 보호: 레거시 코드/스타일 169개, 기준선 원본 SHA 일치, JS 빌드·문법 검사 PASS
- Hosted/Standalone 생성, Snapshot CSV V2 1,683열·Settlement CSV 48열·Housing CSV 11열 유지
- `node tests/test-d2b.cjs`: 120일 동일 조건 2회, 물리 상태·난수 소비 일치, D2A 주거 감사 PASS
- `node tests/test-d2b-focus.cjs`: 2타일 15명·주거 40명분, 기존 누적 Person 주거 스트레스 감소, V0.28 실시간 주거 압박 0명, 동일 Settlement 내부 이주 0건, 이주 후보 12건 제외, `PROJECT_CAP` 누적 진단 1건
- PC/모바일 Chromium: 버전 표시, 저장·복원, 11열 Housing CSV 및 UI, JavaScript `pageerror` 0건

## 미통과 또는 미완료

- 370일 및 1,250일 고정 시드 반복 실행은 일부 시나리오에서 장시간 진행 중단으로 완결하지 못함. 중단 구간은 시드에 따라 달랐으며 D2A 비교 테스트에서도 유사 현상을 확인했음. 정확한 원인 및 D2B 특유의 영향은 미확정.
- 60~75년 사용자 자연주행, 고밀도 다중 Settlement, 전쟁 중 점령·병합 후 주거 및 장시간 성능 미검증.
- `UNRESOLVED_*` 계열은 실제 하위 거절 게이트를 확보하지 못한 경우이며 세부 원인을 추측하지 않음.

판정: **핵심 기능 구현 및 단기 회귀 PASS; D2B 장기 안정성은 검증 보류. D2 전체 CLOSED 아님.**
