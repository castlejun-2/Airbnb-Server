module.exports = function(app){
    const wishList = require('./wishListController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 18. 위시리스트 추가 API
    app.post('/app/users/:userId/wishLists', wishList.postWishList);

    // 19. 위시리스트 목록 조회 API
    app.get('/app/users/:userId/wishLists', wishList.getWishList);

    // 20. 위시리스트 카테고리별 방 조회 API
    app.get('/app/users/:userId/wishLists/contents', wishList.getListContent);
};