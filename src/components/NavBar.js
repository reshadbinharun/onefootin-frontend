import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Profile from './Profile'
import MentorConnections from './MentorConnections';
import MentorNetwork from './MentorNetwork';
import Schedule from './Schedule';
import ScheduleForm from './ScheduleForm';

export const MY_PROFILE = 'My Profile';
export const MY_MENTOR_CONNECTIONS = 'My Mentor Connections';
export const MENTOR_NETWORK = 'Mentor Network';
export const SCHEDULINGS = 'Schedulings';
export const MENTOR_PROFILE = 'Mentor Profile'
export const NEW_CALL = 'New Call'

export default class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MY_PROFILE,
            mentorPicked: false,
            mentor: ''
        }
        this.handleNewSchedule = this.handleNewSchedule.bind(this);
        this.handleNewScheduleWithMentor = this.handleNewScheduleWithMentor.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleNewSchedule(e) {
        e.preventDefault();
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: false,
            mentor: ''
        })
    }

    handleNewScheduleWithMentor(value) {
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: true,
            mentor: value
        })
    }

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MY_PROFILE:
                return <Profile 
                    image={this.props.image}
                    name={this.props.name}
                    school={this.props.school}
                    memberSince={this.props.memberSince}
                    connections={this.props.connections}
                />
            case MY_MENTOR_CONNECTIONS:
                return <MentorConnections/>
            case MENTOR_NETWORK:
                return <MentorNetwork
                    pickMentor={this.handleNewScheduleWithMentor}
                    />
            case SCHEDULINGS:
                return <Schedule
                getForm={this.handleNewSchedule}
                />
            case NEW_CALL:
                return <ScheduleForm
                    mentorPicked={this.state.mentorPicked}
                    mentor={this.state.mentor}
                    />
            case MENTOR_PROFILE:
                return null
            default:
                return null
        }
    }

    render() {
        const { activeItem } = this.state

        return (
        <div>
            <Menu pointing>
                <Menu.Item name={MY_PROFILE} active={activeItem === MY_PROFILE} onClick={this.handleItemClick} />
                <Menu.Item
                    name={MY_MENTOR_CONNECTIONS}
                    active={activeItem === MY_MENTOR_CONNECTIONS}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={MENTOR_NETWORK}
                    active={activeItem === MENTOR_NETWORK}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={SCHEDULINGS}
                    active={activeItem === SCHEDULINGS}
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
