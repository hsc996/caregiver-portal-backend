const { UserModel } = require('../../models/userModel');

async function seedUsers(companyId) {
    const { SEED_ADMIN_PASSWORD, SEED_USER2_PASSWORD, SEED_USER3_PASSWORD } = process.env;

    if (!SEED_ADMIN_PASSWORD || !SEED_USER2_PASSWORD || !SEED_USER3_PASSWORD) {
        throw new Error('Seed passwords missing: set SEED_ADMIN_PASSWORD, SEED_USER2_PASSWORD, SEED_USER3_PASSWORD in .env');
    }

    const users = [
        {
            companyId,
            firstName: "Hannah",
            lastName: "Scaife",

            email: "han.scaife@gmail.com",
            password: SEED_ADMIN_PASSWORD,
            role: "Admin",
        },
        {
            companyId,
            firstName: "Sarah",
            lastName: "Jones",

            email: "user2@gmail.com",
            password: SEED_USER2_PASSWORD,
            role: "User",
        },
        {
            companyId,
            firstName: "James",
            lastName: "Carter",

            email: "user3@gmail.com",
            password: SEED_USER3_PASSWORD,
            role: "User",
        },
    ];

    try {
        await UserModel.deleteMany();
        await UserModel.create(users);
        console.log("Users seeded successfully.");
    } catch (error) {
        console.log("An error occurred while seeding User data: " + error);
        throw error;
    }
}

module.exports = { seedUsers };
