const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        id: Number,
        username: String,
        password: String,
        promos_id: [mongoose.Schema.Types.ObjectId]
    },
    { timestamps: false }
);

module.exports = mongoose.model('users', User);
