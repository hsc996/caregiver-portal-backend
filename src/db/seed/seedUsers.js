const { UserModel } = require('../../models/userModel');
const mongoose = require("mongoose");

async function seedUsers(){
    const users = [
        {
            username: "first_user",
            email: "user1email@gmail.com",
            password: "PassWORDsec123!",
            role: "Admin"
        },
        {
            username: "second_user",
            email: "user2@gmail.com",
            password: "CowboyPAssword22!",
            role: "User"
        },
        {
            username: "third_user",
            email: "user3@gmail.com",
            password: "PoltergeistPW344!",
            role: "User"
        },
    ]

    try {
        await UserModel.deleteMany();
        await UserModel.create(users);
        console.log("Users seeded successfully.")
    } catch (error) {
        console.log("An error occured while seeding User data: " + error);
    }
}

module.exports = {
    seedUsers
}