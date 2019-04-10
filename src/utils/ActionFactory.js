const { Action } = require('../actions/Action');
const { CustomMessageAction } = require('../actions/CustomMessageAction');
const { ReadFeedRSSAction } = require('../actions/ReadFeedRSSAction.js');
const { TwitterReadAction } = require('../actions/TwitterReadAction.js');
const { TwitterWriteAction } = require('../actions/TwitterWriteAction.js');
const { TVScheduleAction } = require('../actions/TVScheduleAction.js');

var exports = module.exports = {};

/**
 *
 * @param name {string}
 * @param params {JSON}
 * @returns {Action} Returns the appropriate Action depending on the the type of the action
 */

function actionFactory(name, params) {
    switch (name) {
        case "custom_message":
            return new CustomMessageAction(name, params);
        case "read_feed":
            return new ReadFeedRSSAction(name, params);
        case "read_tweet":
            return new TwitterReadAction(name, params);
        case "write_tweet":
            return new TwitterWriteAction(name, params);
        case "tv_schedule":
            return new TVScheduleAction(name, params);
        default :
            throw "Unknown action";
    }
}

exports.actionFactory = actionFactory;