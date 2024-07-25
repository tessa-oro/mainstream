class Leaderboard {

    constructor(prisma) {
        this.prisma = prisma;
    }

    async getFollowingUsers(userId) {
        const following = await this.prisma.following.findMany({
            where: {
                followedByName: userId
            }
        });
        let followingScores = new Map();
        for (const user of following) {
            const userRecord = await this.prisma.user.findUnique({
                where: { user: user.name }
            });
            if (userRecord) {
                followingScores.set(user.name, userRecord.score);
            }
        }
        return followingScores;
    }
}

module.exports = Leaderboard;