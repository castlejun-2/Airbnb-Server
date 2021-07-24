const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 방 생성 (회원가입) API
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
 * API No. 2
 * API Name : 방 정보 조회 API (+ 방 이름 검색 조회)
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
 * API No. 3
 * API Name : 특정 방 조회 API (+국가를 통한 조회)
 * [GET] /app/rooms/{country}
 */
 exports.getRoomByCountry = async function (req, res) {

    /**
     * Path Variable: country
     */
    const country = req.params.country;

    if (!country) return res.send(errResponse(baseResponse.SIGNUP_ROOM_NOT_REGISTER));

    const roomByCountry = await roomProvider.retrieveRoom(country);
    return res.send(response(baseResponse.SUCCESS, roomByCountry));
};