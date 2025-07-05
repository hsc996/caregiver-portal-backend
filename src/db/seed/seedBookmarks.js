const { BookmarkModel } = require('../../models/bookmarkModel');

async function seedBookmarks(userIds){
    if (!userIds || userIds.length === 0){
        throw new Error("No user IDs provided for bookmarks.")
    }

    const bookmarks = [
        {
            user: userIds[0],
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            title: "MDN JavaScript Docs",
            category: "Documentation"
        },
        {
            user: userIds[2],
            url: "https://react.dev/",
            title: "React Official Website",
            category: "Framework"
        },
        {
            user: userIds[1],
            url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            title: "React Hooks Crash Course",
            category: "Video"
        }
    ]

    try {
        await BookmarkModel.deleteMany();
        await BookmarkModel.insertMany(bookmarks);
        console.log("Bookmark data seeded successfully.");
    } catch (error) {
        console.log("An error occurred while seeding the bookmark data: " + error);
    }
}

module.exports = {
    seedBookmarks
}