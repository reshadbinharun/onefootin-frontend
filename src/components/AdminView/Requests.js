/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import { BACKEND } from "../../App";
import RequestCard from './RequestCard';

const compName = 'Requests_LS';

export default class Requests extends React.Component {
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
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllRequestsByAdmin`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
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
                <RequestCard
                    // TODO: add time adjusted for admin
                    menteeNameSchool={request.menteeNameSchool}
                    mentorNameCollege={request.mentorNameCollege}
                    topic={request.topic}
                    status={request.status}
                    feedback={request.feedback}
                    menteeIntro={request.menteeIntro}
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
                    {this.renderRequestCards(this.state.requests)}
                </Container>
            </Container>
        )
    }
}
