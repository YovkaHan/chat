import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {connectToChat, sendMessage, startChanel} from './redux/actions';
import * as R from 'ramda';

import {bindActionCreators} from 'redux';

const template = (c, props, relations) => {
    const rObject = relations[Object.keys(relations).find(name => c.props.relation === name)];

    if(rObject){
        return  React.cloneElement(
            c,
            props[c.props.relation]
        );
    }
    return null;
};

class Channel extends React.Component {
    static defaultProps = {
        className: '',
        rootClass: ''
    };

    constructor(props) {
        super(props);

        props.startChanel();
    }

    render() {
        const {props} = this;
        const {pcb, children, rootClass, meta, connectToChat, sendMessage} = props;

        const child = (c, index) => (
            React.cloneElement(
                template(c, {
                    Connect: {
                        click: connectToChat
                    },
                    Lamp: {
                        meta
                    },
                    Message: {
                        click: sendMessage
                    }
                } ,pcb.relations),
                {
                    key: index,
                    rootClass: c.props.rootClass ? c.props.rootClass : rootClass,
                    pcb: pcb.make(pcb.relations[c.props.relation].name),
                }
            )
        );

        return (
          <React.Fragment>
              {
                  children.map ? children.map((c, index) => {
                      const _child = child(c, index);
                      return _child;
                  }) : child(children)
              }
          </React.Fragment>
        )
    }
}

Channel.propTypes = {
    pcb: PropTypes.object,
    className: PropTypes.string,
    rootClass: PropTypes.string,
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const relations = props.pcb.relations;

    return {
        data: state.Components.Channel[cId].result ? state.Components.Channel[cId].result.data : [],
        meta: {
            status: state.Components.Channel[cId].result && state.Components.Channel[cId].result.status ? state.Components.Channel[cId].result.status : '',
            error: state.Components.Channel[cId].result && state.Components.Channel[cId].result.error? state.Components.Channel[cId].result.error : undefined
        }
    };
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;
    const {to, from} =  R.path(['pcb', 'config'], props) ? props.pcb.config : {from: 0, to: 0};

    return bindActionCreators({
        startChanel: () => startChanel(cId),
        connectToChat: () => connectToChat(cId),
        sendMessage: () => sendMessage(cId, from, to)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Channel);
