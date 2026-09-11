const bcrypt = require('bcrypt');

const ROUNDS = 12;

exports.hash = (plain) => bcrypt.hash(plain, ROUNDS);
exports.verify = (plain, hash) => bcrypt.compare(plain, hash);
