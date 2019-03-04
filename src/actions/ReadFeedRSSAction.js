const { Action } = require('./Action.js');
const Parser = require('rss-parser');
const parser = new Parser();

var exports = module.exports = {};

class ReadFeedRSSAction extends Action {

    constructor(name, params) {
        super(name, params);
    }

    /**
     * @param handlerInput
     */
    run(handlerInput) {
        return new Promise((resolve, reject) => {
            let output = '';
            this.params.forEach( param => {
                parser.parseURL(param).then(data => {
                    console.log("Parametro: " + param);
                    output += 'Queste sono le notizie da: ' + data.title + '. <break time=\"1s\"/> ';

                    let i = 0;
                    data.items.forEach(item => {
                        if (i <= 4) {
                            output = output + item.title + '. <break time=\"1.5s\"/> ';
                            i++;
                        }
                    });

                    output += '. <break time=\"1.5s\"/> ';
                }, error => {
                    output += "Non riesco a leggere questo feed.";
                });
            });
            resolve(output);
        });
    }
}

exports.ReadFeedRSSAction = ReadFeedRSSAction;