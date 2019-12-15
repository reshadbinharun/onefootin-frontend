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
            requests: [],
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
        let payload = {
            schoolId: this.props.schoolId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getModeratorRequestsBySchool`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                requests: resolvedRes && resolvedRes.requests
            });
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    renderRequestCards(RequestObjects) {
        return RequestObjects.map(request => {
            return (
                <SchoolRequestCard
                    topic={request.menteeNameSchool}
                    menteeName={request.mentee.name}
                    mentorName={request.mentor && request.mentor.name}
                    paired={request.paired}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Grid>
                    <Grid.Column width={10}>
                        You have made {this.state.requests.length} requests via the school portal.
                    </Grid.Column>
                </Grid>
                <Container>
                    {this.renderRequestCards(this.state.requests)}
                </Container>
            </Container>
        )
    }
}
