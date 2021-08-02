module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const KakaoStrategy = require('passport-kakao').Strategy;

    // 12. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 15. 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 16. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/personal-information', jwtMiddleware, user.patchUsers);
    
    // 17. 회원 탈퇴 API
    app.patch('/app/users/withdrawal', jwtMiddleware, user.deleteUsers);

    passport.use(
        'kakao-login',
        new KakaoStrategy(
            {
                clientID: '',
                clientSecret: '',
                callbackURL: '/auth/kakao/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('KakaoStrategy', result);
                return done;
            },
        ),
    );
    // 23. 카카오 로그인 API
    app.post('/users/kakao-login', user.kakaoLogin);
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/auth', successRedirect: '/' }));

    // 24. 회원 프로필 수정 API
    app.patch('/app/users/profile', jwtMiddleware, user.patchUsersProfile);
};

