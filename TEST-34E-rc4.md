# V0.34E-rc4 — 검증 보고서

## 통과

| 시험 | 결과 | 근거/범위 |
|---|---|---|
| Hosted/Standalone 빌드 및 JS/CSS 블록 | PASS | `node tools/build.mjs`, `node tests/test-build.mjs` |
| 보호 레거시 기준 해시 | PASS | C1H 원본 169블록 SHA256 변동 없음 (릴리스 변환 별개) |
| Snapshot/CSV V2 1,683열 | PASS | `node tests/test-csv.mjs` |
| RC3 → RC4 결정론·상태 직접 비교 | PASS | `node tests/test-e04-parity.cjs`: 150일, 10개 체크포인트; 수동 Snapshot 4회(초기1+연속3) |
| B3B → RC4 경량 비교 | PASS | `node tests/test-e04.cjs`: 60일, 주요 세계 상태 및 RNG; 수동/시나리오 Snapshot; 구 저장파일 수용 |
| PC·모바일 Standalone | PASS | `python tests/browser-e04-smoke.py`; JS 오류 0 |
| 로컬 A/B 도구 소형 저장 상태 | PASS | 30일×1회, B3B/RC4 교차 실행, 결과 JSON 다운로드, 상태/RNG/Snapshot 비교 |
| Snapshot 마이크로 반복 시험 | 관측 완료 | 180명 추가 합성세계, 5개 수동 Snapshot × 2회 교차; 반복 측정 변동 존재 |

## 미완료 / 제한 사항

- 실제 사용자 61년차 **135MB JSON은 개발 환경에 없음**. 동일 실물 상태의 RC3/RC4 최종 성능 개선율은 현 단계에서 알 수 없음.
- 장시간 180일 B3B/RC4 통합 회귀시험은 시간제한으로 완료하지 못했고, 60일 경량·150일 RC3 직접 비교로 범위를 나눠 검증했다.
- Node VM 인구 180~540 추가 합성세계에서 전체 SIM 개선율은 GC/JIT 변동에 민감해 일관된 속도 증가를 증명하지 못함. 개별 Snapshot 계측 개선은 전체 SIM 개선을 보장하지 않음.
- 실제 Hosted URL 브라우저 접근 테스트 미완료; 소스·구문·정적 빌드 검사만 PASS.
- 상태 지문이 모든 내부 필드를 포괄하는 것은 아님. 전쟁 활성 상태·다른 시드에서 장기 회귀 필요.

## 다음 PC 시험 권장

- 기준 파일: B3B 또는 RC3 독립 HTML, 후보: RC4 독립 HTML.
- 동일 원본 61년차 저장 상태, 60일, 2회 이상 교차 반복, Chrome.
- 개선율과 함께 `snapshotMs`, `macroMs`, `macroNonSnapshotMs`, `nonMacroMs`, `semanticRngAndSnapshotMatch` 확인.
