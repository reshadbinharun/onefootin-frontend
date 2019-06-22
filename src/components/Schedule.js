/* eslint-disable max-len */
import React from 'react'
import { Container, Button, Segment, Icon } from 'semantic-ui-react'
import ScheduleCard from './ScheduleCard';
import { BACKEND } from "../App"
import { convertToViewerTimeZone } from "./MentorView/CallCard"

export default class Schedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            schedules: [],
            menteeId: null,
        }
        this.renderScheduleCards = this.renderScheduleCards.bind(this);
    }
    
    // TODO: use BACKEND to list confirmed calls
    componentDidMount() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        this.setState({
            menteeId: this.props.menteeId
        }, async () => 
            await fetch(`${BACKEND}/getConfirmedRequestsForMentee`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    menteeId: this.props.menteeId,
                })
            }).then(async res => {
                let resolvedRes = await res;
                if (resolvedRes.status !== 200) {
                    console.log("Request to get mentee schedules was not successful")
                } else {
                    resolvedRes = await res.json()
                    this.setState({
                        schedules: resolvedRes
                    })
                }
            })
        );
    }
    
    renderScheduleCards() {
        return this.state.schedules && this.state.schedules.map(request => {
            return (
                <ScheduleCard
                    time={convertToViewerTimeZone(request.dateTime, request.mentee.timeZone, request.mentor.timeZone)}
                    topic={request.topic}
                    mentor={request.mentor.name}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Container>
                    <Segment attached='top'>
                        Schedule a New Call
                    </Segment>
                    <Button attached='bottom' animated='vertical' onClick={this.props.getForm}>
                        <Button.Content hidden>Schedule!</Button.Content>
                        <Button.Content visible>
                            <Icon name='calendar alternate outline' />
                        </Button.Content>
                    </Button>
                </Container>
                <Container>
                    {this.renderScheduleCards()}
                </Container>
            </Container>
          )
    }
}
