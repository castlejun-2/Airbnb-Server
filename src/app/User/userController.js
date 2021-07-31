const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");

/**
 * API No. 12
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: phoneNumber, emailAddress, passwd, lastName, firstName, birthday
     */
    const {phoneNumber, emailAddress, passwd, lastName, firstName, birthday} = req.body;

    // 핸드폰 번호 빈 값 체크
    if (!phoneNumber)
        return res.send(response(baseResponse.USER_PHONENUMBER_EMPTY));

    // 비밀번호 길이 체크
    if (passwd.length < 6 || passwd.length > 30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(emailAddress))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 이름 빈 값 체크
    if (!firstName)
        return res.send(response(baseResponse.USER_FIRSTNAME_EMPTY));
    
    // 성 빈 값 체크
    if (!lastName)
        return res.send(response(baseResponse.USER_LASTNAME_EMPTY));

    // 생일 빈 값 체크
    if (!birthday)
        return res.send(response(baseResponse.USER_BIRTHDAY_EMPTY));    
    
    const signUpResponse = await userService.createUser(
        phoneNumber, emailAddress, passwd, lastName, firstName, birthday
    );

    return res.send(signUpResponse);
};

/**
 * API No. 15
 * API Name : 로그인 API
 * [POST] /app/login
 * body : emailAddress, passsword
 */
exports.login = async function (req, res) {

    const {emailAddress, passwd} = req.body;
    // 빈 값 체크
    if (!emailAddress)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

    // 비밀번호 길이 체크
    if (passwd.length < 6 || passwd.length > 30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); 
    const signInResponse = await userService.postSignIn(emailAddress, passwd);

    return res.send(signInResponse);
};


/**
 * API No. 16
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/profile
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const emailAddress = req.body.emailAddress;
    const phoneNumber = req.body.phoneNumber;

    if (!lastName)
        return res.send(errResponse(baseResponse.USER_LASTNAME_EMPTY));

    if (!firstName)
        return res.send(errResponse(baseResponse.USER_FIRSTNAME_EMPTY));

    if (!gender)
        return res.send(errResponse(baseResponse.USER_GENDER_EMPTY));

    if (!birthday)
        return res.send(errResponse(baseResponse.USER_BIRTHDAY_EMPTY));

    if (!emailAddress)
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY));

    if (!phoneNumber)
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));

    const editUserInfo = await userService.editUser(userIdFromJWT, lastName, firstName, gender, birthday, emailAddress, phoneNumber);
    return res.send(editUserInfo);   
};
/**
 * API No. 17
 * API Name : 회원 탈퇴 API
 * [POST] /app/users/withdrawal
 */
 exports.deleteUsers = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId

    const deleteUserInfo = await userService.deleteUser(userIdFromJWT);
        return res.send(deleteUserInfo);
 }

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {

    const userIdResult = req.verifiedToken.userId;
    
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
