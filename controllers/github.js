const request = require('request-promise');
const credentials = require('../auth/github-credentials');

const ID = credentials.ID;
const SECRET = credentials.SECRET;

async function getAllRepos() {
    let options = {
        uri: "https://api.github.com/users/Jaleed96/repos",
        headers: {
            "client_id": ID,
            "client_secret": SECRET,
            "User-Agent": "Jaleed96",
        }
    }
    try {
        let response = await request(options);
        return response;
    } catch(error) {
        throw new Error(error);
    }
}


module.exports.getAllRepos = getAllRepos;