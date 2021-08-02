async function selectUserTravelHistory(connection, userIdFromJWT) {
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
           concat(date_format(ur.startDate,'%Y년 %m월 %d일'),'~',date_format(ur.lastDate,'%Y년 %m월 %d일')) as '여행일자'
    from UserInfo ui,UserReservation ur,RoomInfo ri,
         (select ri.id,ui.nickName from UserInfo ui join RoomInfo ri on ui.id=ri.hostId) ho
    where ur.guestId = ui.id and ui.id = ? and ur.roomId = ri.id and ri.id=ho.id; 
    `;
    const [selectUserTravelHistoryRow] = await connection.query(selectUserTravelHistoryQuery, userIdFromJWT);
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
  WHERE (ur.startDate <= ? and ? <= ur.lastDate)
  or (ur.startDate <= ? and ? <= ur.lastDate);
  `;
  const [checkReservationRow] = await connection.query(checkReservationQuery, checkReservationParams);
    return checkReservationRow; 
}

async function selectRejectReservation(connection, userIdFromJWT) {
  const selectRejectReservationQuery = `
  select case
		    	when ur.status = 'REJECT' then '예약거절'
	       end as '구분',
         CONCAT(ri.country,'-',ri.city) as '위치',
         ho.nickname as '호스트',
         CONCAT(date_format(ur.startDate,'%Y-%m-%d'),'~',date_format(ur.lastDate,'%Y-%m-%d')) as '날짜'
  from UserInfo ui, UserReservation ur, RoomInfo ri,
  (select ri.id,ui.nickName from UserInfo ui join RoomInfo ri on ui.id = ri.hostId) ho
  where ui.id = ur.guestId and ur.roomId = ri.id and ui.id = ? and ur.status = 'REJECT' and ho.id = ri.id;
  `;
  const [selectRejectReservationRow] = await connection.query(selectRejectReservationQuery, userIdFromJWT);
  return selectRejectReservationRow;
}

async function selectHostRoomReservation(connection, userIdFromJWT) {
  const selectHostRoomReservationQuery = `
  select ui.nickname as '게스트닉네임',
	       ui.phoneNumber as '전화번호',
         ri.name as '예약 숙소',
         CONCAT(date_format(ur.startDate,'%Y-%m-%d'),'~',date_format(ur.lastDate,'%Y-%m-%d')) as '예약일자'
  from UserInfo ui, RoomInfo ri, UserReservation ur
  where ur.roomId = ri.id and ur.guestId = ui.id and ri.hostId = ui.id and ui.id = ?;
  `;
  const [selectHostRoomReservationRow] = await connection.query(selectHostRoomReservationQuery, userIdFromJWT);
  return selectHostRoomReservationRow;
}

async function selectLastReservation(connection, userIdFromJWT, reservationId) {
  const selectLastReservationQuery = `
  select ui.nickname as 'Host 닉네임',
	     ri.roomImageUrl as '숙소 Url',
       ri.name as '숙소 이름',
       ri.description as '숙소 소개',
       ri.price as '숙소 가격',
       rr.rules as '숙소 이용규칙',
       date_format(ur.startDate,'%Y년 %m월 %d일') as '여행 시작일',
       date_format(ur.lastDate,'%Y년 %m월 %d일') as '여행 종료일',
       concat(ur.guestNum,'명') as '게스트', 
       ur.id as '예약 번호',
       concat(ri.detailAddress,',',ri.city,',',ri.country) as '주소'
  From UserReservation ur
	  join RoomInfo ri on ri.id = ur.roomId
	  join UserInfo ui on ui.id = ri.hostId
    join RoomRules rr on rr.roomId = ri.id
  Where ur.guestId = ? and ur.id = ? and ur.status = 'ACTIVE';
  `;
  const [selectLastReservationRow] = await connection.query(selectLastReservationQuery, [userIdFromJWT, reservationId]);
  return selectLastReservationRow;
}
module.exports = {
    selectUserTravelHistory,
    insertReservation,
    checkReservation,
    selectRejectReservation,
    selectHostRoomReservation,
    selectLastReservation
}