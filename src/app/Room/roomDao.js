// 모든 방 정보 조회
async function selectRoom(connection) {
  const selectRoomListQuery = `
                  SELECT name, country, city, price 
                  FROM RoomInfo;
                `;
  const [roomRows] = await connection.query(selectRoomListQuery);
  return roomRows;
}
// 방 생성
async function insertRoomInfo(connection, insertRoomInfoParams) {
  const insertRoomInfoQuery = `
        INSERT INTO RoomInfo(hostId, typeId, name, description, roomImageUrl, country, city, emailAddress, price, checkIn, checkOut, beds, bathrooms, roomNumber, guestNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const updateUserType = `
        INSERT INTO UserInfo(hostId, userType)
        VALUES (?, 2);
    `;
  const insertRoomInfoRow = await connection.query(
    insertRoomInfoQuery,
    insertRoomInfoParams,
    updateUserType
  );

  return insertRoomInfoRow;
}
//방 이름 조회
async function selectRoomName(connection, roomName) {
  const selectRoomEmailQuery = `
                SELECT name, country, city, emailAddress
                FROM RoomInfo 
                WHERE name = ?;
                `;
  const [emailRows] = await connection.query(selectRoomEmailQuery, roomName);
  return emailRows;
}
//방 이메일 조회
async function selectRoomEmail(connection, emailAddress) {
  const selectRoomEmailQuery = `
                SELECT name, emailAddress
                FROM RoomInfo 
                WHERE emailAddress = ?;
                `;
  const [emailRows] = await connection.query(selectRoomEmailQuery, emailAddress);
  return emailRows;
}
// 방 정보 조회(국가별)
async function selectCountry(connection, country) {
  const selectCountryQuery = `
                 SELECT id, name, description, roomImageUrl, country, city, price 
                 FROM RoomInfo 
                 WHERE country = ?;
                 `;
  const [roomRow] = await connection.query(selectCountryQuery, country);
  return roomRow;
}
module.exports = {
  selectRoom, insertRoomInfo, selectRoomName, selectRoomEmail, selectCountry
}