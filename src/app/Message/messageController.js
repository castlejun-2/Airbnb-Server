const jwtMiddleware = require("../../../config/jwtMiddleware");
const messageProvider = require("../../app/Message/messageProvider");
const messageService = require("../../app/Message/messageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");

/**
 * API No. 1
 * API Name : 회원의 알람 조회 API
 * [GET] /app/alarms/:userId
 * path variable : userId
 */
 exports.getAlarm = async function (req, res) {
    const userId = req.params.userId;

    if(!userId)
       return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const alarmResult = await messageProvider.retrieveAlarm(userId);
    return res.send(alarmResult,baseResponse.SUCCESS);
}