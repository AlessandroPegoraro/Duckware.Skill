const AWS = require("aws-sdk");

var exports = module.exports = {};

function getWF(username, idWF) {
    AWS.config.update({
        region: "eu-west-1",
        endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });

    let docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
        TableName : "Users",
        ProjectionExpression:"Workflow",
        KeyConditionExpression: "UserID = :usr",
        ExpressionAttributeValues: {
            ":usr": username
        }
    };


    return new Promise(function(resolve, reject) {
        docClient.query(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                if(data.Count === 0) {
                    reject(null);
                }

                console.log(data.Count);
                let hit = data.Items[0].Workflow.find(i => i.WorkflowID === idWF);

                if (hit) {
                    resolve(hit.WorkflowDefinition);
                }
                else {
                    reject(null);
                }
            }
        });
    });
}

exports.getWF = getWF;