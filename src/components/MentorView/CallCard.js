import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { BACKEND } from "../../App"
import { convertToViewerTimeZone } from "../TimezoneAdjustmentHelpers"

export default class CallCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
    }
    handleConfirm(e) {
        console.log("clicked confirm");
        e.preventDefault();
        let confirmPayload = {
            requestId: this.props.requestId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/confirmRequest`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(confirmPayload)
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
                //TODO: Use react alert
                alert(`You've confirmed a call with ${this.props.mentee.name}. Your new state of backlog will be reflected upon next login.`)
            }
        });
    }
    render() {
        const {mentee, topic, time, mentorTimeZone} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            // TODO: update confirm/dismiss with backend calls
            // TODO: adjustTime to mentor's timeZone
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Request from {mentee.name}</Card.Header>
                    <Card.Meta>Topic {topic} at { convertToViewerTimeZone(time, mentorTimeZone) }</Card.Meta>
                    <Card.Description>
                        {mentee.name} attends {mentee.school} and is from {mentee.location}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button 
                        onClick={(e) => this.props.confirmed ? this.props.getRequestForVideoMentor(this.props.requestId, mentee.name) : this.handleConfirm(e)}
                        basic color='dark orange'>
                        {this.props.confirmed ? 'Join Video Call' : 'Confirm'}
                    </Button>
                    {/* TODO: Include ability to cancell requests for mentors */}
                    <Button basic color='yellow' disabled>
                        Dismiss
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}