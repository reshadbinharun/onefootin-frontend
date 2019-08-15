import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { BACKEND } from "../../App"
import { convertToViewerTimeZone } from "../TimezoneAdjustmentHelpers"
import swal from "sweetalert";

export default class CallCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleMarkAsComplete = this.handleMarkAsComplete.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
    }
    handleConfirm(e) {
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
                swal({
                    title: `You've confirmed a call with ${this.props.mentee.name}`,
                    text: "App will now refresh to reflect view current state of appointments.",
                    icon: "success",
                  }).then(() => {
                    window.location.reload();
                  });
            }
        });
    }

    handleMarkAsComplete(e) {
        e.preventDefault();
        let confirmPayload = {
            requestId: this.props.requestId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/markRequestDone`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(confirmPayload)
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
                swal({
                    title: `Congratulations on completing the request!`,
                    text: "App will now refresh to reflect view current state of appointments.",
                    icon: "success",
                  }).then(() => {
                    window.location.reload();
                  });
            }
        });
    }

    handleDismiss(e) {
        e.preventDefault();
        let confirmPayload = {
            requestId: this.props.requestId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/deleteRequest`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(confirmPayload)
        }).then(res => {
            if (res.status !== 200) {
                swal({
                    title: `Oops!`,
                    text: "Something went wrong! Please try again.",
                    icon: "error",
                  });
            } else {
                swal({
                    title: `Successfully dimissed request.`,
                    text: "App will now refresh to reflect view current state of appointments.",
                    icon: "success",
                  }).then(() => {
                    window.location.reload();
                  });
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
                    <Card.Meta>Message from mentee: { this.props.mentee_intro }</Card.Meta>
                    <Card.Description>
                        {mentee.name} attends {mentee.school} and is from {mentee.location}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button 
                        onClick={(e) => this.props.confirmed ? window.open(this.props.meetingRoom) : this.handleConfirm(e)}
                        basic color='dark orange'>
                        {this.props.confirmed ? 'Join Video Call' : 'Confirm'}
                    </Button>
                    {/* TODO: Include ability to cancell requests for mentors */}
                    <Button
                        onClick={(e) => this.props.confirmed ? this.handleMarkAsComplete(e) : this.handleDismiss(e)}
                        basic color='yellow'>
                        {this.props.confirmed ? 'Mark as Complete' : 'Dismiss'}
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}