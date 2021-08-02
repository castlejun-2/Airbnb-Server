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
 * API Name : 회원의 이전 여행 기록 및 여행 예정 조회 미리보기 API
 * [GET] /app/travels
 */
 exports.getHistory = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const historyResult = await reservationProvider.retrieveTravelHistory(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, historyResult));
}

/**
 * API No. 3
 * API Name : 여행 예약 API
 * [GET] /app/reservations
 */
exports.travelReservation = async function (req,res) {

   const userIdFromJWT = req.verifiedToken.userId;
   const {roomId,startDate,lastDate,guestNum,payment} = req.body;
   
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
      userIdFromJWT,roomId,startDate,lastDate,guestNum,payment
   );
   
   return res.send(response(baseResponse.SUCCESS, signUpResponse));
}

/**
 * API No. 4
 * API Name : 거절된 예약 조회 API
 * [GET] /app/rejections
 */
exports.rejectReservation = async function (req,res) {

   const userIdFromJWT = req.verifiedToken.userId;

   const rejectByReservation = await reservationProvider.selectReject(userIdFromJWT);
   return res.send(response(baseResponse.SUCCESS, rejectByReservation));
}

/**
 * API No. 5
 * API Name : 자신의 숙소 예약 현황 조회 API
 * [GET] /app/hostreservations
 */
exports.hostReservation = async function (req,res) {

   const userIdFromJWT = req.verifiedToken.userId;

   const hostReservation = await reservationProvider.selectHostReservation(userIdFromJWT);
   return res.send(response(baseResponse.SUCCESS, hostReservation));
}

/**
 * API No. 25
 * API Name : 이전 예약 숙소 세부정보 확인 API
 * [GET] /app/last-reservation/:reservationid
 */
 exports.lastReservation = async function (req,res) {

    const userIdFromJWT = req.body.userId;
    const reservationId = req.params.reservationid;

    if (!reservationId)
        return res.send(response(baseResponse.RESERVATION_ID_EMPTY));

    const lastReservationResult = await reservationProvider.selectLastReservation(userIdFromJWT, reservationId);
    return res.send(response(baseResponse.SUCCESS, lastReservationResult));
 }