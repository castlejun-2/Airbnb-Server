const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const reservationDao = require("./reservationDao");
const { Console } = require("winston/lib/winston/transports");

exports.retrieveTravelHistory = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userTravelHistoryResult = await reservationDao.selectUserTravelHistory(connection, userIdFromJWT);
    connection.release();
    
    return userTravelHistoryResult;
};

exports.reservationCheck = async function (checkReservationParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationCheckResult = await reservationDao.checkReservation(connection, checkReservationParams);
    connection.release();
    console.log(reservationCheckResult);
    console.log(reservationCheckResult[0]);
    return reservationCheckResult[0];
};

exports.selectReject = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const rejectReservationResult = await reservationDao.selectRejectReservation(connection, userIdFromJWT);
    connection.release();

    return rejectReservationResult;
}

exports.selectHostReservation = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostReservationResult = await reservationDao.selectHostRoomReservation(connection, userIdFromJWT);
    connection.release();

    return hostReservationResult;
}

exports.selectLastReservation = async function (userIdFromJWT,reservationId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const lastReservationResult = await reservationDao.selectLastReservation(connection, userIdFromJWT, reservationId);
    connection.release();

    return lastReservationResult;
}