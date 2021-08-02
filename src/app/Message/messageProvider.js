const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const messageDao = require("./messageDao");
const { Console } = require("winston/lib/winston/transports");

exports.retrieveAlarm = async function (userIdFromJWT) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const alarmResult = await messageDao.selectUserAlarm(connection, userIdFromJWT);
        connection.release();

        return response(baseResponse.SUCCESS, alarmResult);
    } catch (err){
        logger.error(`App - AlarmInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};