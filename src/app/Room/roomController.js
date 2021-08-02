const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 6
 * API Name : 숙소 생성 API
 * [POST] /app/rooms
 */
 exports.postRooms = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    /**
     * Body: typeId,name,description,roomImageUrl,Country,City,detailAddress,email,price,checkIn,checkOut,facility,bed,bathrooms,roomNumber,guestNumber
     */
    const {typeId, roomTypePlusId, name, description, roomImageUrl, country, city, detailAddress, email, price, checkIn, checkOut, facility, bed, bathrooms, roomNumber, guestNumber} = req.body;

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

    // 세부 주소 체크
    if (!detailAddress)
        return res.send(response(baseResponse.ROOM_ROOMDETAILADDRESS_EMPTY));    

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 방 가격 값 체크
    if (!price)
        return res.send(response(baseResponse.ROOM_ROOMPRICE_EMPTY)); 

    // 방 최대 인원 체크
    if (!guestNumber)
        return res.send(response(baseResponse.ROOM_ROOMGUESTNUMBER_EMPTY));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const signUpResponse = await roomService.createRoom(
        userIdFromJWT, typeId, roomTypePlusId, name, description, roomImageUrl, country, city, detailAddress, email, price, checkIn, checkOut, facility, bed, bathrooms, roomNumber, guestNumber
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
        return res.send(errResponse(baseResponse.SINGUP_COUNTRY_NOT_EXIST));

    const roomByCountry = await roomProvider.retrieveRoom(country);
    return res.send(response(baseResponse.SUCCESS, roomByCountry));
};

/**
 * API No. 9
 * API Name : 숙소 규칙 조회 API (+국가를 통한 조회)
 * [GET] /app/room-rules/:roomid
 */
exports.getRoomRules = async function (req, res) {

    /**
     * Path Variable: roomid
     */
    const roomId = req.params.roomid;

    if (!roomId) 
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));
    
    const roomRules = await roomProvider.retrieveRoomRule(roomId);
    return res.send(response(baseResponse.SUCCESS, roomRules));    
}

/**
 * API No. 10
 * API Name : 자신이 등록한 숙소 조회 API
 * [GET] /app/host-rooms
 */
exports.getMyRoom = async function (req, res) {
    
    const userIdFromJWT = req.verifiedToken.userId;

    const myRoom = await roomProvider.retrieveMyRoom(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, myRoom));
}

/**
 * API No. 11
 * API Name : 숙소 상태 변경 API (삭제))
 * [PATCH] /app/rooms/:roomid/withdrawal
 */
exports.deleteRoom = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomid;

    if (!roomId)
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));

    const deleteRoomInfo = await roomService.editDeleteRoom(userIdFromJWT, roomId);
    return res.send(deleteRoomInfo);
    
};

/**
 * API No. 14
 * API Name : 숙소 정보 변경 API (이름)
 * [PATCH] /app/rooms/:roomid/title
 */
 exports.updateTitle = async function (req,res) {

    const roomId = req.params.roomid;
    const updateName = req.body;

    if (!roomId)
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));

    if (!updateName)
        return res.send(errResponse(baseResponse.SINGUP_UPDATEROOMNAME_EMPTY));

    const editRoomName = await roomService.editRoomTitle(roomId, updateName);
    return res.send(editRoomName);
}

/**
 * API No. 21
 * API Name : 숙소 상태 변경 API (운영정지)
 * [PATCH] /app/rooms/:roomid/stop
 */
 exports.stopRoom = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomid;

    if (!roomId)
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));

    const stopRoomInfo = await roomService.editStopRoom(userIdFromJWT, roomId);
    return res.send(stopRoomInfo);
    
};

/**
 * API No. 22
 * API Name : 숙소 상태 변경 API (휴식모드)
 * [PATCH] /app/rooms/:roomid/rest
 */
 exports.restRoom = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomid;

    if (!roomId)
        return res.send(errResponse(baseResponse.SIGNUP_ROOMNAME_EMPTY));

    const restRoomInfo = await roomService.editRestRoom(userIdFromJWT, roomId);
    return res.send(restRoomInfo);
    
};

