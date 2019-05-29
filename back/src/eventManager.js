const Firebase = require('./firebase');
const {Event, EventList, ConversationList, Participant, Conversation, Message} = Firebase();

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
        const {socket, userId, lastEvents} = props;

        this.socket = socket;
        this.userId = userId;
        this.lastEvents = lastEvents;
        this.conversationListner = undefined;
        this.conversationListners = {};

        this.setConversationListener();
        //this.setListeners();
    }

    async setConversationListener() {
        if (this.conversationListner) {
            this.conversationListner();
        }

        const user = await Participant.getUnsafe({id: this.userId});
        if (user.hasOwnProperty('conversations')) {
            const ref = await ConversationList.doc(user.conversations);
            ref.onSnapshot(docSnapshot => {

            });
        }
    }

    async setListeners() {
        const user = await Participant.getUnsafe({id: this.userId});
        if (user.hasOwnProperty(conversations)) {
            const cL = await ConversationList.get(user.conversations);

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
                result[key] = JSON.parse(JSON.stringify(_event.data[key]));
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
