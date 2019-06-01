const Firebase = require('./firebase');
const aesWrapper = require('./aes-wrapper');
const {Event, EventList, ConversationList, Participant, Conversation, Message} = Firebase();
const R = require('rambda');

const dataFromEvent = {
    'message.new': {
        message: {
            /*
           date
           data
           from
           (to)
           * */
        },
        conversation: {
            /*
            id
            set
            messageListId
            * */
        }
    },
};

const OuterEvent = (data) => {
    const result = {};
    try {
        result.name = data.name;
        result.data = data.data;
    } catch (e) {
        console.error(e);
    }
    return result;
};

class LocalEventManager {
    constructor(props) {
        const {socket, userId, lastEvents, tokenObject} = props;

        this.socket = socket;
        this.userId = userId;
        this.lastEvents = R.clone(lastEvents);
        this.tokenObject = tokenObject;
        this.conversationListner = undefined;
        this.conversationListners = {};

        this.setConversationListener();
        //this.setListeners();
    }

    async setConversationListener() {
        if (this.conversationListner) {
            this.conversationListner();
        }

        const conversations = await Participant.safeGet({id: this.userId, get: 'conversations'});

        if (conversations) {
            /**Pass last events*/
            const EventArrays = {};
            await Promise.all(Object.keys(this.lastEvents).map(async key => {
                const event = this.lastEvents[key];

                EventArrays[key] = await EventList.getEventArray({eventId: event, conversationId: key, userId: this.userId});

                EventArrays[key] = await Promise.all(EventArrays[key].map(async item => await Event.get({id: item})));
            }));



            const aesKey = Buffer.from(this.tokenObject.aesKey, 'base64');

            this.socket.emit('event.manager.arrays', {
                msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(EventArrays))
            })

            // await Promise.all(Object.keys(conversations).map(async c=>{
            //     const _c = conversations[c];
            //     const ref = await EventList.eventsRef({userId: this.userId, conversationId: _c.id});
            //
            //     ref.onSnapshot(docSnapshot => {
            //
            //     });
            // }));
        }
    }

    async setListeners() {
        const conversations = await Participant.safeGet({id: this.userId, get: 'conversations'});
        if (conversations.length) {
            user.conversations.map(cId => {

            })
        } else {
            return undefined;
        }
    }

    destroy() {
        this.conversationListner();
        Object.keys(this.conversationListners).map(key => {
            this.conversationListners[key]();
        });
    }
}

function GlobalEventManager(){
    async function eventProcess(event, other){
        switch (event.name){
            case 'message.new': {
                /**Find Conversation*/
                const eventData = eventToData(event);
                const {message, conversation} = eventData;
                const {msgId} = other;

                /**Through conversation.participants and conversation.set create Events*/

                const conRes = await Conversation.get({id: conversation.id});
                const {participants, set} = conRes;

                const msgRef = await Message.getRef({id: msgId});

                const messageSentEvent = await Event.add({name: 'message.sent', data: {message: msgRef}});
                const messageReceivedEvent = await Event.add({name: 'message.received', data: {message: msgRef}});

                /**Push events to lists. Events "message.sent" to sender and "message.received" to participants except sender*/

                const _participants = {
                    sender: undefined,
                    receivers: []
                };
                await function () {
                  return new Promise(resolve => {
                      Promise.all(participants.map(async p=>{
                          if(p === message.from){
                              _participants.sender = await Participant.get({login: p});
                          }else {
                              _participants.receivers.push(await Participant.get({login: p}));
                          }
                      })).then(()=>{
                          resolve();
                      });
                  })
                }();

                const senderEL = await EventList.get({userId: _participants.sender.id, conversationId: conversation.id});
                const receiversEL = await Promise.all(_participants.receivers.map(async r=>{
                  return await EventList.get({userId: r.id, conversationId: conversation.id});
                }));

                await EventList.addEvent({id: senderEL.id, event: messageSentEvent});
                await Promise.all(receiversEL.map(async r=>{
                    return await EventList.addEvent({id: r.id, event: messageReceivedEvent});
                }));

                break;
            }
            case 'message.edit': {
                /**Find Conversation*/
                /**Through conversation.participants and conversation.set create Event*/
                /**Push events to lists. Events "message.edited" to all participants*/
                break;
            }
            case 'message.delete': {
                /**Find Conversation*/
                /**Through conversation.participants and conversation.set create Event*/
                /**Push events to lists. Events "message.deleted" to all participants*/
                break
            }
            default: {

            }
        }
    }

    function eventToData(event){
        const _event = OuterEvent(event);

        if(dataFromEvent.hasOwnProperty(_event.name)){
            const resObj = dataFromEvent[_event.name];
            const result = {};

            Object.keys(resObj).map(key=>{
                result[key] = R.clone(_event.data[key]);
            });

            return result;
        }else {
            return undefined;
        }
    }

    return {
        eventToData,
        eventProcess
    }
}

module.exports = function () {
    return {
        GlobalEventManager,
        LocalEventManager
    }
};
