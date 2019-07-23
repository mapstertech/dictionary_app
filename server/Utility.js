const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { NO_AUTH, NO_PERMISSION, LOGIN_ERROR } = require('./Constants')

module.exports = {
    batchUpdate(knex, table, collection) {
        return knex.transaction((trx) => {
            const queries = collection.map((tuple) =>
                knex(table)
                .where('id', tuple.id)
                .update(tuple, '*')
                .transacting(trx)
            )
            return Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        })
    },
    signJwtAndSend(payload, res, code) {
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                console.log('error signing token', err)
                return res.sendStatus(403)
            }

            console.log(payload.user.email);
            return res.status(code).json({
                token,
                user: {
                    id: payload.user.id,
                    email: payload.user.email,
                    is_admin: payload.user.is_admin
                }
            })
        })
    },

    /**
     * Middleware to check the validity of the JWT token
     * Token must be included on every authenticated request
     * Either in the body or as an Authorization header.
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    validateJwt(req, res, next) {
        const { token: bodyToken } = req.body;
        const { authorization = '' } = req.headers;
        const parsedAuthorization = authorization.split('Bearer: ')[1];
        const token = bodyToken || parsedAuthorization;

        if (!token) {
           return res.status(401).json({
                code: NO_AUTH,
                message: LOGIN_ERROR
            });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    code: NO_AUTH,
                    message: LOGIN_ERROR
                });
            }
            req.user = decoded.user;
            return next();
        });
    }
}
