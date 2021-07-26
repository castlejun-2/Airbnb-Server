const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const messageDao = require("./messageDao");
const { Console } = require("winston/lib/winston/transports");

exports.retrieveAlarm = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const alarmResult = await messageDao.selectUserAlarm(connection, userId);
    connection.release();

    return alarmResult;
};