import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Students from './Students';
import SchoolRequests from './SchoolRequests';
import SchoolMentors from './SchoolMentors';
import SchoolDashboard from "./SchoolDashboard"

const compName = 'NavBarSchoolAdmin_LS';

const REQUESTS = 'Requests';
const MENTORS = 'Mentors';
const STUDENTS = 'Students'
const DASHBOARD = 'Dashboard'

export default class NavBarSchoolAdmin extends Component {
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
            // TODO: change props
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
            case REQUESTS:
                return <SchoolRequests
                        schoolId={this.state.data.school.id}
                    />
            case MENTORS:
                return <SchoolMentors
                />
            case STUDENTS:
                return <Students
                />
            case DASHBOARD:
                    return <SchoolDashboard
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
                    name={STUDENTS}
                    active={activeItem === STUDENTS}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={DASHBOARD}
                    active={activeItem === DASHBOARD}
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
