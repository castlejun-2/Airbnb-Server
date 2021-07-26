async function selectUserTravelHistory(connection, userId) {
    const selectUserTravelHistoryQuery = `
    select case
                  when startDate > CURRENT_DATE
                    then '예정된 여행'
                    else '이전 여행지'
              end as 구분,
             ri.roomImageUrl as '숙소사진',
             ri.country as '나라',
           ri.city as '도시',
           ho.nickName as '숙소 Host',
           ur.startDate as '시작일자',
           ur.lastDate as '종료일자'
          from UserInfo ui,UserReservation ur,RoomInfo ri,
          (select ri.id,ui.nickName from UserInfo ui join RoomInfo ri on ui.id=ri.hostId) ho
          where ur.guestId = ui.id and ui.id = ? and ur.roomId = ri.id and ri.id=ho.id; 
    `;
    const [selectUserTravelHistoryRow] = await connection.query(selectUserTravelHistoryQuery, userId);
    return selectUserTravelHistoryRow;
}

async function insertReservation(connection, signUpReservationParams) {
  const insertReservationQuery = `
        INSERT INTO UserReservation(guestId,roomId,startDate,lastDate,guestNum,payment)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
  const insertReservationfoRow = await connection.query(
    insertReservationQuery,
    signUpReservationParams,
  );

  return insertReservationfoRow;
}

async function checkReservation(connection, checkReservationParams) {
  const checkReservationQuery = `
  SELECT ur.id
  FROM UserReservation ur join RoomInfo ri on ur.roomId=ri.id and ri.id = ?
  WHERE (ur.startDate < ? and ? < ur.lastDate)
  or (ur.startDate < ? and ? < ur.lastDate);
  `;
  const [checkReservationRow] = await connection.query(checkReservationQuery, checkReservationParams);
    return checkReservationRow; 
}

async function selectRejectReservation(connection, userId) {
  const selectRejectReservationQuery = `
  select case
		    	when ur.status = 'REJECT' then '예약거절'
	       end as '구분',
         CONCAT(ri.country,'-',ri.city) as '위치',
         ho.nickname as '호스트',
         CONCAT(date_format(ur.startDate,'%Y-%m-%d'),'~',date_format(ur.lastDate,'%Y-%m-%d')) as '날짜'
  from UserInfo ui, UserReservation ur, RoomInfo ri,
  (select ri.id,ui.nickName from UserInfo ui join RoomInfo ri on ui.id = ri.hostId) ho
  where ui.id = ur.guestId and ur.roomId = ri.id and ui.userId = ? and ur.status = 'REJECT' and ho.id = ri.id;
  `;
  const [selectRejectReservationRow] = await connection.query(selectRejectReservationQuery,userId);
  return selectRejectReservationRow;
}

async function selectHostRoomReservation(connection,userId) {
  const selectHostRoomReservationQuery = `
  select ui.nickname as '게스트닉네임',
	       ui.phoneNumber as '전화번호',
         ri.name as '예약 숙소',
         CONCAT(date_format(ur.startDate,'%Y-%m-%d'),'~',date_format(ur.lastDate,'%Y-%m-%d')) as '예약일자'
  from UserInfo ui, RoomInfo ri, UserReservation ur
  where ur.roomId = ri.id and ur.guestId = ui.id and ri.hostId = ui.id and ui.userId = ?;
  `;
  const [selectHostRoomReservationRow] = await connection.query(selectHostRoomReservationQuery,userId);
  return selectHostRoomReservationRow;
}
module.exports = {
    selectUserTravelHistory,
    insertReservation,
    checkReservation,
    selectRejectReservation,
    selectHostRoomReservation
}