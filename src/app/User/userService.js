const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const { Console } = require("console");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (phoneNumber, emailAddress, passwd, lastName, firstName, birthday) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(emailAddress);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(passwd)
            .digest("hex");
            
        const insertUserInfoParams = [phoneNumber, emailAddress, hashedPassword, lastName, firstName, birthday];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)

exports.postSignIn = async function (emailAddress, passwd) {
    try{
        // 아이디 여부 확인
        const idRows = await userProvider.retrieveUser(emailAddress);
        
        if (idRows.length < 1)
            return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectId = idRows.id;
        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(passwd)
            .digest("hex");

        const selectUserPasswordParams = [selectId, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if (passwordRows[0].passwd !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(emailAddress);
        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log('Login Id: ', userInfoRows[0].id); // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d", // 유효 기간 365일
                subject: "userInfo",
            } 
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userIdFromJWT, lastName, firstName, gender, birthday, emailAddress, phoneNumber) {
    try {
        console.log('Edit Id:', userId);
        const connection = await pool.getConnection(async (conn) => conn);
        const selectUserPasswordParams = [lastName, firstName, gender, birthday, emailAddress, phoneNumber, userIdFromJWT];
        const editUserResult = await userDao.updateUserInfo(connection, selectUserPasswordParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteUser = async function (userId) {
    try {  
        console.log('Delete Id: ',userId);
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteUserResult = await userDao.deleteUserInfo(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS,deleteUserResult);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
