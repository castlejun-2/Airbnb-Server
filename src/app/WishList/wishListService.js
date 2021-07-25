const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const wishListProvider = require("./wishListProvider");
const wishListDao = require("./wishListDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const { Console } = require("console");

//위시리스트 목록 추가
exports.addWishList = async function (userId, listName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addlistnameResult = await wishListDao.addWishListName(connection, userId, listName);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}