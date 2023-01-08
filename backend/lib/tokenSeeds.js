const crypto = require('crypto')

const tokenSeedGenerator = {
    generateTokens: () => {
        const accessTokenSecret = crypto.randomBytes(64).toString("hex")
        const refreshTokenSecret = crypto.randomBytes(64).toString("hex")

        console.log(`ACCESS_TOKEN_SECRET=${accessTokenSecret}`)
        console.log(`REFRESH_TOKEN_SECRET=${refreshTokenSecret}`)
    }
}

if (require.main === module) {
    tokenSeedGenerator.generateTokens()
}

module.exports = {
    tokenSeedGenerator
}