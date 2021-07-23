const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");



/**
 * API No. 1
 * API Name : 방 정보 조회 API (+ 방 이름 검색 조회)
 * [GET] /app/rooms
 */
exports.getRooms = async function (req, res) {
    /**
     * Query String: email
     */
    const roomName = req.query.roomName;
    if (!roomName) {
        // 유저 전체 조회
        const roomListResult = await roomProvider.retrieveRoomList();
        return res.send(response(baseResponse.SUCCESS, roomListResult));
    } else {
        // 유저 검색 조회
        const roomListByEmail = await roomProvider.retrieveRoomList(roomName);
        return res.send(response(baseResponse.SUCCESS, roomListByEmail));
    }
};