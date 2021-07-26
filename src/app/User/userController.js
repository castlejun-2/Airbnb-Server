const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
     return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 12
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: userId, userImageUrl, passwd, nickName, firstName, lastName, address, phoneNumber, emailAddress, userType, gender, birtyday
     */
    const {userId, userImageUrl, passwd, nickName, firstName, lastName, address, phoneNumber, emailAddress, gender, birthday} = req.body;

    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    // 비밀번호 길이 체크
    if (passwd.length < 6 || passwd.length > 30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(emailAddress))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 빈 값 체크
    if (!nickName)
        return res.send(response(baseResponse.USER_NICKNAME_EMPTY));

    // 빈 값 체크
    if (!firstName)
        return res.send(response(baseResponse.USER_FIRSTNAME_EMPTY));
    
    // 빈 값 체크
    if (!lastName)
        return res.send(response(baseResponse.USER_LASTNAME_EMPTY));

    // 빈 값 체크
    if (!address)
        return res.send(response(baseResponse.USER_ADDRESS_EMPTY));
        
    // 빈 값 체크
    if (!phoneNumber)
        return res.send(response(baseResponse.USER_PHONENUMBER_EMPTY));
        
    // 빈 값 체크
    if (!gender)
        return res.send(response(baseResponse.USER_GENDER_EMPTY));

    // 빈 값 체크
    if (!birthday)
        return res.send(response(baseResponse.USER_BIRTHDAY_EMPTY));    
    
    const signUpResponse = await userService.createUser(
        userId, userImageUrl, passwd, nickName, firstName, lastName, address, phoneNumber, emailAddress, gender, birthday
    );

    return res.send(signUpResponse);
};

/**
 * API No. 13
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {
    /**
     * Query String: email
     */
    const emailAddress = req.query.emailAddress;

    if (!emailAddress) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(emailAddress);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 14
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {
    
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 15
 * API Name : 로그인 API
 * [POST] /app/login
 * body : userId, passsword
 */
exports.login = async function (req, res) {
    const {userId, passwd} = req.body;
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    // 비밀번호 길이 체크
    if (passwd.length < 6 || passwd.length > 30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); 
    
    const signInResponse = await userService.postSignIn(userId, passwd);

    return res.send(signInResponse);
};


/**
 * API No. 16
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId/profile
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if (!nickname)
            return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname);
        return res.send(editUserInfo);
    }
};
/**
 * API No. 17
 * API Name : 회원 탈퇴 API
 * [POST] /app/users/:userId/withdrawal
 * path variable : userId
 */
 exports.deleteUsers = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const deleteUserInfo = await userService.deleteUser(userId);
        return res.send(deleteUserInfo);
    }
 }

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
