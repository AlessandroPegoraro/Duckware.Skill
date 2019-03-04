const { Action } = require('./Action.js');

var exports = module.exports = {};

class CustomMessageAction extends Action {
    run() {
        return new Promise( resolve => {
            resolve ("Azione non riconosciuta.")
            });
    }
}

exports.CustomMessageAction = CustomMessageAction;