import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Profile from '../Profile'
import { BACKEND } from "../../App"
import Backlog from "./Backlog";

// TODO: Deprecated, remove
// import ConfirmedCalls from "./ConfirmedCalls"

export const MY_PROFILE = 'My Profile';
export const BACKLOG = 'Backlog';
export const CONFIRMED_CALLS = 'Confirmed Calls';
// export const MY_OFFICE = 'My Office'

export default class NavBarMentor extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MY_PROFILE,
            data: {},
            requests: null,
        }
        this.getRequests = this.getRequests.bind(this);
        this.getConfirmedCalls = this.getConfirmedCalls.bind(this);
        this.getBacklog = this.getBacklog.bind(this);
    }

    getConfirmedCalls() {
        return this.state.requests.filter(request => request.confirmed)
    }

    getBacklog() {
        return this.state.requests.filter(request => !request.confirmed)
    }

    async getRequests(mentorId) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        await fetch(`${BACKEND}/getRequests`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                mentorId: mentorId
            })
        }).then(async res => {
            let resolvedRes = await res;
            if (res.status !== 200) {
                console.log("Request getRequests failed");
            } else {
                resolvedRes = await resolvedRes.json()
                this.setState({
                    requests: resolvedRes
                })
            }
        });

    }

    componentDidMount() {
        this.setState({
            data: this.props.payload.mentor
        }, async () => {
            await this.getRequests(this.state.data.id)
        })

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MY_PROFILE:
                return <Profile
                    email={this.state.data.email} //for profile editing purposes
                    image={this.state.data.image}
                    name={this.state.data.name}
                    school={this.state.data.school}
                    memberSince={this.state.data.memberSince}
                    aboutYourself={this.state.data.aboutYourself}
                    isMentor={true}
                    position={this.state.data.position}
                    major={this.state.data.major}
                    location={this.state.data.location}
                    timeZone={this.state.data.timeZone}
                    zoom_info={this.state.data.zoom_info}
                />
            case BACKLOG:
                return <Backlog
                    calls = {this.getBacklog()}
                    mentorTimeZone = {this.state.data.timeZone}
                    confirmed = {false}
                />
            case CONFIRMED_CALLS:
                return <Backlog
                    calls = {this.getConfirmedCalls()}
                    mentorTimeZone = {this.state.data.timeZone}
                    confirmed = {true}
                    mentorEmail={this.state.data.email}
                    mentorName={this.state.data.name}
                />
            default:
                return null
        }
    }

    render() {
        const { activeItem } = this.state.activeItem;
        return (
        <div>
            <Menu pointing>
                <Menu.Item name={MY_PROFILE} active={activeItem === MY_PROFILE} onClick={this.handleItemClick} />
                <Menu.Item
                    name={BACKLOG}
                    active={activeItem === BACKLOG}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={CONFIRMED_CALLS}
                    active={activeItem === CONFIRMED_CALLS}
                    onClick={this.handleItemClick}
                />
                {/* <Menu.Item
                    name={MY_OFFICE}
                    active={activeItem === MY_OFFICE}
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
