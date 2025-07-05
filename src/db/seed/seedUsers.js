const { UserModel } = require('../../models/userModel');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function seedUsers(){
    const users = [
        {
            username: "first_user",
            email: "user1email@gmail.com",
            password: "PassW123!",
            role: "Admin"
        },
        {
            username: "second_user",
            email: "user2@gmail.com",
            password: "Cowboy22!",
            role: "User"
        },
        {
            username: "third_user",
            email: "user3@gmail.com",
            password: "Poltergeist344!",
            role: "User"
        },
    ]

    for (let user of users){
        user.password = await bcrypt.hash(user.password, 10);
    }

    try {
        await UserModel.deleteMany();
        await UserModel.insertMany(users);
        console.log("Users seeded successfully.")
    } catch (error) {
        console.log("An error occured while seeding User data: " + error);
    }
}

module.exports = {
    seedUsers
}