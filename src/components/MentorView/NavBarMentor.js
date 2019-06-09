import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Profile from '../Profile'
import { BACKEND } from "../../App"
import Backlog from "./Backlog";
import ConfirmedCalls from "./ConfirmedCalls"

export const MY_PROFILE = 'My Profile';
export const BACKLOG = 'Backlog';
export const CONFIRMED_CALLS = 'Confirmed Calls';

export default class NavBarMentor extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MY_PROFILE,
            data: {},
            backlog: null,
        }
        this.getBacklog = this.getBacklog.bind(this);
    }

    async getBacklog(mentorId) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllRequests`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                backlog: resolvedRes
            });
        });
        // TODO: make route that gets matching requests only
        // fetch(`${BACKEND}/getBacklog`, {
        //     method: 'post',
        //     credentials: 'include',
        //     headers: headers,
        //     body: JSON.stringify({
        //         mentorId: mentorId
        //     })
        // }).then(async res => {
        //     let resolvedRes = await res;
        //     resolvedRes = await resolvedRes.json()
        // });
    }

    componentDidMount() {
        this.setState({
            data: this.props.payload.mentor
        }, async () => {
            await this.getBacklog(this.state.data.id)
        })

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MY_PROFILE:
                return <Profile 
                    // image={this.props.image}
                    name={this.state.data.name}
                    school={this.state.data.school}
                    // memberSince={this.props.memberSince}
                />
            case BACKLOG:
                return <Backlog
                    backlog = {this.state.backlog}
                />
            case CONFIRMED_CALLS:
                return <ConfirmedCalls
                    calls = {this.state.data.confirmedRequests}
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
                </Menu>
            <Segment>
                {this.renderNavSelection()}
            </Segment>
        </div>
        )
    }
}
