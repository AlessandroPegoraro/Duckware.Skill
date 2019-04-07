const { Action } = require('./Action.js');
const {getTVSchedule} = require('../utils/db-util');

var exports = module.exports = {};

class TVScheduleAction extends Action {

    constructor(name, params) {
        super(name, params);
    }

    /**
     *
     * @returns {Promise<string>} Returns an output TODO
     */
    async run() {
        let output = '';

        //TODO check se ci sono elementi in params, altrimenti il pop può ritornare un undefined

        let time = this.params.pop();
        console.log(this.params);
        console.log(time);


        await getTVSchedule(this.params, time).then(
            data => {
                console.log("CIELO FATTA");
                output += "Notizie lette";
            },
            error => {
                console.log("CIE UN ERORE");
                return error;
            }
        );
        return output;
    }
}

exports.TVScheduleAction = TVScheduleAction;