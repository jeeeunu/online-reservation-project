# online-reservation-projectn

온라인 공연 예매 사이트<br>

---

## 관련 문서

erd: https://www.erdcloud.com/d/WGACsLzEWKF9eTqDB<br>

---

## REST API

| Content        | Method | path                                              |
| -------------- | ------ | ------------------------------------------------- |
| 회원가입       | POST   | '/user'                                           |
| 로그인         | POST   | '/auth/login'                                     |
| 프로필 보기    | GET    | '/user/:user_id'                                  |
| 공연 등록      | POST   | '/performance'                                    |
| 전체 공연 보기 | GET    | '/performance'                                    |
| 공연 검색하기  | GET    | '/performance/search?performanceName='공연 이름'' |
| 공연 상세보기  | GET    | '/performance/detail/:perf_id'                    |
| 공연 예매하기  | POST   | '/reservation/:perf_id'                           |
| 공연 예매현황  | GET    | '/reservation'                                    |

---

## 개발 기간

23.07.24 ~ 23.08.02<br>

---

## 개발환경

-nest/typescript<br>
-mysql<br>
-typeORM<br>

---

## 주요 기능

### 회원가입/로그인 (user)

-jwt: jwt토큰 생성<br>
-cookie/cookie-parser: jwt토큰 저장<br>
-bcrypt: 비밀번호 암호화/해싱 -어드민 계정은 isAdmin 컬럼으로 관리<br>

### 공연 등록

-auth.middleware를 통해 admin 사용자만 공연을 등록할 수 있도록 설정<br>
-performance에 기본 공연 정보 저장, performanceDetail 테이블 별도로 생성해, 각 공연 파트별 공연 날짜,시간을 별도로 저장해서 관리(-일대다)<br>

### 온라인 예매

-좌석 지정 후 온라인 예매<br>  
-좌석 중복예매 방지 위해 Seat 테이블에 seat_reservaion 컬럼 추가해 예매 등록여부 확인 후 진행하도록 함<br>
-예매 트랜잭션 실행시에 Seat 데이터에 lock 을 걸어 둘 이상의 유저가 예매를 진행 할 수 없도록 함<br>
