/* eslint-disable max-len */
import React from 'react'
import { Container } from 'semantic-ui-react'
import CallCard from './CallCard';

export default class Backlog extends React.Component {
    constructor(props){
        super(props);
        this.renderRequestCards = this.renderRequestCards.bind(this);
    }

    renderRequestCards(calls) {
        return calls.map(call => {
            return (
                <CallCard
                    mentorTimeZone={this.props.mentorTimeZone}
                    topic={call.topic}
                    time={call.dateTime}
                    requestId={call.id}
                    meetingRoom={call.mentor.zoom_info}
                    mentee={call.mentee}
                    confirmed={this.props.confirmed}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                {this.renderRequestCards(this.props.calls)}
            </Container>
          )
    }
}
