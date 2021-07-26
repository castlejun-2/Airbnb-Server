const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const reservationDao = require("./reservationDao");
const { Console } = require("winston/lib/winston/transports");

exports.retrieveTravelHistory = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userTravelHistoryResult = await reservationDao.selectUserTravelHistory(connection, userId);
    connection.release();
    
    return userTravelHistoryResult;
};

exports.reservationCheck = async function (checkReservationParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationCheckResult = await reservationDao.checkReservation(connection, checkReservationParams);
    connection.release();
  
    return reservationCheckResult[0];
};

exports.selectReject = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const rejectReservationResult = await reservationDao.selectRejectReservation(connection, userId);
    connection.release(); 

    return rejectReservationResult;
}

exports.selectHostReservation = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostReservationResult = await reservationDao.selectHostRoomReservation(connection, userId);
    connection.release();

    return hostReservationResult;
}