# Village Observer — V0.34E-rc5

**날짜:** 2026-10-14  
**기준선:** V0.34E-rc4h  
**유형:** 내부 실험판 / 결정론 우선 성능·관측 패치  
**패치명:** Macro Cycle Instrumentation & Warmed A/B

## 구현 사항

1. **독립 예열형 로컬 A/B 벤치마크**: `tools/benchmark-local.html` / 배포본 `benchmark-local.html`. 선택한 각 HTML에서 원본 세이브를 불러와 별도 세계로 0/6/12/24일 예열하고 버린 후, PRNG 시드를 재설정한 뒤 원본 세이브를 다시 불러와 측정한다. 예열 전후 시작 지문이 달라지면 실패 처리한다. 1~5회 교차반복, 회차별 대응 개선율, 3일 주기·비주기·Snapshot 비용 및 상태/RNG/Snapshot 결과 비교를 제공한다. 원본 저장파일은 로컬 브라우저 밖으로 보내지 않는다.
2. **Macro Cycle 단계별 선택형 계측**: `src/legacy/034.js`의 캘린더 `dailyDemography24`와 3일 주기 레거시 `advance23`를 선택형 프로파일러에 별도 라벨 `calendar.demography` / `macro.legacyCore`로 기록한다. 계측을 켜지 않으면 시간 측정이 실행되지 않는다.
3. **노동 탐색 중복 조회 최소화**: `src/legacy/040.js`의 건축가 직업 판단에서 매 후보 타일마다 프로젝트를 선형 조회하던 코드를 단일 직업 판단 범위의 Set 조회로 변경. 직업 유효성 검토에서 중복된 `w.map.get` 조회를 제거. 캐시를 세계나 하루를 넘어 유지하지 않는다.
4. **결정론 보존**: RC4h의 F5/F5A Snapshot `attachWorld` 호출·캐시 무효화, 3일 경제 주기, 15일 자동 Snapshot 및 기존 사람/경제/전쟁/식량/Gold 규칙을 그대로 유지한다. AIProfile 호환 계측 자체가 상태를 변경하므로 해당 호출 횟수를 변경하는 안은 철회했다.

## 실제 측정 현황

- 합성 후기세계(61년 설정, 주민 추가 360명, 24일 × 3회, 계측 OFF): RC4h **96.371ms/일**, RC5 **96.544ms/일**, 변화 **-0.18%**. RNG·상태 일치. 현재 RC5의 추가 SIM 개선이 입증된 것은 아니다.
- 브라우저의 작은 세이브에서 RC5 자체를 양쪽에 넣고 6일 예열 후 30일 시험: 지문·RNG·Snapshot 비교 **PASS**. 같은 코드끼리 0.61% 측정 차이 존재. 이는 소규모 측정 오차를 보여준다.
- 실제 61년차 135MB 세계에서의 RC4h↔RC5 추가 개선은 사용자 PC에서 측정해야 한다.

## 파일과 실행

- 독립 실행: `dist/standalone/index.html` (별도 `index-standalone.html` 사본)
- GitHub Pages/Hosted: 저장소 루트 `index.html` + `dist/hosted/`
- A/B: `tools/benchmark-local.html` (배포 단독 파일 `benchmark-local.html`)
- B3B/RC4h 비교 원본 HTML은 배포 패키지에 함께 포함.

## 알려진 범위 제한

- 현재 지문은 광범위한 상태를 검사하지만 모든 숨은 내부 캐시까지 검사하지는 않는다.
- 브라우저 예열은 JIT/GC/메모리 압박을 완전히 통제하지 못한다. 짝수/홀수 회차를 교차하고 3~5회 측정을 권장한다.
- 100년 자연주행에서 발견된 델마 국지적 아사, 라엔 주거 압박, 식량 Flow 잔차, 국제 Gold 집중은 **이번 패치에서 변경하지 않는다**.
- 60년 이상 장시간 자연주행 및 실제 사용자 61년차 세이브 전체 SIM A/B는 이 환경에서 미완료다.
