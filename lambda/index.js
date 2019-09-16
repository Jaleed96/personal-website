const db = require('./dynamodb');
const github = require('./github');
const _ = require('lodash');

exports.handler = async (event) => {
    let repositories = await github.fetchRepositories().catch((error) => console.error(error));

    let filteredRepos = repositories.filter((repo) => !repo.private && !repo.fork);

    let dbEntries = filteredRepos.map((repo) => {
        console.log(repo.languages);
        let entry = {
            "id": {
                N: `${repo.id}`
            },
            "name" : {
                S: `${repo.name}`
            },
            "html_url": {
                S: `${repo.html_url}`
            },
            "description": {
                S: `${repo.description}`
            },
            "languages": {
                S: JSON.stringify(repo.languages)
            }
        }

        return entry;
    });
    
    let reposFromDB = await db.getAllItems().catch(error => console.error(error));
    let result = await updateReposInDB(reposFromDB, dbEntries).catch(error => console.error(error));

    console.log(result);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

async function updateReposInDB(oldRepos, newRepos) {
    let requestArray = [];
    let modifiedRepos = _.xorWith(oldRepos, newRepos, (oldRepo, newRepo) => {
        return parseInt(oldRepo.id.N) === parseInt(newRepo.id.N);
    });

    if (oldRepos.length > 0) {
        let outdatedRepos = _.xorWith(modifiedRepos, newRepos, (modifiedRepo, newRepo) => {
            return parseInt(modifiedRepo.id.N) === parseInt(newRepo.id.N);
        });
        outdatedRepos.forEach((repo) => {
            let requestObj = {
                DeleteRequest: {
                    Key: {
                        N: `${repo.id}`
                    }
                }
            }
            requestArray.push(requestObj);
        })
    }
    
    modifiedRepos.forEach((repo) => {
        let requestObj = {
            PutRequest: {
                Item: repo
            }
        }
        requestArray.push(requestObj);
    });
    let result = await db.batchModifyItems(requestArray).catch((error) => { return Promise.reject(error); });
    return result;
}