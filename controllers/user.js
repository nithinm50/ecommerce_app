const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../utility/db')

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(async hashedPw => {
            let query = `INSERT INTO "Users"("firstName", email, "password") VALUES('${firstName}','${email}', '${hashedPw}')`
            await con
                .query(query)
                .then(result => {
                    res.status(201).json({ message: 'User created!', userId: result.id });
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const query = {
        // give the query a unique name
        name: 'fetch-user',
        text: 'select * from "Users" where email = $1',
        values: [email],
    }
    con
        .query(query)
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user.rows[0];
            isEqual = bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser.id
                },
                'somesupersecretsecret',
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser.id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
