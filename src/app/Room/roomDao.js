// 모든 방 정보 조회
async function selectRoom(connection) {
  const selectRoomListQuery = `
                  SELECT name, country, ciry, price 
                  FROM RoomInfo;
                `;
  const [roomRows] = await connection.query(selectRoomListQuery);
  return roomRows;
}

module.exports = {
  selectRoom,
}