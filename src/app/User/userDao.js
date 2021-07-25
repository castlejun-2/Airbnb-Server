// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userId, nickname, emailAddress 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, emailAddress) {
  const selectUserEmailQuery = `
                SELECT userId, nickName, emailAddress 
                FROM UserInfo 
                WHERE emailAddress = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, emailAddress);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT userId, emailAddress, nickName 
                 FROM UserInfo 
                 WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(userId, userImageUrl, passwd, nickName, firstName, lastName, address, phoneNumber, emailAddress, gender, birthday)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userId, nickname, passwd
        FROM UserInfo 
        WHERE userId = ? AND passwd = ?;
        `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userId) {
  const selectUserAccountQuery = `
        SELECT userId, status
        FROM UserInfo 
        WHERE userId = ?;
        `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userId
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, userId, nickName) {
  const updateUserQuery = `
        UPDATE UserInfo 
        SET nickName = ?
        WHERE userId = ?;
  `;
  const updateUserRow = await connection.query(updateUserQuery, [nickName, userId]);
  return updateUserRow[0];
}

async function deleteUserInfo(connection, userId) {
  const deleteUserQuery = `
        UPDATE UserInfo
        SET status = 'DELETE'
        WHERE userId = ?;
  `;
  const deleteUserRow = await connection.query(deleteUserQuery, userId);
  return deleteUserRow[0];
}

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
module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  deleteUserInfo,
  selectUserTravelHistory
};
