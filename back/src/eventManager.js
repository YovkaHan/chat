const Firebase = require('./firebase');
const {Event, EventList, ConversationList, Participant, db} = Firebase();

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
        const {socket, userId} = props;

        this.socket = socket;
        this.userId = userId;
        this.conversationListner = undefined;
        this.conversationListners = {};

        this.setConversationListener();
        //this.setListeners();
    }

    async setConversationListener() {
        if (this.conversationListner) {
            this.conversationListner();
        }

        const user = await Participant.getUnsafe(this.userId);
        if (user.hasOwnProperty('conversations')) {
            const ref = await ConversationList.doc(user.conversations);
            ref.onSnapshot(docSnapshot => {

            });
        }
    }

    async setListeners() {
        const user = await Participant.getUnsafe(this.userId);
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
    function eventProcess(event){
        switch (event.name){
            case 'message.new': {
                /**Find Conversation*/
                /**Through conversation.participants and conversation.set create Events*/
                /**Push events to lists. Events "message.sent" to sender and "message.received" to participants except sender*/
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
                result[key] = _event.data[key];
            });

            return result;
        }else {
            return undefined;
        }
    }

    return {
        eventToData
    }
}

module.exports = function () {
    return {
        GlobalEventManager,
        LocalEventManager
    }
};
