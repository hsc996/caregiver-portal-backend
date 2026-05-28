const { UserModel } = require('../../models/userModel');
const mongoose = require("mongoose");

async function seedUsers(){
    const { SEED_ADMIN_PASSWORD, SEED_USER2_PASSWORD, SEED_USER3_PASSWORD } = process.env;

    if (!SEED_ADMIN_PASSWORD || !SEED_USER2_PASSWORD || !SEED_USER3_PASSWORD) {
        throw new Error('Seed passwords missing: set SEED_ADMIN_PASSWORD, SEED_USER2_PASSWORD, SEED_USER3_PASSWORD in .env');
    }

    const users = [
        {
            firstName: "Hannah",
            lastName: "Scaife",
            username: "first_user",
            email: "han.scaife@gmail.com",
            password: SEED_ADMIN_PASSWORD,
            role: "Admin"
        },
        {
            firstName: "Sarah",
            lastName: "Jones",
            username: "second_user",
            email: "user2@gmail.com",
            password: SEED_USER2_PASSWORD,
            role: "User"
        },
        {
            firstName: "James",
            lastName: "Carter",
            username: "third_user",
            email: "user3@gmail.com",
            password: SEED_USER3_PASSWORD,
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