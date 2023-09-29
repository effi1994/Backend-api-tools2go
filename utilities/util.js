const bcrypt = require('bcrypt');

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
function isEmpty(value) {
    if (value === null) {
        return true;
    } else if (typeof value !== 'number' && value === '') {
        return true;
    } else if (typeof value === 'undefined' || value === undefined) {
        return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    } else {
        return false;
    }
}

async function setPassword(password) {
    const salt = await bcrypt.hash(password, 10);
    return salt;
}

async function comparePassword(password, hashPassword) {
    const isPasswordMatching = await bcrypt.compare(password, hashPassword);
    return isPasswordMatching;
}



module.exports = {
    isEmpty,
    setPassword,
    comparePassword,
};
