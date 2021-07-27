const jwtMiddleware = require("../../../config/jwtMiddleware");
const reservationProvider = require("../../app/Reservation/reservationProvider");
const reservationService = require("../../app/Reservation/reservationService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");

/**
 * API No. 2
 * API Name : 회원의 이전 여행 기록 및 여행 예정 조회 API
 * [GET] /app/travels/:userId
 * path variable : userId
 */
 exports.getHistory = async function (req, res) {
    const userId = req.params.userId;

    if(!userId)
       return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const historyResult = await reservationProvider.retrieveTravelHistory(userId);
    return res.send(response(baseResponse.SUCCESS, historyResult));
}

/**
 * API No. 3
 * API Name : 여행 예약 API
 * [GET] /app/reservations/:userId
 * path variable : userId
 */
exports.travelReservation = async function (req,res) {
   const guestId = req.params.userId;
   const {roomId,startDate,lastDate,guestNum,payment} = req.body;

   if (!guestId)
       return res.send(response(baseResponse.ROOM_HOSTID_EMPTY));
   
   if (!roomId)
       return res.send(response(baseResponse.ROOM_ROOMNAME_EMPTY));

   if (!startDate)
       return res.send(response(baseResponse.RESERVATION_STARTDATE_EMPTY));

   if (!lastDate)
       return res.send(response(baseResponse.RESERVATION_LASTDATE_EMPTY));

   if (!guestNum)
       return res.send(response(baseResponse.RESERVATION_GUESTNUM_EMPTY));

   if (!payment)
       return res.send(response(baseResponse.USER_PAYMENT_EMPTY));

   const signUpResponse = await reservationService.signUpReservation(
      guestId,roomId,startDate,lastDate,guestNum,payment
   );
   
   return res.send(response(baseResponse.SUCCESS, signUpResponse));
}

/**
 * API No. 4
 * API Name : 거절된 예약 조회 API
 * [GET] /app/rejections/:userId
 * path variable : userId
 */
exports.rejectReservation = async function (req,res) {
   const userId = req.params.userId;

   if (!userId)
      return res.send(response(baseResponse.ROOM_HOSTID_EMPTY));

   const rejectByReservation = await reservationProvider.selectReject(userId);
   return res.send(response(baseResponse.SUCCESS, rejectByReservation));
}

/**
 * API No. 5
 * API Name : 자신의 숙소 예약 현황 조회 API
 * [GET] /app/hostreservations/:userId
 * path variable : userId
 */
exports.hostReservation = async function (req,res) {
   const userId = req.params.userId;

   if (!userId)
      return res.send(response(baseResponse.ROOM_HOSTID_EMPTY));

   const hostReservation = await reservationProvider.selectHostReservation(userId);
   return res.send(response(baseResponse.SUCCESS, hostReservation));
}