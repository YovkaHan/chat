import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' ' + rootClass + '__' + sufix : ''}`.trim()
};

class List extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        data: [],
        Item: null,
        itemProps: {},
        children: []
    };

    constructor(props) {
        super(props);

        this.state = {
            dataLength: props.data.length,
            status: 1
        };

        this.listElement = React.createRef();
    }

    // componentDidUpdate() {
    //     if (this.state.dataLength !== this.props.data.length) {
    //         this.setState({
    //             dataLength: this.props.data.length,
    //             status: 0
    //         })
    //     }
    //     if (!this.state.status && this.listElement.current) {
    //         console.log(this.listElement.current.scrollTop, this.listElement.current.scrollHeight);
    //         this.listElement.current.scrollTop = this.listElement.current.scrollHeight;
    //         console.log(this.listElement.current.scrollTop, this.listElement.current.scrollHeight);
    //         this.setState({
    //             status: 1
    //         })
    //     }
    // }

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, data, children, Item, itemProps} = props;
        const mainClass = 'c-list';

        if (this.listElement.current)
            this.listElement.current.scrollTop = this.listElement.current.scrollHeight;

        const child = (c, index) => (
            React.cloneElement(
                c,
                {
                    key: index,
                    className: `${innerClass('content', mainClass, rootClass)} ${c.props.className}`
                }
            )
        );

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)} ref={this.listElement}>
                    {data.map(i => (
                        <Item
                            {...itemProps}
                            {...i}
                            key={i.id}
                            className={innerClass('item', mainClass, rootClass)}/>))
                    }
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

List.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    data: PropTypes.array,
    Item: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ])
};

export default List;