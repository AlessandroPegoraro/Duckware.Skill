const AWS = require("aws-sdk");

var exports = module.exports = {};

function getWF(username, idWF) {
    AWS.config.update({
        region: "eu-central-1",
        endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
    });

    let docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
        TableName : "User-tevi37ekkbfvjgpusicgsjpt5m-testcog",
        ProjectionExpression:"workflow",
        KeyConditionExpression: "id = :usr",
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

                console.log("DATA: " + data.Count);
                let hit = data.Items[0].workflow.find(i => i.name === idWF);

                if (hit) {
                    resolve(hit.def);
                }
                else {
                    reject(null);
                }
            }
        });
    });
}

function getEndTime(time) {
    let aux = time.split(":");
    console.log("Time1: " + aux[0]);
    console.log("Time2: " + aux[1]);
    aux = aux.map(item => parseInt(item) );
    aux[0] += 6;
    aux.forEach(item => item.toString());

    if(aux[0]<"10")
        aux[0]= "0"+aux[0];

    console.log("Time1b: " + aux[0]);
    console.log("Time2b: " + aux[1]);
    return aux[0] + ":" + aux[1];
}

function getTVSchedule(channellist, time) {
    AWS.config.update({
        region: "eu-central-1",
        endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
    });

    let docClient = new AWS.DynamoDB.DocumentClient();

    let channelschedule = new Map();
    let promiseList = [];

    return new Promise((resolve, reject) => {
        for (const channel of channellist) {
            //channellist.forEach(async function (channel) {
            console.log("Richiesta canale: " + channel);
            let params = {
                TableName: "TVChannels",
                ProjectionExpression: "schedule",
                KeyConditionExpression: "channel = :ch",
                ExpressionAttributeValues: {
                    ":ch": channel
                }
            };

            promiseList.push(
                new Promise((resolve, reject) => {
                    docClient.query(params,function (err, data) {
                        console.log("Entered query");
                        if (err) {
                            reject(err);
                        } else {
                            if (time === null)
                                channelschedule.set(channel, data.Items);
                            else {
                                let periodSchedule = [];
                                data.Items.forEach(function (item) {
                                    console.log("ITEM: " + item.name + item.time);
                                    if (item.time >= time && item.time < getEndTime(time))
                                        periodSchedule.push(item);
                                });
                                channelschedule.set(channel, periodSchedule);
                            }

                            resolve();
                        }
                    });
                })
            );
        }

        Promise.all(promiseList).then(
            () => resolve(channelschedule),
            error => reject(error)
        );
    });
}

exports.getTVSchedule = getTVSchedule;
exports.getWF = getWF;