import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {initializePanel} from './redux/actions';
import Channel from '../Channel/index';

import {bindActionCreators} from 'redux';

class Panel extends React.Component {
    static defaultProps = {
        className: '',
        rootClass: ''
    };

    constructor(props) {
        super(props);

        props.initializePanel();
    }

    render() {
        const {props} = this;
        const {className, children, rootClass} = props;
        const mainClass = 'c-panel';

        const child = (c, index) => {

            return (
                <div key={index} className={`${mainClass}__item ${rootClass ? rootClass+'__item' : ''}`}>
                    {
                        React.cloneElement(
                            c,
                            {
                                rootClass: c.props.rootClass ? c.props.rootClass : rootClass
                            }
                        )
                    }
                </div>
            );
        };

        return (
            <div className={`${mainClass} ${className} ${rootClass}`}>
                <div className={`${mainClass}__content ${rootClass ? rootClass + '__content' : ''}`}>
                    {
                        children.map ? children.map((c, index) => {
                            const _child = child(c, index);
                            return _child;
                        }) : child(children)
                    }
                </div>
            </div>
        )
    }
}

Panel.propTypes = {
    pcb: PropTypes.object,
    className: PropTypes.string,
    rootClass: PropTypes.string
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const relations = props.pcb.relations;

    return {};
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        initializePanel: () => initializePanel(cId, props.pcb.config)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Panel);
