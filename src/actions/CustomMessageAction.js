const { Action } = require('./Action.js');

var exports = module.exports = {};

class CustomMessageAction extends Action {
    /**
     * TODO implements Alexa output whit a customized message
     */
    run() {
        return new Promise(resolve => {
            let output = '';
            this.params.forEach(param => {
                console.log("Parametro: " + param);
                output += param;
            });

            resolve(output);
        });
    }
}

exports.CustomMessageAction = CustomMessageAction;