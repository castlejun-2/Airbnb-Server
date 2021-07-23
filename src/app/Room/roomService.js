const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const roomProvider = require("./roomProvider");
const roomDao = require("./roomDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createRoom = async function (hostId, typeId, name, description, roomImageUrl, country, city, email, price, checkIn, checkOut, bed, bathrooms, roomNumber, geustNumber) {
    try {
        // 이메일 중복 확인
        const emailRows = await roomProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertRoomInfoParams = [hostId, typeId, name, description, roomImageUrl, country, city, email, price, checkIn, checkOut, bed, bathrooms, roomNumber, geustNumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const roomIdResult = await roomDao.insertRoomInfo(connection, insertRoomInfoParams);
        console.log(`추가된 회원 : ${roomIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};