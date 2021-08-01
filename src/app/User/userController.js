const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const jwt = require('jsonwebtoken');
const secret_config = require('../../../config/secret');
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");
const passport = require('passport');
const axios = require('axios');


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

 /**
 * API No. 23
 * API Name : 카카오 로그인 API
 * [POST] /app/users/kakao-login
 */
exports.kakaoLogin = async function (req, res){

    const {accessToken} = req.body; //값 확인을 위해 body로 token 값을 받아준다.
    if(!accessToken)
        return res.send(errResponse(baseResponse.ACCESS_TOKEN_EMPTY));

    try{
        let kakaoProfile; //값을 수정해주어야 하므로 const가 아닌 let 사용

        try{ //axios 모듈을 이용하여 Profile 정보를 가져온다.
            kakaoProfile = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            })
        } catch (err) {
            return res.send(errResponse(baseResponse.ACCESS_TOKEN_VERIFICATION_FAILURE));
        }
    const data = kakaoProfile.data.kakao_account;
    const name = data.profile.nickname;
    const email = data.email;
    const emailResult = await userProvider.emailCheck(email);

    if(emailResult[0]){ //유저를 확인 후 알림메시지와 함께 jwt token을 생성하여 client에게 전송

        let token = await jwt.sign ({
            userIdx : emailResult[0].id
        },
        secret_config.jwtsecret,
        {
            expiresIn : "365d",
            subject : "userInfo",
        }
        );
        return res.send(response(baseResponse.SUCCESS, {'userIdx' : emailResult[0].id, 'jwt' : token, 'message' : '소셜로그인 성공.'}));
    }
    else{
        const result = {
            name : name,
            email : email
        }
        return res.send(response(baseResponse.SUCCESS, {message : '회원가입이 가능 Email.', result}));
    }} catch (err){
        logger.error(`App - socialLogin Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

/**
 * API No. 24
 * API Name : 회원 프로필 수정 API
 * [POST] /app/users/kakao-login
 */
exports.patchUsersProfile = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userImageUrl = req.body.userImageUrl;
    const introduction = req.body.introduction;
    const address = req.body.address;
    const job = req.body.job;
    const language = req.body.language;

    const editUserProfileInfo = await userService.editUserProfile(userIdFromJWT, userImageUrl, introduction, address, job, language);
    return res.send(editUserProfileInfo);   
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {

    const userIdResult = req.verifiedToken.userId;
    
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
