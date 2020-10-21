const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth');
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

router.route('/').get( (req, res) => {
    User.find()
        .populate('tweets')
        .then(users => res.json(users))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/register').post( (req, res) => {
    let { isValid, errors } = validateRegisterInput(req.body);

    if( !isValid ) {
        res.status(400).json(errors);
    }

    User.findOne({username: req.body.username}).then( user => {
        if(user) {
            return res.status(400).json({message: "username already exists!"});
        }
        let newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then( user => res.status(201).json('User created, you may log in now.'))
                    .catch( err => res.status(500).json(err));
            })
        })
    })
});

router.route('/login').post( (req, res) => {
    let { isValid, errors } = validateLoginInput(req.body);
    if( !isValid ) {
        res.status(400).json(errors);
    }

    User.findOne({username: req.body.username})
        .then( user => {
        if (!user) {
            res.status(404).json("user not found")
        }

        bcrypt.compare(req.body.password, user.password, (err, match) => {
            if(match) {
                const payload = {
                    id: user.id,
                    username: user.username
                };
                jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 7 * 24 * 3600 // 1 week
                    },
                    (err, token) => {
                        res.cookie('login-token', 'Bearer ' + token, {
                            httpOnly: true,
                        });
                        res.cookie('loggedIn', true);

                        let {username, _id, tweets} = user;
                        res.json({username, _id, tweets});
                    }
                );
            } else {
                res.status(400).json({message: "Invalid password"});
            }

        })

    })
});

/*AUTH REQUIRED ROUTES */
router.use(authMiddleware);

router.route('/get')
.get((req, res) => {
    User.findById(req.user.id)
    .select('username _id')
    .then(user => {
        res.json(user);
    });
})

module.exports = router;