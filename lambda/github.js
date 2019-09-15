const request = require('request-promise');
const credentials = require('../auth/github-credentials');

const ID = credentials.ID;
const SECRET = credentials.SECRET;
const HEADERS = {
    "client_id": ID,
    "client_secret": SECRET,
    "User-Agent": "Jaleed96",
};

async function fetchRepositories() {
    let response, result;
    let options = {
        uri: "https://api.github.com/users/Jaleed96/repos",
        headers: HEADERS,
    }
    response = await request(options).catch(error => { return Promise.reject(error) });
    result = await determineProjectLanguages(JSON.parse(response)).catch(error => { return Promise.reject(error); });
    return Promise.resolve(result);
}

async function determineProjectLanguages(projects) {
    let subarray = projects.slice(2, 6);
    let promises = subarray.map(async (repo) => {
        let options = {
            uri: repo.languages_url,
            headers: HEADERS
        }
        let updatedResponse = await request(options).catch(error => { return Promise.reject(error); });
        updatedResponse = {...repo, "languages": JSON.parse(updatedResponse)};
        return updatedResponse;
    });

    let resolvedResponse = await Promise.all(promises).catch((error) => { return Promise.reject(error);});
    return resolvedResponse;
}


module.exports.fetchRepositories = fetchRepositories;