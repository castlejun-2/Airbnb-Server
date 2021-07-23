// 모든 방 정보 조회
async function selectRoom(connection) {
  const selectRoomListQuery = `
                  SELECT name, country, city, price 
                  FROM RoomInfo;
                `;
  const [roomRows] = await connection.query(selectRoomListQuery);
  return roomRows;
}
// 유저 생성
async function insertRoomInfo(connection, insertRoomInfoParams) {
  const insertRoomInfoQuery = `
        INSERT INTO RoomInfo(hostId, typeId, name, description, roomImageUrl, country, city, emailAddress, price, checkIn, checkOut, beds, bathrooms, roomNumber, guestNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const insertRoomInfoRow = await connection.query(
    insertRoomInfoQuery,
    insertRoomInfoParams
  );

  return insertRoomInfoRow;
}
//방 이메일 조회
async function selectRoomEmail(connection, email) {
  const selectRoomEmailQuery = `
                SELECT name, emailAddress
                FROM RoomInfo 
                WHERE emailAddress = ?;
                `;
  const [emailRows] = await connection.query(selectRoomEmailQuery, email);
  return emailRows;
}
module.exports = {
  selectRoom, insertRoomInfo, selectRoomEmail
}