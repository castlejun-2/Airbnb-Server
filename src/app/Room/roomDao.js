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
//방 규칙 조회
async function selectRoomRule(connection, roomName) {
  const selectRoomRuleQuery = `
        select ri.name as '숙소 이름',
               rr.checkIn as 'check-in',
               rr.checkout as 'check-out',
               rr.rules as '숙소이용규칙'
        from RoomRules rr, RoomInfo ri
        where rr.roomId=ri.Id and ri.name = ?;
        `;
  const selectRoomRuleRow = await connection.query(selectRoomRuleQuery, roomName);
  return selectRoomRuleRow;      
}
//자신이 등록한 숙소 조회
async function selectMyRoom(connection, userId) {
  const selectMyRoomQuery = `
        select ui.nickname as '방의 호스트',
	             case
			            when ri.status='ACTIVE' then '운영 중'
			            when ri.status='REGISTER' then '등록 중'
               end as '운영 상태',
               ri.roomImageURL as '숙소 사진',
               ri.name as '숙소 이름'
        from RoomInfo ri,UserInfo ui
        where ri.hostId = ui.Id and ui.userId = ?;
  `;
  const [selectMyRoomRow] = await connection.query(selectMyRoomQuery, userId);
  return selectMyRoomRow;
}
module.exports = {
  selectRoom,
  insertRoomInfo,
  selectRoomName,
  selectRoomEmail,
  selectCountry,
  selectRoomRule,
  selectMyRoom
}