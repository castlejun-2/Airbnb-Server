module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SINGUP_ROOMTYPE_EMPTY : { "isSuccess": false,"code":5015, "message":"방의 유형을 입력해주세요."},

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 5022, "message": "nickname을 설정해주세요." },
    USER_FIRSTNAME_EMPTY : { "isSuccess": false, "code": 5023, "message": "이름을 입력해주세요." },
    USER_LASTNAME_EMPTY : { "isSuccess": false, "code": 5024, "message": "성을 입력해주세요." },
    USER_ADDRESS_EMPTY : { "isSuccess": false, "code": 5025, "message": "주소를 입력해주세요." },
    USER_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 5026, "message": "핸드폰 번호를 입력해주세요." },
    USER_GENDER_EMPTY : { "isSuccess": false, "code": 5027, "message": "성별을 입력해주세요." },
    USER_BIRTHDAY_EMPTY : { "isSuccess": false, "code": 5028, "message": "생일을 입력해주세요." },
    ROOM_HOSTID_EMPTY : { "isSuccess": false, "code": 5021, "message": "room의 hostId를 입력해주세요." },
    ROOM_ROOMNAME_EMPTY : { "isSuccess": false, "code": 5016, "message": "방의 이름을 입력해주세요." },
    ROOM_ROOMCOUNTRY_EMPTY : { "isSuccess": false, "code": 5017, "message": "방이 위치한 국가를 입력해주세요." },
    ROOM_ROOMCITY_EMPTY : { "isSuccess": false, "code": 5018, "message": "방이 위치한 도시를 입력해주세요." },
    ROOM_ROOMPRICE_EMPTY : { "isSuccess": false, "code": 5019, "message": "방이 가격을 입력해주세요." },
    ROOM_ROOMGUESTNUMBER_EMPTY : { "isSuccess": false, "code": 5020, "message": "방의 최대 인원을 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // Response error
    SIGNUP_USER_NOT_REGISTER : { "isSuccess:": false, "code": 5029, "message":"존재하지 않는 회원입니다."},
    SIGNUP_ROOM_NOT_REGISTER : { "isSuccess:": false, "code": 5030, "message":"유형에 맞는 방이 존재하지 않습니다."},
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
