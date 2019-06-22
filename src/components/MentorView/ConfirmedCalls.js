// TODO: Deprecated, remove
/* eslint-disable max-len */
import React from 'react'
import { Container } from 'semantic-ui-react'
import ConfirmedCallCard from './ConfirmedCallCard';

export default class ConfirmedCalls extends React.Component {
    constructor(props){
        super(props);
        this.renderRequestCards = this.renderRequestCards.bind(this);
    }

    renderRequestCards(calls) {
        return calls.map(call => {
            return (
                <ConfirmedCallCard
                    // TODO: fetch info about mentor on getAllRequests backend call + adjust to Mentor's timezone
                    mentorTimeZone={this.props.mentorTimeZone}
                    topic={call.topic}
                    time={call.dateTime}
                    requestId={call.id}
                    mentee={call.mentee}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                {this.renderRequestCards(this.props.backlog)}
            </Container>
          )
    }
}
