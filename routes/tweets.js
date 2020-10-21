const router = require('express').Router();
const jwt = require("jsonwebtoken");
let Tweet = require('../models/tweet.model');
let User = require('../models/user.model');
//validation
const validateTweet = require('../validation/tweet');

/*
    PUBLIC ROUTES
*/

router.route('/').get( (req, res) => {
    Tweet.find()
        .sort({createdAt: 'desc'})
        .populate('created_by')
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json("Error: " + err));
});

/*
    AUTH REQUIRED ROUTES
*/

router.use((req, res, next) => {
    const bearer = req.cookies['login-token'];
    if(bearer && bearer.includes('Bearer ')) {
        let token = bearer.replace('Bearer ', '').trim();
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.cookie('loggedIn', false);
                return res.status(401).json(err);
            }
            req.user = {
                id: decoded.id,
                username: decoded.username
            }
            next();
        })
    } else {
        res.cookie('loggedIn', false);
        return res.status(401).json("Unauthorized");
    }
});


router.route('/new')
    .post( async (req, res) => {

        const { errors, isValid } = validateTweet(req.body);
        
        if (!isValid) {
            return res.status(400).json(errors);
        }
        let tweet = new Tweet({
            content: req.body.content,
            created_by: req.user.id
        })
        User.findById(req.user.id, (err, user) => {
            if (err) return res.status(400).json(err)
            
            user.tweets.push(tweet._id);
            user.save();
        });

        tweet = await tweet.save();
        
        return res.status(201).json(tweet);
    });

module.exports = router;