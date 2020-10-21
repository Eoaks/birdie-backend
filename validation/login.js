const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    /* use isEmpty to convert empty fields to empty strings
       since Validator only takes strings
    */
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    //checks with Validator
    if (Validator.isEmpty(data.username)) {
        errors.username = "username is required"
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "password is required"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};