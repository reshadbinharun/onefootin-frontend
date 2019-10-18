import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Dashboard from './Dashboard';
import Mentees from './Mentees';
import Requests from './Requests';
import Mentors from './Mentors';

const compName = 'NavBarMentee_LS';

export const DASHBOARD = 'Dashboard';
export const REQUESTS = 'Requests';
export const MENTORS = 'Mentors';
export const MENTEES = 'Mentees'

export default class NavBarMentee extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: DASHBOARD,
            data: {},
        }
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
        const persistState = sessionStorage.getItem(compName);
            if (persistState) {
            try {
                this.setState(JSON.parse(persistState));
            } catch (e) {
                console.log("Could not get fetch state from local storage for", compName);
            }
        }
        this.setState({
            data: this.props.payload.mentee
        })
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case DASHBOARD:
                return <Dashboard
                />
            case REQUESTS:
                return <Requests
                    />
            case MENTORS:
                return <Mentors
                />
            case MENTEES:
                return <Mentees
                />
            default:
                return null
        }
    }

    render() {
        const { activeItem } = this.state

        return (
        <div>
            <Menu pointing>
                <Menu.Item name={DASHBOARD} active={activeItem === DASHBOARD} onClick={this.handleItemClick} />
                <Menu.Item
                    name={REQUESTS}
                    active={activeItem === REQUESTS}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={MENTORS}
                    active={activeItem === MENTORS}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={MENTEES}
                    active={activeItem === MENTEES}
                    onClick={this.handleItemClick}
                />
                </Menu>
            <Segment>
                {this.renderNavSelection()}
            </Segment>
        </div>
        )
    }
}