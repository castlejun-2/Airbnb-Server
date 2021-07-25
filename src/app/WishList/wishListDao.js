async function addWishListName(connection, userId, listname) {
    const addWishListNameQuery = `
    INSERT INTO WishCategory(userInfoId, listName)
          VALUES (?, ?);
    `;
    const addWishListNameRow = await connection.query(addWishListNameQuery, [userId, listname]);
    return addWishListNameRow;
}
  
async function selectUserWishList(connection, userId) {
   const selectUserWishListQuery = `
         SELECT id, userInfoId, listName
         FROM WishCategory
         WHERE userInfoId = ?;
   `;
   const [selectUserWishListRow] = await connection.query(selectUserWishListQuery, userId);
   return selectUserWishListRow;
}
  
async function selectUserListContent(connection, userId, listName) {
   const selectUserListContentQuery = `
   SELECT ri.roomImageUrl as '숙소 사진 주소',
          cLn as 'WishList 이름',
          rt.name as '숙소 유형',
          ri.beds as '침대 갯수',
          ri.name as '숙소 이름',
          ri.price as '숙소 가격'
   FROM (SELECT wl.roomId as roomId,cLn FROM (SELECT wc.id as cId,wc.listName as cLn
             FROM WishCategory wc, UserInfo ui
             WHERE ui.id = wc.userInfoId and ui.id = ?) ln, WishList wl
         WHERE ln.cId = wl.categoryId and ln.cLn = ?) t, RoomInfo ri, RoomType rt
   WHERE t.roomId = ri.id and ri.typeId = rt.id;
   `;
    
    const [selectUserListContentRow] = await connection.query(selectUserListContentQuery, [userId, listName]);
    return selectUserListContentRow;
 }
 module.exports = {
   addWishListName,
   selectUserWishList,
   selectUserListContent
 };