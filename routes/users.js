const express = require("express");
const router = express.Router();
const Joi = require("joi");
const UsersController = require('../controllers/users.controller');
const auth = require("../middleware/auth");
let usersController = new UsersController();


router.get("/user-profile", auth, async (req, res, next) => {
        req.body.userId = req.user.id;
        console.log(req.body.userId);
       
        const user = await usersController.getUserProfile(req, res, next);
});

router.post("/update-user-profile", auth, async (req, res, next) => {
        await usersController.updateUser(req, res, next);

});



router.post("/delete-user", auth, async (req, res, next) => {
        req.body.userId = req.user.userId;
        const user = await usersController.deleteUser(req, res, next);
});





module.exports = router;
