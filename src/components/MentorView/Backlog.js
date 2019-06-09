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
                    // TODO: fetch info about mentor on getAllRequests backend call
                    // menteeName={call.mentee.name}
                    // menteeSchool={call.mentee.school}
                    // menteeLocation={call.mentee.location}
                    topic={call.location}
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
