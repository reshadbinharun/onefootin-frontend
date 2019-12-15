/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import { BACKEND } from "../../App";
import SchoolRequestCard from './SchoolRequestCard';

const compName = 'SchoolRequests_LS';

export default class SchoolRequests extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            moderatorRequests: [],
        }
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount(){
        window.addEventListener('beforeunload', this.componentCleanup);
        // TODO: await on restore before making calls? Do not make calls if state is restored?
        const persistState = sessionStorage.getItem(compName);
        if (persistState) {
          try {
            this.setState(JSON.parse(persistState));
          } catch (e) {
            console.log("Could not get fetch state from local storage for", compName);
          }
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getSchoolGeneratedRequests`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                moderatorRequests: resolvedRes && resolvedRes.moderatorRequests
            });
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    renderRequestCards(RequestObjects) {
        if (!RequestObjects) {
            return null;
        }
        return RequestObjects.map(request => {
            return (
                <SchoolRequestCard
                    // TODO: add time adjusted for admin
                    requestId={request.id}
                    schoolName={request.school.name}
                    menteeId={request.mentee.id}
                    menteeName={request.mentee.name}
                    paired={request.paired}
                    topic={request.topic}
                    mentorName={request.mentor && request.mentor.name }
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Grid>
                    <Grid.Column width={10}>
                        There as {this.state.requests.length} Requests logged on the platform.
                    </Grid.Column>
                </Grid>
                <Container>
                    {this.renderRequestCards(this.state.moderatorRequests)}
                </Container>
            </Container>
        )
    }
}
