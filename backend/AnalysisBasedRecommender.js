const UserAnalysis = require('./UserAnalysis');
const Recommended = require('./Recommended');

class AnalysisBasedRecommender {

    constructor(prisma) {
        this.prisma = prisma;
        this.userAnalysis = new UserAnalysis(prisma);
        this.recommended = new Recommended(prisma);
    }

    /*
    * Recommends songs to a user based on their analysis and tags of the songs in their playlist
    * Returns the recommended songs
    */
    async recommendSongs(username) {
        const playlist = await this.userAnalysis.getPlaylist(username);
        const personalityInsights = this.userAnalysis.analyzePersonality(playlist);
        const keyEmotions = this.deriveKeyEmotions(personalityInsights);
        const keyTags = this.deriveKeyTags(playlist);
        const recommendedSongs = await this.findAnalysisRecommendations(keyEmotions, keyTags, username, playlist);
        return recommendedSongs;
    }

    /*
    * Derive the key emotions from the personality insights
    */
    deriveKeyEmotions(insights) {
        const emotions = {
            joy: insights.includes('joy and uplifting music'),
            sadness: insights.includes('melancholic and reflective tunes'),
            anger: insights.includes('intense and energetic music'),
            fear: insights.includes('sense of suspense or thrill'),
            disgust: insights.includes('challenges conventional norms')
        }

        return Object.keys(emotions).filter(emotion => emotions[emotion]);
    }

    /*
    * Derive the key tags of the songs in a playlist
    */
    deriveKeyTags(playlist) {
        const tagCounts = {};
        playlist.forEach(song => {
            song.tags.forEach(tag => {
                if (!tagCounts[tag]) {
                    tagCounts[tag] = 0;
                }
                tagCounts[tag]++;
            })
        })
        const keyTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag]) => tag); //get the top 5 most common tags
        return keyTags;
    }

    /*
    * Fetches songs from database that match with the user's key emotions and tags
    */
    async findAnalysisRecommendations(emotions, tags, username, playlist) {
        try {
            const songs = await this.prisma.song.findMany(); //get existing songs in database

            const userInteractions = await this.prisma.interactions.findMany({ //get the songs a user has interacted with
                where: { user: username },
                select: { songItem: true }
            })

            const userInteractionSongPlayers = userInteractions.map(interaction => interaction.songItem); //get the player url of the songs in userInteractions
            const userPlaylistSongPlayers = playlist.map(song => song.player); //get the player url of the songs in a user's playlist
            const userKnownSongs = [...new Set([...userInteractionSongPlayers, ...userPlaylistSongPlayers])];

            const filteredSongs = songs.filter(song => { //filter all songs based on if they match a user's emotions and playlist tags, excluding those a user has already rated or added to their playlist
                const matchesEmotion = emotions.some(emotion => song.emotionScores.emotion_scores[emotion] > 0.6);
                const matchesTag = tags.some(tag => song.tags.includes(tag));
                const notKnownByUser = !userKnownSongs.includes(song.player);
                return matchesEmotion || matchesTag && notKnownByUser;
            })
            const recommendedSongs = Array.from(new Set(filteredSongs.map(song => song.player))).map(songPlayer => filteredSongs.find(song => song.player === songPlayer)); //remove any duplicates
            return recommendedSongs;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AnalysisBasedRecommender;