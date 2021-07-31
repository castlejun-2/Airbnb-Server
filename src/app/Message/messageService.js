const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const messageProvider = require("./messageProvider");
const messageDao = require("./messageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.deleteAlarm = async function (userIdFromJWT, alarmId) {
    try {  
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteAlarmResult = await messageDao.deleteMyAlarm(connection, userIdFromJWT, alarmId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - edit Alarm Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}