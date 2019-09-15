const AWS = require('aws-sdk');
const db = new AWS.DynamoDB({region: 'us-west-2'});
const TABLE = process.env.TABLE || 'Github-Repositories';

function putItem(item) {
    let params = {
        TableName: TABLE,
        Item: item,
    };

    return new Promise((resolve, reject) => {
        db.putItem(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

function getAllItems() {
    let params = {
        TableName: TABLE
    }

    return new Promise((resolve, reject) => {
        db.scan(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

function deleteItem(itemID) {
    let params = {
        TableName: TABLE,
        Key: {
            "id": itemID
        }
    }

    return new Promise((resolve, reject) => {
        db.deleteItem(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

module.exports.putItem = putItem;
module.exports.getAllItems = getAllItems;
module.exports.deleteItem = deleteItem;

