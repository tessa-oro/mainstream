class Leaderboard {

    constructor(prisma) {
        this.prisma = prisma;
    }

    /*
    * Function takes in a userId and returns a map of the users the userId follows mapped to their music taste score
    */
    async getFollowingUsers(userId) {
        const following = await this.prisma.following.findMany({ //get following list
            where: {
                followedByName: userId
            }
        });
        let followingScores = new Map();
        for (const user of following) { 
            const userRecord = await this.prisma.user.findUnique({ //get user record for each user in following
                where: { user: user.name }
            });
            if (userRecord) {
                followingScores.set(user.name, userRecord.score); //map username to user score
            }
        }
        return followingScores;
    }

    /*
    * Sort following scores map in descending order by scores
    */
    sortFollowingScores(followingScores) {
        const scoreEntries = Array.from(followingScores.entries());
        const sortedScoreEntries = scoreEntries.sort((a, b) => b[1] - a[1]);
        const sortedScoresMap = new Map(sortedScoreEntries);
        return sortedScoresMap;
    }
}

module.exports = Leaderboard;