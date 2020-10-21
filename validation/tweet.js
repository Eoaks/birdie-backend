const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateTweet(data) {
    let errors = {};

    /* use isEmpty to convert empty fields to empty strings
       since Validator only takes strings
    */
    data.content = !isEmpty(data.content) ? data.content : "";

    //checks with Validator
    if (Validator.isEmpty(data.content)) {
        errors.content = "Tweet is empty"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};