var exports = module.exports = {};

class Action {
    /**
     *
     * @param name {string} name of the action
     * @param params {string} parameters of the action
     */
    constructor(name, params) {
        this.name = name;
        this.params = params;
    }

    /**
     *TODO basic behavior
     */
    run(handlerInput) {}
}

exports.Action = Action;