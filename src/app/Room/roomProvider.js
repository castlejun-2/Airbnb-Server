const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const roomDao = require("./roomDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRoomList = async function (roomName) {
  if (!roomName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoom(connection);
    connection.release();

    return roomListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomName(connection, roomName);
    connection.release();

    return roomListResult;
  }
};

exports.retrieveRoom = async function (country) {
  const connection = await pool.getConnection(async (conn) => conn);
  const roomResult = await roomDao.selectCountry(connection, country);

  connection.release();

  if(!roomResult[0])
     return errResponse(baseResponse.SIGNUP_ROOM_NOT_REGISTER);
  else
     return roomResult;
};

exports.retrieveRoomRule = async function (roomName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const rulesResult = await roomDao.selectRoomRule(connection, roomName);

  connection.release();

  return rulesResult[0];
};

exports.retrieveMyRoom = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myRoomResult = await roomDao.selectMyRoom(connection, userId);
  
  connection.release();

  return myRoomResult;
};
exports.emailCheck = async function (emailAddress) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await roomDao.selectRoomEmail(connection, emailAddress);
  connection.release();

  return emailCheckResult;
};