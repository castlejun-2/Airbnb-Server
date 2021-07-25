const jwtMiddleware = require("../../../config/jwtMiddleware");
const wishListProvider = require("../../app/WishList/wishListProvider");
const wishListService = require("../../app/WishList/wishListService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { Console } = require("winston/lib/winston/transports");

/**
 * API No. 1
 * API Name : 회원 위시리스트 추가 API
 * [POST] /app/users/:userId/add-WishLists
 * path variable : userId
 * body : listName
 */
 exports.postWishList = async function (req, res) {
    const userId = req.params.userId;
    const listName = req.body.listName;

    if(!listName) 
        return res.send(errResponse(baseResponse.USER_WISHLIST_EMPTY));

    const addListName = await wishListService.addWishList(userId, listName);
    return res.send(addListName);
}

/**
 * API No. 2
 * API Name : 회원 위시리스트 목록 조회 API
 * [GET] /app/users/:userId/WishLists
 * path variable : userId
 */
exports.getWishList = async function (req, res) {
    const userId = req.params.userId;

    if(!userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const viewListName = await wishListProvider.retrieveWishList(userId);
    return res.send(viewListName);
}

/**
 * API No. 3
 * API Name : 회원 위시리스트 목록 속 방 조회 API
 * [GET] /app/:userId/WishListContents
 * path variable : userId
 */
exports.getListContent = async function (req, res) {
    const userId = req.params.userId;
    const listName = req.body.listName;

    if(!userId)
       return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if(!listName)
       return res.send(errResponse(baseResponse.USER_WISHLIST_EMPTY));
    
    const viewListContent = await wishListProvider.retrieveListContent(userId,listName);
    return res.send(viewListContent);
}