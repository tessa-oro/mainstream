class UserAnalysis {

    constructor(prisma) {
        this.prisma = prisma;
    }

    /*
    * Returns the emotional scores for the inputted text
    */
    async textapi(inputText) {
        const fetch = (await import('node-fetch')).default;
        const FormData = require('form-data');

        const data = new FormData();
        data.append('text', inputText);

        const url = 'https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/';
        const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'twinword-emotion-analysis-v1.p.rapidapi.com',
            ...data.getHeaders(),
        },
        body: data
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            return result;
        } catch (error) { }
    }

    /*
    * Gets the transcript of a youtube video and converts it to a string of just the text.
    * Returns the string of text or false if not transcript available.
    */
    async convertTranscript(videoId) {
        try {
            const { getTranscript } = require('youtube-transcript-api');
            const transcript = await getTranscript(videoId);
            let transcriptString = "";
            transcript.forEach(line => {
                transcriptString += line.text.replace(/♪/g, '');
            })
            return transcriptString;
        } catch (error) {
            return false;
        }
    }

    /*
    * Get user playlist
    */
    async getPlaylist(username) {
        const user = await this.prisma.user.findUnique({
            where: {
                user: username
            },
            include: {
                playlist: true
            }
        });
        return user.playlist;
    }

    /*
    * Analyzes a user's personality based on the stats and emotions of the songs in their playlist
    */
    analyzePersonality = (playlist) => {
        let totalEmotions = { joy: 0, anger: 0, sadness: 0, fear: 0, disgust: 0 };
        let totalLikes = 0;
        let totalViews = 0;
        let weightedEmotions = { joy: 0, anger: 0, sadness: 0, fear: 0, disgust: 0 };
        let emotionArray = { joy: [], anger: [], sadness: [], fear: [], disgust: [] };
        let likeViewRatios = [];

        // Add the scores for each emotion, total scores for each emotion, and weighted scores for each emotion to the corresponding maps
        playlist.forEach(song => {
            if (song.emotionScores.emotion_scores) {
                let joyScore = song.emotionScores.emotion_scores.joy;
                let angerScore = song.emotionScores.emotion_scores.anger
                let sadnessScore = song.emotionScores.emotion_scores.sadness;
                let fearScore = song.emotionScores.emotion_scores.fear;
                let disgustScore = song.emotionScores.emotion_scores.disgust;
                let likes = parseInt(song.stats.likeCount);
                let views = parseInt(song.stats.viewCount);

                // Sum up total likes and views
                totalLikes += likes;
                totalViews += views;

                // Sum total emotions and add to total emotions map
                totalEmotions.joy += joyScore;
                totalEmotions.anger += angerScore;
                totalEmotions.sadness += sadnessScore;
                totalEmotions.fear += fearScore;
                totalEmotions.disgust += disgustScore;

                // Sum weighted emotions (based on ratio of likes over views) and add to weighted emotions map
                const weight = likes / views;
                weightedEmotions.joy += joyScore * weight;
                weightedEmotions.anger += angerScore * weight;
                weightedEmotions.sadness += sadnessScore * weight;
                weightedEmotions.fear += fearScore * weight;
                weightedEmotions.disgust += disgustScore * weight;

                // Push emotion scores to the emotion array
                emotionArray.joy.push(joyScore);
                emotionArray.anger.push(angerScore);
                emotionArray.sadness.push(sadnessScore);
                emotionArray.fear.push(fearScore);
                emotionArray.disgust.push(disgustScore);

                // Push the like to view ratio to the likeViewRatio array
                likeViewRatios.push(weight);
            } else { //only handle likes and views if song does not have transcript
                let likes = parseInt(song.stats.likeCount);
                let views = parseInt(song.stats.viewCount);
                totalLikes += likes;
                totalViews += views;
                const weight = likes / views;
                likeViewRatios.push(weight);
            }
        });

        // Calculate the averages of each emotion
        const numSongs = playlist.length;
        const avgEmotions = {
            joy: totalEmotions.joy / numSongs,
            anger: totalEmotions.anger / numSongs,
            sadness: totalEmotions.sadness / numSongs,
            fear: totalEmotions.fear / numSongs,
            disgust: totalEmotions.disgust / numSongs,
        };

        // Calculate weighted averages of each emotion
        const totalWeight = totalLikes / totalViews;
        const avgWeightedEmotions = {
            joy: weightedEmotions.joy / totalWeight,
            anger: weightedEmotions.anger / totalWeight,
            sadness: weightedEmotions.sadness / totalWeight,
            fear: weightedEmotions.fear / totalWeight,
            disgust: weightedEmotions.disgust / totalWeight,
        };

        /*
        * Function to calculate and return the standard deviation of an emotion's scores
        */
        const standardDeviation = (emotion) => {
            const mean = emotion.reduce((sum, value) => sum + value, 0) / emotion.length;
            const variance = emotion.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / emotion.length;
            return Math.sqrt(variance);
        }

        // Calculate and map the standard deviation to each emotion
        const stdDevEmotions = {
            joy: standardDeviation(emotionArray.joy),
            anger: standardDeviation(emotionArray.anger),
            sadness: standardDeviation(emotionArray.sadness),
            fear: standardDeviation(emotionArray.fear),
            disgust: standardDeviation(emotionArray.disgust),
        };

        /*
        * Function to calculate Pearson correlation coefficient for likes and views of a song
        */
        const computePearson = (likesData, viewsData) => {
            const avgLikes = likesData.reduce((sum, likesI) => sum + likesI, 0) / likesData.length;
            const avgViews = viewsData.reduce((sum, viewsI) => sum + viewsI, 0) / viewsData.length;
            const numerator = likesData.reduce((sum, likesI, i) => sum + (likesI - avgLikes) * (viewsData[i] - avgViews), 0);
            const denominator = Math.sqrt(
                likesData.reduce((sum, likesI) => sum + Math.pow(likesI - avgLikes, 2), 0) *
                viewsData.reduce((sum, viewsI) => sum + Math.pow(viewsI - avgViews, 2), 0)
            );
            return numerator / denominator;
        }

        // Calculate pearson correlation between likes and views for a playlist
        const likesData = playlist.map(song => parseInt(song.stats.likeCount));
        const viewsData = playlist.map(song => parseInt(song.stats.viewCount));
        const likesViewsCorrelation = computePearson(likesData, viewsData);

        /*
        * K-means clustering for emotion scores
        */
        const kMeansCluster = (data, k) => {
            const maxIterations = 100;  // Number of iterations for convergence
            let centroids = data.slice(0, k).map(point => point.emotions);  // Initialize centroids
            let clusters = new Array(k).fill().map(() => []);
            for (let i = 0; i < maxIterations; i++) {
                clusters.forEach(cluster => cluster.length = 0);  // Reset clusters
                data.forEach(point => { // Assign each data point to the nearest centroid
                    let minDist = Infinity;
                    let clusterIndex = 0;
                    centroids.forEach((centroid, index) => {
                        const dist = Math.sqrt(Object.keys(point.emotions).reduce((sum, key) => sum + Math.pow(point.emotions[key] - centroid[key], 2), 0));
                        if (dist < minDist) {
                            minDist = dist;
                            clusterIndex = index;
                        }
                    });
                    clusters[clusterIndex].push(point);
                });
                centroids = clusters.map((cluster) => { // Update centroids based on the average of the clusters
                    if (cluster.length === 0) {
                        return data[Math.floor(Math.random() * data.length)].emotions;
                    }
                    const average = {};
                    Object.keys(cluster[0].emotions).forEach(key => {
                        average[key] = cluster.reduce((sum, point) => sum + point.emotions[key], 0) / cluster.length;
                    });
                    return average;
                });
            }
            return clusters;
        }

        // Perform k-means clustering on the emotion data
        const emotionData = playlist.map(song => ({
            emotions: song.emotionScores.emotion_scores,
            songInfo: song.tags.join(' ')
        }));
        const clusters = kMeansCluster(emotionData, 3);

        let personalityInsights = '';

        // Insights based on average emotions
        if (avgEmotions.joy > 0.6) {
            personalityInsights += "You seem to enjoy joy and uplifting music. <br />";
        } else if (avgEmotions.sadness > 0.6) {
            personalityInsights += "You might have a preference for more melancholic and reflective tunes. <br />";
        } else if (avgEmotions.anger > 0.6) {
            personalityInsights += "You could be drawn to more intense and energetic music. <br />";
        } else if (avgEmotions.fear > 0.6) {
            personalityInsights += "You may like music that evokes a sense of suspense or thrill. <br />";
        } else if (avgEmotions.disgust > 0.6) {
            personalityInsights += "Your taste might include music that challenges conventional norms. <br />";
        } else {
            personalityInsights += "You seem to have a balanced taste in music. <br />";
        }

        // Insights based on standard deviation of emotions
        if (stdDevEmotions.joy > 0.2 && stdDevEmotions.anger > 0.2 && stdDevEmotions.sadness > 0.2) {
            personalityInsights += "<br /> You tend to tap in to all of your emotions when listening to music. <br />";
        } else {
            personalityInsights += "<br /> You tend to be drawn to the same emotions when listening to music. <br />";
        }

        // Insights based on correlation between likes and views
        if (likesViewsCorrelation > 0.7) {
            personalityInsights += "<br /> You tend to like songs that are both popular and widely viewed. <br />";
        } else {
            personalityInsights += "<br /> Your music taste goes against the grain. <br />";
        }

        // Use clusters to group songs by emotional vibe
        personalityInsights += "Let's break your playlist down by vibes: "
        clusters.forEach((cluster, index) => {
            personalityInsights += `<br /><br />Vibe ${index + 1}: `;
            cluster.forEach(point => {
                personalityInsights += `song: ${point.songInfo} , `;
            })
            Object.keys(cluster[0].emotions).forEach(emotion => {
                const avgEmotion = cluster.reduce((sum, point) => sum + point.emotions[emotion], 0) / cluster.length;
                personalityInsights += `${emotion}: ${avgEmotion.toFixed(2)} `;
            });
        });

        return personalityInsights;
    }
}

module.exports = UserAnalysis;