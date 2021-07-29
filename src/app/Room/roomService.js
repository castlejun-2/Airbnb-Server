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

exports.createRoom = async function (hostId, typeId, name, description, roomImageUrl, country, city, emailAddress, price, checkIn, checkOut, bed, bathrooms, roomNumber, geustNumber) {
    try {
        // 이메일 중복 확인
        const emailRows = await roomProvider.emailCheck(emailAddress);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertRoomInfoParams = [hostId, typeId, name, description, roomImageUrl, country, city, emailAddress, price, checkIn, checkOut, bed, bathrooms, roomNumber, geustNumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const roomIdResult = await roomDao.insertRoomInfo(connection, insertRoomInfoParams);
        console.log(`추가된 방 : ${roomIdResult[0].insertId}`)
        connection.release();
        
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editRoom = async function (roomName, status) {
    try {
        console.log('Edit Room Name:', roomName);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomResult = await roomDao.updateRoomInfo(connection, roomName, status);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editRoomTitle = async function (roomName, updateName) {
    try {
        console.log('Edit Room Name:', roomName);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomTitleResult = await roomDao.updateRoomTitle(connection, roomName, updateName);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editRoomTitle Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }    
}