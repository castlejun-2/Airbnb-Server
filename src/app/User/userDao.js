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
                SELECT id, nickName, emailAddress 
                FROM UserInfo 
                WHERE emailAddress = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, emailAddress);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, emailAddress) {
  const selectUserIdQuery = `
                 SELECT id, emailAddress, nickName 
                 FROM UserInfo 
                 WHERE emailAddress = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, emailAddress);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(phoneNumber, emailAddress, passwd, lastName, firstName, birthday)
        VALUES (?, ?, ?, ?, ?, ?);
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
        SELECT id, nickname, passwd
        FROM UserInfo
        WHERE id = ? AND passwd = ?;
        `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
  return selectUserPasswordRow[0];
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, emailAddress) {
  const selectUserAccountQuery = `
        SELECT id, status
        FROM UserInfo 
        WHERE emailAddress = ?;
        `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      emailAddress
  );
  return selectUserAccountRow[0];
}

//회원 정보 수정
async function updateUserInfo(connection, selectUserParams) {
  const updateUserQuery = `
        UPDATE UserInfo 
        SET lastName = ?, firstName = ?, gender = ?, birthday = ?, emailAddress = ?, phoneNumber = ?
        WHERE id = ?;
  `;
  const updateUserRow = await connection.query(updateUserQuery, selectUserParams);
  return updateUserRow[0];
}

//회원 삭제
async function deleteUserInfo(connection, userId) {
  const selectUserQuery = `
        SELECT emailAddress
        FROM UserInfo
        where id = ?;
  `;
  const deleteUserQuery = `
        UPDATE UserInfo
        SET status = 'DELETE'
        WHERE id = ?;
  `;
  const selectUserRow = await connection.query(selectUserQuery, userId);
  const deleteUserRow = await connection.query(deleteUserQuery, userId);
  return selectUserRow[0];
}

//회원 정보 수정
async function updateUserProfileInfo(connection, selectUserParams) {
  const updateUserQuery = `
        UPDATE UserInfo 
        SET userImageUrl = ?, introduction = ?, address = ?, job = ?, language = ?
        WHERE id = ?;
  `;
  const updateUserRow = await connection.query(updateUserQuery, selectUserParams);
  return updateUserRow[0];
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
  updateUserProfileInfo
};
