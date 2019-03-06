import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class List extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        data: [],
        Item: null
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
        const {flags, className, rootClass, pcb, list, children, Item} = props;
        const mainClass = 'c-list';

        const child = (c, index) => (
            React.cloneElement(
                c,
                {
                    key: index,
                    className: `${innerClass('content', mainClass, rootClass)} ${c.props.className}`
                }
            )
        );

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    {data.map( i => (
                        <Item className={innerClass('item', mainClass, rootClass)} data={i}/>
                    ))}
                </div>
                {
                    children.map ? children.map((c, index) => {
                        const _child = child(c, index);
                        return _child;
                    }) : child(children)
                }
            </div>
        )
    }
}

List.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    data: PropTypes.array
};


const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const _object = state.Components.List[cId];

    if(_object) {
        return ({
            flags: _object.flags,
            value: props.value ? props.value : _object.value
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        initialize: (pcb) => initialize(cId, pcb),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(List);