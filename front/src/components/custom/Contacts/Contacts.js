import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem} from "./redux/actions";
import {List} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class Contacts extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: [
            {
                id: 'm1551792177575m0',
                name: 'Contact1'
            },
            {
                id: 'm1551792177571m0',
                name: 'Contact2'
            }
        ]
    };

    /**
     * Получить список контактов
     * Отобразить список контактов
     * */

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
        const mainClass = 'c-contacts';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <List>
                        {list.map(item => <div className={`contact`}>{item.name}</div>)}
                    </List>
                </div>
            </div>
        )
    }
}

Contacts.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.array
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;

    const _object = state.Components.Contacts[cId];

    if(_object) {
        return ({
            flags: _object.flags,
            list: _object.list
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        initialize: (pcb) => initItem(cId, pcb),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Contacts);