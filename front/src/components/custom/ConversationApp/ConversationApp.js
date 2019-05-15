import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, valueChange, connectApp, appAuthorize, logIn, connectionTry, appStageConnecting, deleteItem} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class ConversationApp extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        click: ()=>{}
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleView: 'conversations',
            userId: '1556984823_a8wjv9okahh'
        };

        this.madeChildren = {
            Profile: null,
            Contacts: null,
            Conversations: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });

        props.appAuthorize();

        this.handleClick = ::this.handleClick;
    }

    componentDidUpdate(){
        if(this.props.appPreparedToConnect){
            this.props.appStageConnecting();
            this.props.connectApp();
        } else if(this.props.connectionLost){
            this.props.connectionTry();
        }
    }

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    logInHandle = () => {
        this.props.logIn(this.state.userId);
    };

    render() {
        const {props, state, handleClick, logInHandle} = this;
        const {className, rootClass, pcb, pcbMade, view} = props;
        const {Profile, Contacts, Conversations} = this.madeChildren;
        const {visibleView, userId} = state;
        const mainClass = 'c-conv-app';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    {
                        view !== 'login' ? null :
                            (
                                <div className={`login`}>
                                    <div className={`input-block`}>
                                        <label>
                                            <span className={`input-block__name`}>User: </span>
                                            <input className={`input-block__value`}
                                                   name={`user`}
                                                   value={userId}
                                                   onChange={(e)=>{this.setState({userId: e.target.value})}}
                                            />
                                        </label>
                                    </div>
                                    <button className={`login__enter`} onClick={logInHandle}>Log in</button>
                                </div>
                            )
                    }
                    {
                        view !== 'main' ? null :
                            (
                               <React.Fragment>
                                   <div className={`${innerClass('item', mainClass, rootClass)} left`}>
                                       <div className={`top`}>
                                           <Profile
                                               core={{pcb, id: pcbMade.children['Profile'].id, component: pcbMade.children['Profile'].component}}
                                               rootClass={`profile`}
                                           />
                                       </div>
                                       <div className={`down`}>
                                           <div className={`menu menu--full visible-view`}>
                                               <div className={`menu__item`} onClick={()=>{this.setState({visibleView: 'conversations'})}}>Conversations</div>
                                               <div className={`menu__item`} onClick={()=>{this.setState({visibleView: 'contacts'})}}>Contacts</div>
                                           </div>
                                           <Conversations
                                               core={{pcb, id: pcbMade.children['Conversations'].id, component: pcbMade.children['Conversations'].component}}
                                               rootClass={`conversations`}
                                               style={visibleView === 'conversations' ? {} : {display: 'none'}}
                                           />
                                           <Contacts
                                               core={{pcb, id: pcbMade.children['Contacts'].id, component: pcbMade.children['Contacts'].component}}
                                               rootClass={`contacts`}
                                               style={visibleView === 'contacts' ? {} : {display: 'none'}}
                                           />
                                       </div>
                                   </div>
                                   <div className={`${innerClass('item', mainClass, rootClass)} right`}>

                                   </div>
                               </React.Fragment>
                            )
                    }
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
    }
}

ConversationApp.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    connectApp: PropTypes.func
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.ConversationApp[cId];

    const appPreparedToConnect = _object.flags.stage === 'prepared' && _object.flags.server === 'on' && _object.flags.serverConnection === 'on';
    const connectionLost = _object.flags.server === 'on' && _object.flags.serverConnection === 'off';

    if(_object) {
        return ({
            flags: _object.flags,
            list: _object.list,
            buffer: _object.buffer,
            view: _object.view,
            appPreparedToConnect,
            connectionLost
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        createItem: () => createItem(),
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        connectApp: () => connectApp(cId),
        appAuthorize: () => appAuthorize(cId),
        logIn: (userId) => logIn(cId, userId),
        connectionTry: () => connectionTry(cId),
        appStageConnecting: () => appStageConnecting(cId),
        deleteComponent: () => deleteItem(cId)
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ConversationApp);