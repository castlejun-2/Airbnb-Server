module.exports = function(app){
    const wishList = require('./wishListController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 위시리스트 추가 API
    app.post('/app/users/:userId/add-WishLists', wishList.postWishList);

    // 2. 위시리스트 목록 조회 API
    app.get('/app/users/:userId/WishLists', wishList.getWishList);

    // 3. 위시리스트 카테고리별 방 조회 API
    app.get('/app/users/:userId/WishLists/Contents', wishList.getListContent);
};