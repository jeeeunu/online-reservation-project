# online-reservation-projectn

nest/typeORM 공연 예매 사이트<br>

---

## 관련문서

erd: https://www.erdcloud.com/d/WGACsLzEWKF9eTqDB<br>

---

## 개발 기간

23.07.24 ~ 23.08.02<br>

---

## 개발환경

-nest/typescript<br>
-mysql<br>
-typeORM<br>

---

## 주요기능

### 회원가입/로그인 (user)

-jwt: jwt토큰 생성<br>
-cookie/cookie-parser: jwt토큰 저장<br>
-bcrypt: 비밀번호 암호화/해싱 -어드민 계정은 isAdmin 컬럼으로 관리<br>

### 공연등록

-auth.middleware를 통해 admin 사용자만 공연을 등록할 수 있도록 설정<br>
-performance에 기본 공연 정보 저장, performanceDetail 테이블 별도로 생성해, 각 공연 파트별 공연 날짜,시간을 별도로 저장해서 관리(-일대다)<br>

### 온라인 예매

-좌석 지정 후 온라인 예매<br>
