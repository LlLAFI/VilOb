# V0.34D3B3A — Performance & Food Flow Regression Audit

**기준선:** V0.34D3B3 · **개발일:** 2026-10-13 · **범위:** 읽기 전용 회귀 계측/진단 및 경량 CSV. 기존 게임 밸런스·실제 생산/소비·군사 이동·AI·정착지 규칙 유지.

## 배경

사용자 PC 자연주행은 81년 1분기 13일까지 지속됐으며, 80년차 인구 1,123명/영토 217타일, 약 249ms SIM/일 및 약 2,848ms Wall/10일을 기록했습니다. B3는 약 600명 구간에서 B2보다 빠른 관측이 있지만, 다른 지도 시드/전쟁/주거지 구조이므로 전체 성능 개선율을 확정할 수 없습니다. 해당 81년 주행에서 B2 개척 식량비 감사는 V24 착공 280건·실물/계측 3,061/3,061으로 일치했습니다. 그럼에도 비교 가능한 Food Flow 구간 32,798개에서 미설명 잔차 629개(-565.610933 순잔차)가 있었고, Formation 제어권 재설정/동일 목표 변경 이벤트도 반복되었습니다.

## 패치 내용

1. **식량 이상 구간 CSV (경량):** 상단 기존 `Food Flow 30일 CSV` 옆에 `식량 이상 구간 CSV` 버튼을 추가했습니다. 폐쇄된 30일 관측 구간에서 구성 변경(`topologyChanged`)이 없고 미설명 식량 변화 절댓값이 0.01을 넘는 행만 내보냅니다. 21열로, 48열 전체 Food Flow는 기존대로 유지합니다. B3 81년 주행처럼 전체 파일이 15MB가 넘는 경우 별도 작은 이상 구간 파일을 제출할 수 있습니다.
2. **잔차 유형과 원인 후보:** `-0.9`, `-1.4`, `-2.8`, `-4.2`, `-10`, `-13` 패턴을 관측상 분류합니다. **숫자가 일치한다는 이유만으로 원인을 확정하거나, 가상 입출고를 추가해 수지를 보정하지 않습니다.** 양수/기타 음수도 그대로 보존합니다. Devlog의 `worldSummary.v034d3b3aAudit.food`에 건수·국가별 분포·큰 잔차 15건을 포함합니다.
3. **Formation 이벤트 감사:** 현재 남아 있는 상세 Telemetry 항목에서 같은 날짜·Formation·출발/도착 타일·사유를 가진 중복 `FORMATION_TARGET_CHANGED32D`의 수, 전후 철수↔평시 제어권 변경 이벤트 수를 집계합니다. `worldSummary.v034d3b3aAudit.formation`에만 추가하며 행동 제어 규칙이나 이동·군수물류는 변경하지 않습니다. 로그 압축된 과거 이벤트를 복원하거나 전체 누적 횟수라고 주장하지 않습니다.
4. **버전/저장/배포:** 새 저장 키 `village-observer-v034d3b3a`; B3/B2 및 선행 호환 D3 저장의 기존 마이그레이션 체인을 유지합니다. Standalone·Hosted와 좌상단·패치노트·Devlog·저장 버전을 일치시켰습니다. `save-validator.html`도 B3A 버전에서 반경2/최대13타일 조건을 적용합니다.

## 의도적으로 변경하지 않은 항목

- 식량 물리 재고·실제 개척 비용·상업 Gold·경제 수식·Person 식사·운송·전쟁·Formation 제어권·AI 판단·난수 사용.
- V0.34D3B3의 기존 멤버십/주민 인덱스/일괄 Food Flow 계측 최적화.
- C1H 원본 169개 블록의 SHA-256 (`89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`).
- 기존 Snapshot V2 **1,683열**, Food Flow **48열** 및 Settlement·Economy·Housing CSV 구조.

## 검증과 한계

- B2/B3/B3A 실제 Standalone을 **동일 합성 후기 상태**(13타일, 256명)로 구성한 핫패스 A/B/C 테스트에서는 B2 722.56ms, B3 187.70ms, B3A 185.45ms(각 8,000회 쌍 조회·4라운드 중간값). B3 개선 재현, B3A 추가 핫패스 회귀는 관측되지 않았습니다. **게임 전체 하루 처리시간이나 81년 사용자 PC 실행 속도로 환산하지 않습니다.**
- B3와 B3A는 같은 시드·초기 조건으로 18일 진행한 결과 6·12·18일 체크포인트에서 국가·자원 개괄과 RNG 호출 횟수(31,406회)가 일치했습니다.
- 원본 보호 소스·정적 빌드·B1 병합·B2 개척 10/13·B3 캐시 무효화·B3A 잔차/Formation 진단·PC/모바일 Standalone/Hosted 브라우저 테스트는 PASS. 장시간 전체 `npm test` 실행은 200초 제한에 걸려 최종 전체 완료를 확인하지 못했고, 테스트 기록에서 구분해 기재합니다.
- **잔차 629개의 실제 원인을 모두 수정한 패치는 아닙니다.** 81년 장기 주행 재현/해결, Formation 재설정 자체의 원인 수정, 75년 동일 PC 통제 실험도 후속 과제입니다.

## 개발자 비교 실행

```bash
VILOB_B2_BASELINE=/path/to/B2/index.html VILOB_B3_BASELINE=/path/to/B3/index.html node tests/benchmark-b3a.cjs
VILOB_B3_BASELINE=/path/to/B3/index.html node tests/compare-b3-b3a.cjs
node tests/test-d3b3a.cjs
python tests/browser-d3b3a-smoke.py
```
