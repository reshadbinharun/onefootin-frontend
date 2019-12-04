import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Profile from './Profile'
import MentorNetwork from './MentorNetwork';
import Schedule from './Schedule';
import ScheduleForm from './ScheduleForm';
import ScheduleFormMentorPicked from './ScheduleFormMentorPicked';

const compName = 'NavBarMentee_LS';

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
            mentorId: '',
            mentorPickedForView: null,
        }
        this.handleNewSchedule = this.handleNewSchedule.bind(this);
        this.handleNewScheduleWithMentor = this.handleNewScheduleWithMentor.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.viewMentorProfile = this.viewMentorProfile.bind(this);
        this.goBackToMentorNetwork = this.goBackToMentorNetwork.bind(this);
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

    handleNewSchedule(e) {
        e.preventDefault();
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: false,
            mentorId: ''
        })
    }

    goBackToMentorNetwork() {
        this.setState({
            activeItem: MENTOR_NETWORK
        })
    }

    handleNewScheduleWithMentor(value) {
        this.setState({
            activeItem: NEW_CALL,
            mentorPicked: true,
            mentorId: value
        })
    }

    viewMentorProfile(value) {
        this.setState({
            activeItem: MENTOR_PROFILE,
            mentorFetchedForView: value,
        })
    }

    renderNavSelection() {
        let school = this.state.data.schoolCustom ? this.state.data.schoolCustom : this.state.data.school ? this.state.data.school.name : 'None listed.'
        switch(this.state.activeItem) {
            case MY_PROFILE:
                return <Profile
                    trackingId={this.state.data.tracking && this.state.data.tracking.id}
                    id={this.state.data.id}
                    email={this.state.data.email}
                    image={this.state.data.image}
                    name={this.state.data.name}
                    school={school}
                    memberSince={this.state.data.memberSince}
                    aboutYourself={this.state.data.aboutYourself}
                    location={this.state.data.location}
                    isMentor={false}
                />
            case MENTOR_NETWORK:
                return <MentorNetwork
                    pickMentor={this.handleNewScheduleWithMentor}
                    viewMentorProfile={this.viewMentorProfile}
                    />
            case SCHEDULINGS:
                return <Schedule
                    getForm={this.handleNewSchedule}
                    menteeId={this.state.data.id}
                    menteeEmail={this.state.data.email}
                    menteeName={this.state.data.name}
                />
            case NEW_CALL:
                return (this.state.mentorPicked? 
                    <ScheduleFormMentorPicked
                        mentorId={this.state.mentorId}
                        menteeId={this.state.data.id}
                        menteeTimeZone={this.state.data.timeZone}
                        goBackToMentorNetwork={this.goBackToMentorNetwork}
                        />:
                    <ScheduleForm
                        menteeId={this.state.data.id}
                        menteeTimeZone={this.state.data.timeZone}
                    />)
            case MENTOR_PROFILE:
                return <Profile
                    id={this.state.mentorFetchedForView.id}
                    image={this.state.mentorFetchedForView.image}
                    name={this.state.mentorFetchedForView.name}
                    school={this.state.mentorFetchedForView.school}
                    memberSince={this.state.mentorFetchedForView.memberSince}
                    aboutYourself={this.state.mentorFetchedForView.aboutYourself}
                    position={this.state.mentorFetchedForView.position}
                    major={this.state.mentorFetchedForView.major}
                    location={this.state.mentorFetchedForView.location}
                    timeZone={this.state.mentorFetchedForView.timeZone}
                    languages={this.state.mentorFetchedForView.languages}
                    viewMode={true}
                    isMentor={true}
                    goBackToMentorNetwork={this.goBackToMentorNetwork}
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
                {/* <Menu.Item
                    name={MY_APPT}
                    active={activeItem === MY_APPT}
                    onClick={this.handleItemClick}
                /> */}
                </Menu>
            <Segment>
                {this.renderNavSelection()}
            </Segment>
        </div>
        )
    }
}
