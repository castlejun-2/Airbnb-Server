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
 * [GET] /app/alarms
 */
 exports.getAlarm = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const alarmResult = await messageProvider.retrieveAlarm(userIdFromJWT);
    return res.send(alarmResult);
}

/**
 * API No. 13
 * API Name : 알람 삭제 API
 * [POST] /app/alarms/withdrawal
 * body : alarmId
 */
 exports.deleteAlarm = async function (req, res) {

   const userIdFromJWT = req.verifiedToken.userId;
   const alarmId = req.body.alarmId;

   if(!alarmId)
      return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
   
   const deleteAlarmInfo = await messageService.deleteAlarm(userIdFromJWT, alarmId);
       return res.send(deleteAlarmInfo);
}