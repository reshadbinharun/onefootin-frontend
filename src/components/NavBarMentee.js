import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Profile from './Profile'
import MentorNetwork from './MentorNetwork';
import Schedule from './Schedule';
import ScheduleForm from './ScheduleForm';
import ScheduleFormMentorPicked from './ScheduleFormMentorPicked';

export const MY_PROFILE = 'My Profile';
export const MENTOR_NETWORK = 'Mentor Network';
export const SCHEDULINGS = 'Schedulings';
export const MENTOR_PROFILE = 'Mentor Profile'
export const NEW_CALL = 'New Call'

//TODO: adapt to mentee login model --> currently copied from mentor login
export default class NavBarMentee extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MY_PROFILE,
            data: {},
            schedule: null,
            mentorPicked: false,
            mentorId: ''
        }
        this.getSchedule = this.getSchedule.bind(this);
        this.handleNewSchedule = this.handleNewSchedule.bind(this);
        this.handleNewScheduleWithMentor = this.handleNewScheduleWithMentor.bind(this);
    }

    componentDidMount() {
        console.log("mentee data is", this.props.payload)
        this.setState({
            data: this.props.payload.mentee
        }, async () => {
            await this.getSchedule(this.state.data.id)
        })
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    async getSchedule(menteeId) {
        //TODO: get list of requests for mentee from backend
        console.log("getSchedule called")
    }

    handleNewSchedule(e) {
        e.preventDefault();
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: false,
            mentorId: ''
        })
    }

    handleNewScheduleWithMentor(value) {
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: true,
            mentorId: value
        })
    }

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MY_PROFILE:
                return <Profile 
                    // TODO: add image when it is present in database
                    // image={this.props.image}
                    name={this.state.data.name}
                    school={this.state.data.school}
                    memberSince={this.state.data.memberSince}
                    aboutYourself={this.state.data.aboutYourself}
                    isMentor={false}
                />
            case MENTOR_NETWORK:
                return <MentorNetwork
                    pickMentor={this.handleNewScheduleWithMentor}
                    />
            case SCHEDULINGS:
                return <Schedule
                    getForm={this.handleNewSchedule}
                    menteeId={this.state.data.id}
                />
            case NEW_CALL:
                return (this.state.mentorPicked? 
                    <ScheduleFormMentorPicked
                        mentorId={this.state.mentorId}
                        menteeId={this.state.data.id}
                        menteeTimeZone={this.state.data.timeZone}
                        />:
                    <ScheduleForm
                        menteeId={this.state.data.id}
                        menteeTimeZone={this.state.data.timeZone}
                    />)
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
