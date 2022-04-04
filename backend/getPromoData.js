const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        promoCode: String
    },
    {timestamps: false}
);

module.exports = mongoose.model("promos", DataSchema);
