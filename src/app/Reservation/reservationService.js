const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reservationProvider = require("./reservationProvider");
const reservationDao = require("./reservationDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.signUpReservation = async function (guestId,roomId,startDate,lastDate,guestNum,payment) {
    try {
        const checkReservationParams = [roomId,startDate,startDate,lastDate,lastDate];
        const reservationRows = await reservationProvider.reservationCheck(checkReservationParams);
        if(reservationRows)
            return response(baseResponse.CHECK_RESERVATION_EXIST);

        const signUpReservationParams = [guestId,roomId,startDate,lastDate,guestNum,payment];
        const connection = await pool.getConnection(async (conn) => conn);

        const signUpReservationResult = await reservationDao.insertReservation(connection, signUpReservationParams);
        connection.release();
        
        return res.send(response(baseResponse.SUCCESS, signUpReservationResult));
    } catch (err) {
        logger.error(`App - createRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }    
};