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
        if (calls.length) {
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
                        mentee_intro={call.mentee_intro}
                    />
                )
            })
        }
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        let header = this.props.confirmed? `No confirmed calls!` : `No requests!`;
        let meta = this.props.confirmed? `This is where confirmed calls will appear` : `This is where new call requests from mentees will appear...`;
        let desc = this.props.confirmed? `Please confirm calls you want to accept from backlog.` : `Consider editing your time availabilities if you're really itching to consult a mentee!`;
        return (
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>{header}</Card.Header>
                    <Card.Meta>{meta}</Card.Meta>
                    <Card.Description>
                    {desc}
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }

    render() {
        return (  
            <Container>
                {this.renderRequestCards(this.props.calls)}
            </Container>
          )
    }
}
