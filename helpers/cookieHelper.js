const ONE_DAY = 24 * 60 * 60 * 1000;

const setAuthCookie = (res, token) => {
    res.cookie('jwt', token, {
        maxAge: ONE_DAY,
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // true kalau production // Hanya dikirim lewat HTTPS (gunakan saat production)
        // sameSite: 'strict' // Lindungi dari CSRF, tergantung kebutuhan 
    });
};

const clearAuthCookie = (res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict'
    });
};

module.exports = { setAuthCookie, clearAuthCookie };
