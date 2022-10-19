const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const mongoose = require("mongoose");
exports.connect = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((x) => {
            console.log(
                `Connected to Mongo! Database name: "${x.connections[0].name}"`
            );
        })
        .catch((err) => {
            console.error("Error connecting to mongo", err.message);
        });
};
