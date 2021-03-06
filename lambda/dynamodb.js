const AWS = require('aws-sdk');
const db = new AWS.DynamoDB({region: 'us-west-2'});
const TABLE = process.env.TABLE || 'Github-Repositories';

function putItem(item) {
    let params = {
        TableName: TABLE,
        Item: item,
    };

    return new Promise((resolve, reject) => {
        db.putItem(params, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
}

function getAllItems() {
    let params = {
        TableName: TABLE
    }

    return new Promise((resolve, reject) => {
        db.scan(params, (error, data) => {
            if (error) reject(error);
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
        db.deleteItem(params, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
}

function batchModifyItems(requestArray) {
    let params = {
        RequestItems: {}
    }
    params.RequestItems[TABLE] = requestArray;

    return new Promise((resolve, reject) => {
        db.batchWriteItem(params, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
}

module.exports.putItem = putItem;
module.exports.getAllItems = getAllItems;
module.exports.deleteItem = deleteItem;
module.exports.batchModifyItems = batchModifyItems;
