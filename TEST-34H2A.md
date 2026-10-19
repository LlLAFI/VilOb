# V0.34H2A Hotfix Verification (2026-10-19)

| 검증 | 결과 | 범위 |
|---|---|---|
| 빌드 / 소스 보호 | PASS | 169 protected legacy blocks; SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` |
| `npm test` | PASS exit 0 | CI-bounded smoke 6검사, CSV 1683, H2A 재현/고아 링크 복구 |
| H2A 핵심 재현 | PASS | 두 타일 Settlement에서 옛 core를 소유권 해제, 새 core 재지정, 이후 분할 검토, ghost 재생성 방지 |
| H2 깨진 저장파일 모의 복구 | PASS | unowned+ACTIVE phantom link 한 건만 제거 및 기록, 물리 석재 보존, 재저장 후 정상 로드 |
| H2 ↔ H2A parity | PASS | 동일 H2 초기 저장과 RNG로 30일, 13개 주요 세계 상태 일치 |
| G5 30일 / 43 tech | PASS | 개별 30일 검사 및 주요 감사 |
| Chromium 4조합 | PASS | Standalone/Hosted generated assets × PC/Mobile, pageerror 0 |
| 전체 오래된 확장 테스트 | NOT COMPLETED | `test:extended` 일부 실행시간 제한, 장기 세이브 미검증 |
| 실제 GitHub Pages 실서버 | NOT CHECKED | 사용자 GitHub Desktop push 및 Actions 확인 필요 |
| 사용자의 실제 85년 Save | NOT PROVIDED | Devlog/CSV만 제공되어 파일 입력 복구는 synthetic-case 검증 |
| 석재 저장용량 경고 | OPEN | `st-0000356`, 별도 추적 |

원칙: UI 출력의 정상 여부만으로 엔진 회계 무결성 PASS를 주장하지 않음. 이번 수정에 의해 일반 30일 시뮬레이션 상태가 변하지 않는 것을 별도 대조로 확인함.
