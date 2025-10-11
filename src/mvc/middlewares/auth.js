import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        let token = req?.header('Authorization');

        token = token?.replace('Bearer ', '');

        if (token) {
            req.token = token;
            jwt.verify(token, process?.env?.JWT_KEY, function (err, decoded) {
                if (err) {
                    err.message = 'Please, Login.';
                    return res.status(403).send({
                        success: false,
                        message: 'Please, Login.',
                    });
                }
                req.user = decoded;
                next();
            });
        } else {
            return res.status(403).send({
                success: false,
                unAuthorized: true,
                message: 'Unauthorized',
            });
        }
    } catch (error) {
        console.log('auth middleware failed');
    }
};

export default auth;