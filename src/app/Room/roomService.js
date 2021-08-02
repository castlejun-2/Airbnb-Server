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

exports.createRoom = async function (userIdFromJWT, typeId, roomTypePlusId, name, description, roomImageUrl, country, city, detailAddress, email, price, checkIn, checkOut, facility, bed, bathrooms, roomNumber, guestNumber) {
    try {
        // 이메일 중복 확인
        const emailRows = await roomProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertRoomInfoParams = [userIdFromJWT, typeId, roomTypePlusId, name, description, roomImageUrl, country, city, detailAddress, email, price, checkIn, checkOut, facility, bed, bathrooms, roomNumber, guestNumber];

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

exports.editDeleteRoom = async function (userIdFromJWT, roomId) {
    try {
        console.log('Edit Room Id:', roomId);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomResult = await roomDao.deleteRoomInfo(connection,userIdFromJWT, roomId);
        connection.release();

        return response(baseResponse.SUCCESS,editRoomResult);

    } catch (err) {
        logger.error(`App - editRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editStopRoom = async function (userIdFromJWT, roomId) {
    try {
        console.log('Edit Room Id:', roomId);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomResult = await roomDao.stopRoomInfo(connection,userIdFromJWT, roomId);
        connection.release();

        return response(baseResponse.SUCCESS,editRoomResult);

    } catch (err) {
        logger.error(`App - editRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editRestRoom = async function (userIdFromJWT, roomId) {
    try {
        console.log('Edit Room Id:', roomId);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomResult = await roomDao.restRoomInfo(connection,userIdFromJWT, roomId);
        connection.release();

        return response(baseResponse.SUCCESS,editRoomResult);

    } catch (err) {
        logger.error(`App - editRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editRoomTitle = async function (roomId, updateName) {
    try {
        console.log('Edit Room Name:', roomId);
        const connection = await pool.getConnection(async (conn) => conn);
        const editRoomTitleResult = await roomDao.updateRoomTitle(connection, roomId, updateName);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editRoomTitle Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }    
}