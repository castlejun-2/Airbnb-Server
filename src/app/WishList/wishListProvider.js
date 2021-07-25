const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const wishListDao = require("./wishListDao");
const { Console } = require("winston/lib/winston/transports");

//위시리스트 목록 조회
exports.retrieveWishList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userWishListResult = await wishListDao.selectUserWishList(connection, userId);
    connection.release();
    if(!userWishListResult)
       return errResponse(baseResponse.SIGNUP_WISHLIST_NOT_REGISTER);
    else
       return userWishListResult;
  }

//위시리스트 목록 속 숙소 조회
exports.retrieveListContent = async function (userId, listName) {
   const connection = await pool.getConnection(async (conn) => conn);
   const userListContentResult = await wishListDao.selectUserListContent(connection, userId, listName);
   connection.release();
  
   if(!userListContentResult)
      return errResponse(baseResponse.SIGNUP_LISTCONTENT_NOT_REGISTER);
   else
      return userListContentResult;
 }