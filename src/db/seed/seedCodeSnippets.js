const mongoose = require("mongoose");

const { codeSnippetModel } = require('../../models/codeSnippetModel');

async function seedCodeSnippets(userIds){
    const snippets = [
        {
            user: userIds[0],
            title: "FizzBuzz Solution in Javascript",
            code: `for(let i=1; i<=100; i++){
                let output = "";
                if(i % 3 === 0) output += "Fizz";
                if(i % 5 === 0) output += "Buzz";
                console.log(output || i);
            }`,
            language: "JavaScript",
            tags: ["DSA", "algorithm", "beginner", "fizzbuzz"],
            notes: "Can also be done using lowest common denomenator w if/else - e.g. (i % 15 === 0)"
        },
        {
            user: userIds[1],
            title: "Python List Comprehension",
            code: `[x**2 for x in range(10) if x % 2 == 0]`,
            language: "Python",
            tags: ["python", "list", "comprehension", "DSA"],
            notes: "Compact way to filter and transform in Python. Good for one-liners."
        }
    ]

    try {
        await codeSnippetModel.deleteMany();
        await codeSnippetModel.insertMany(snippets);
        console.log("Code snippets seeded successfully.");
    } catch (error) {
        console.log("An error occurred while seeding code snippets: " + error);
    }
}

module.exports = {
    seedCodeSnippets
}