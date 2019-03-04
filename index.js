const {ReadFeedRSSAction} = require("./src/actions/ReadFeedRSSAction");
const {getWF} = require('./src/utils/db-util');
const {actionFactory} = require("./src/utils/actionFactory");

const Alexa = require('ask-sdk');
const axios = require('axios');
const appName = 'SwetlApp';
let email;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const { accessToken } = handlerInput.requestEnvelope.context.System.user;
        let speechText = '';

        if (!accessToken) {
            speechText = 'Devi autenticarti con il tuo account Amazon per usare questa skill. Ti ho inviato le istruzioni nella tua App Alexa.';
            return handlerInput.responseBuilder
                .speak(speechText)
                .withLinkAccountCard()
                .getResponse();
        } else {
            const amznProfileUrl = `https://api.amazon.com/user/profile?access_token=${accessToken}`;

            try {
                const response = await axios.get(amznProfileUrl);
                console.log(response.data.email);
                email = response.data.email;
                const name = response.data.name.split(" ")[0];
                speechText = `Ciao, ${name}! Benvenuto in SwetlApp, come posso aiutarti?`;
            } catch (error) {
                console.error(error);
                speechText = 'Si è verificato un errore durante l\'esecuzione. Riprova più tardi.';
            }

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    }
};

const RunWorkflowHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'RunWorkflowIntent';
    },
    async handle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        let workflowName =  request.intent.slots.workflow.value;
        let speechText = '';
        console.log(email);
        console.log(workflowName);

        /*
        const { accessToken } = handlerInput.requestEnvelope.context.System.user;
        if(accessToken) {
            const amznProfileUrl = `https://api.amazon.com/user/profile?access_token=${accessToken}`;

            try {
                const response = axios.get(amznProfileUrl);
                const email = response.data.email;
            } catch (error) {
                console.error(error);
                return handlerInput.responseBuilder
                    .speak('Si è verificato un errore durante l\'esecuzione. Riprova più tardi.')
                    .keepSession()
                    .getResponse();
            }
        }
*/
        await getWF(email, workflowName).then(
            data => {
                speechText += 'Va bene, eseguo ' + JSON.stringify(workflowName) + '.';
                let actionList = JSON.parse(data);
                console.log(JSON.stringify(data));

                actionList.actions_records.forEach(action => {
                        console.log("Esecuzione azione: " + action.action);
                        actionFactory(action.action, action.params).run().then(data => speechText += data + '. <break time=\"2s\"/> ', error => speechText += error );
                    });
            },
            error => {
                console.log(error);
            }
        );
        /* TODO call db function */
        /* TODO scan the Json and call the factory to get a list of Action*/
        /* TODO call run for every Action in the list*/
        // speechText + = run() di tutte le Action;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt("Puoi chiedermi di eseguire un altro workflow, oppure terminare la skill.")
            .getResponse();
    }
};

const WorkflowRepeatHandler = {
    canHandle(handlerInput){
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'RepeatWorkflowIntent';
    },
    handle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        var workflowName =  request.intent.slots.workflow.value;
        const speechText = 'Va bene, ripeto il workflow' + workflowName;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const ReadRSSHandler = {
    canHandle(handlerInput){
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'RssIntent';
    },

    async handle(handlerInput) {
        let response;
        await (new ReadFeedRSSAction("read", "https://www.reddit.com/.rss")).run(handlerInput).then(
            data => response = data,
            error => console.log(error)
        );

        return response;
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speechText = 'A presto';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const CancelIntent = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hai annullato il workflow';
        const repromptText = 'Come posso aiutarti?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Puoi eseguire i workflow creati nell\'app, prova a dire: esegui Roberto';
        const repromptText = 'Prova a chiedermi di eseguire un workflow che hai creato nell\'app';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Scusa, non ho capito. Puoi ripetere?')
            .reprompt('Non ho capito il comando. Prova a chiedere aiuto.')
            .getResponse();
    },
};

let skill;

exports.handler = async function (event, context) {
    console.log(`REQUEST++++${JSON.stringify(event)}`);
    if (!skill) {
        skill = Alexa.SkillBuilders.standard()
            .addRequestHandlers(
                LaunchRequestHandler,
                ReadRSSHandler,
                RunWorkflowHandler,
                WorkflowRepeatHandler,
                HelpIntentHandler,
                CancelIntent,
                StopIntentHandler,
                SessionEndedRequestHandler
            )
            .addErrorHandlers(ErrorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    console.log(`RESPONSE++++${JSON.stringify(response)}`);

    return response;
};

/*
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder.addRequestHandlers(
    LaunchRequestHandler,
    WorkflowRepeatHandler,
    HelpIntentHandler,
    CancelIntent,
    StopIntentHandler,
    SessionEndedRequestHandler,
    ErrorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
*/