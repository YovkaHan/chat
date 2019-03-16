import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button, List, Message} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class MessageList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: [{
            id: 'm1551792177575m0',
            from: 'TestFrom',
            createItem: () => {console.log('createItem function')},
            msg: 'Hello. My name is Test and this is test-message!',
            date: 1551792177575
        }]
    };

    constructor(props){
        super(props);

        props.initialize(props.pcb);

        //  this.handleClick = ::this.handleClick;
    }

    // async handleClick(e){
    //     await this.props.defaultClick(e);
    //     await this.props.click(e);
    // };

    render(){
        const {props, state, handleClick} = this;
        const {flags, className, rootClass, pcb, list} = props;
        const mainClass = 'my-msg-list';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <List
                        data={list}
                        Item={Message.Component}
                        itemProps={{core:{pcb, template: 'Message0', component: 'Message'}}}
                    />
                </div>
            </div>
        )
    }
}

MessageList.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.array
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const {List} = props.pcbMade.relations;

    const _object = state.Components.MessageList[cId];
    const _list = state.Components[List.component][List.id].list;

    if(_object) {
        return ({
            flags: _object.flags,
            list: _list
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        initialize: (pcb) => initialize(cId, pcb),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(MessageList);