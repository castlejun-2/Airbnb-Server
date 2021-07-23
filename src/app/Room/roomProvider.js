const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
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