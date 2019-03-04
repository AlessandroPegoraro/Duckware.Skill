const { Action } = require('../actions/Action');
const { CustomMessageAction } = require('../actions/CustomMessageAction');
const { ReadFeedRSSAction } = require('../actions/ReadFeedRSSAction.js');

var exports = module.exports = {};

/**
 *
 * @param name
 * @param params
 * @returns {Action}
 */
function actionFactory(name, params) {
    switch (name) {
        case "custom_message":
            return new CustomMessageAction(name, params);
        case "read_feed":
            return new ReadFeedRSSAction(name, params);
        default :
            return null;
    }
}

exports.actionFactory = actionFactory;