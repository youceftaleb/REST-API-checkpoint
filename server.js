const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./models/User');


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// config the environement variables
require('dotenv').config();

// connect database
require('./config/db').connect();

// create an express server
app.listen(8080, () => console.log('app listening on port 8080'));


// routes
const routes = () => {

    // get all users
    router.get("/users", async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).send({ message: "Users list retrieved", data: users });
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    });


    // add a new user
    router.post("/users", async (req, res) => {
        try {
            const { firstName, lastName, age } = req.body;
            // check if user already exist
            const doesUserExist = await User.findOne({ firstName, lastName });
            if (doesUserExist) {
                return res.status(409).send('User already exists')
            }
            const newUser = await User.create({
                firstName,
                lastName,
                age
            });
            res.status(201).send(newUser);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });




    // edit user by id
    router.put("/users/:id", async (req, res) => {
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                useFindAndModify: false,
            });
            if (!user) {
                return res.status(200).json({ message: "User does not exist" });
            }
            res.status(200).json({ message: "User updated", data: user });
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    });


    // delete user by id
    router.delete("/users/:id", async (req, res) => {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.status(200).send("User deleted");
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    });

    return router;
};
app.use('/', routes());