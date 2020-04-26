/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://localhost/pagebubble-dev'
    },
    redis: {
        uri: process.env.REDIS_URI || 'redis://localhost:6379'
    },

    // Seed database on startup
    seedDB: true,
};
