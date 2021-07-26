const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 6
 * API Name : 숙소 생성 (회원가입) API
 * [POST] /app/rooms
 */
 exports.postRooms = async function (req, res) {

    /**
     * Body: hostId,typeId,name,description,roomImageUrl,Country,City,email,price,checkIn,checkOut,bed,bathrooms,roomNumber,guestNumber
     */
    const {hostId, typeId, name, description, roomImageUrl, country, city, email, price, checkIn, checkOut, bed, bathrooms, roomNumber, guestNumber} = req.body;

    // 빈 값 체크
    if (!hostId)
        return res.send(response(baseResponse.ROOM_HOSTID_EMPTY));

    // 방의 종류 빈 값 체크
    if (!typeId)
        return res.send(response(baseResponse.SINGUP_ROOMTYPE_EMPTY));    
    
    // 방 이름 빈 값 체크
    if (!name)
        return res.send(response(baseResponse.ROOM_ROOMNAME_EMPTY));

    // 방 국가 빈 값 체크
    if (!country)
        return res.send(response(baseResponse.ROOM_ROOMCOUNTRY_EMPTY));

    // 방 도시 빈 값 체크
    if (!city)
        return res.send(response(baseResponse.ROOM_ROOMCITY_EMPTY));    

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 방 가격 값 체크
    if (!price)
        return res.send(response(baseResponse.ROOM_ROOMCITY_EMPTY)); 

    // 방 최대 인원 체크
    if (!guestNumber)
        return res.send(response(baseResponse.ROOM_ROOMCITY_EMPTY));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const signUpResponse = await roomService.createRoom(
        hostId, typeId, name, description, roomImageUrl, country, city, email, price, checkIn, checkOut, bed, bathrooms, roomNumber, guestNumber
    );

    return res.send(signUpResponse);
};

/**
 * API No. 7
 * API Name : 숙소 정보 조회 API (+ 방 이름 검색 조회)
 * [GET] /app/rooms
 */
exports.getRooms = async function (req, res) {
    /**
     * Query String: roomName
     */
    const roomName = req.query.roomName;
    if (!roomName) {
        // 방 전체 조회
        const roomListResult = await roomProvider.retrieveRoomList();
        return res.send(response(baseResponse.SUCCESS, roomListResult));
    } else {
        // 방 검색 조회
        const roomListByEmail = await roomProvider.retrieveRoomList(roomName);
        return res.send(response(baseResponse.SUCCESS, roomListByEmail));
    }
};

/**
 * API No. 8
 * API Name : 특정 숙소 조회 API (+국가를 통한 조회)
 * [GET] /app/rooms/:country
 */
 exports.getRoomByCountry = async function (req, res) {

    /**
     * Path Variable: country
     */
    const country = req.params.country;

    if (!country)
        return res.send(errResponse(baseResponse.SIGNUP_ROOM_NOT_REGISTER));

    const roomByCountry = await roomProvider.retrieveRoom(country);
    return res.send(response(baseResponse.SUCCESS, roomByCountry));
};

/**
 * API No. 9
 * API Name : 숙소 규칙 조회 API (+국가를 통한 조회)
 * [GET] /app/roomrule/:roomName
 */
exports.getRoomRules = async function (req, res) {

    /**
     * Path Variable: roomName
     */
    const roomName = req.params.roomName;

    if (!roomName) 
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));
    
    const roomRules = await roomProvider.retrieveRoomRule(roomName);
    return res.send(response(baseResponse.SUCCESS, roomRules));    
}

/**
 * API No. 10
 * API Name : 자신이 등록한 숙소 조회 API
 * [GET] /app/hostrooms/:userId
 */
exports.getMyRoom = async function (req, res) {
    
    const userId = req.params.userId;
    
    if (!userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const myRoom = await roomProvider.retrieveMyRoom(userId);
    return res.send(response(baseResponse.SUCCESS, myRoom));
}

/**
 * API No. 11
 * API Name : 숙소 상태 변경 API
 * [PATCH] /app/rooms/:roomName/withdrawal
 */
exports.updateRoom = async function (req, res) {

    const roomName = req.params.roomName;
    const status = req.query.status;

    if (!roomName)
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));

    if (!status)
        return res.send(errResponse(baseResponse.SIGNUP_STATUS_EMPTY));

    const editRoomInfo = await roomService.editRoom(roomName, status);
    return res.send(editRoomInfo);
    
};