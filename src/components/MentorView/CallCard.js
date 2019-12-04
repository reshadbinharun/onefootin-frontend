import React from 'react'
import { Card, Button, Divider, Modal, Form } from 'semantic-ui-react'
import { BACKEND } from "../../App"
import { convertToViewerTimeZone } from "../TimezoneAdjustmentHelpers"
import swal from "sweetalert";
import FeedChat from "../Feed/FeedChat"
import {createMessageEvent} from "../ScheduleCard"
import {MENTEE, MENTOR} from "../../magicString"
import ProfileModal from "../MenteeView/ProfileModal"

let MAX_CHARS_MESSAGE = process.env.REACT_APP_MAX_CHARS_MESSAGE || 200;

export default class CallCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            modalOpen: false,
            modalProfileViewOpen: false,
            menteeId: this.props.menteeId
        }
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleMarkAsComplete = this.handleMarkAsComplete.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getMessageEvents = this.getMessageEvents.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }
    getMessageEvents(mentorMessages, menteeMessages){
        let menteeName = this.props.mentee.name;
        let mentorName = this.props.mentorName;
        let taggedMenteeMessages = createMessageEvent(menteeMessages, menteeName, MENTEE);
        let taggedMentorMessages = createMessageEvent(mentorMessages, mentorName, MENTOR);
        let allMessageEvents = [...taggedMenteeMessages, ...taggedMentorMessages];
        allMessageEvents.sort((obj1, obj2) => {
            if (obj1.dateString > obj2.dateString){
                return 1
            } else if (obj1.dateString < obj2.dateString) {
                return -1
            }
            return 0;
        })
        return allMessageEvents;
    }
    sendMessage(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            requestId: this.props.requestId,
            message: this.state.message,
            isMentor: true
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/postMessage`, {
            method: 'post',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(payload)
           }).then(async res => {
               let resolvedRes = await res;
               if (resolvedRes.status !== 200) {
                swal({
                    title: "Oops!",
                    text: "Something went wrong... Please try again.",
                    icon: "error",
                });
               }
               else {
                swal({
                    title: "Message Sent!",
                    text: `You just pinged your mentor.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
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
        let school = mentee.schoolCustom ? mentee.schoolCustom : mentee.school ? mentee.school.name : 'None listed.'
        return (
            // TODO: update confirm/dismiss with backend calls
            // TODO: adjustTime to mentor's timeZone
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Request from {mentee.name}</Card.Header>
                    <Card.Meta>Topic {topic} at { convertToViewerTimeZone(time, mentorTimeZone) }</Card.Meta>
                    <Card.Meta>Message from mentee: { this.props.mentee_intro }</Card.Meta>
                    <Card.Description>
                        {mentee.name} attends {school} and is from {mentee.location}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button 
                        onClick={(e) => this.props.confirmed ? window.open(this.props.meetingRoom) : this.handleConfirm(e)}
                        basic color='dark orange'>
                        {this.props.confirmed ? 'Join Video Call' : 'Confirm'}
                    </Button>
                    {/* TODO: Include ability to cancel requests for mentors */}
                    <Button
                        onClick={(e) => this.props.confirmed ? this.handleMarkAsComplete(e) : this.handleDismiss(e)}
                        basic color='yellow'>
                        {this.props.confirmed ? 'Mark as Complete' : 'Dismiss'}
                    </Button>
                    </div>
                    <Divider/>
                    <div className='ui two buttons'>
                        <Modal
                            open={this.state.modalOpen}
                            trigger={
                                <Button
                                    onClick={() => {this.setState({modalOpen: true})}}
                                >
                                    Chat!
                                </Button>
                            }>
                            <Modal.Header>Your conversation with {mentee.name}</Modal.Header>
                            <Modal.Content>
                                <FeedChat events={this.getMessageEvents(this.props.mentorMessages, this.props.menteeMessages)}/>
                                <Form onSubmit={this.sendMessage}>
                                <Form.Field
                                    type="text">
                                        <label>Message</label>
                                        <input maxlength={MAX_CHARS_MESSAGE} placeholder='Your message...' name="message" onChange={this.handleChange} value={this.state.message} />
                                    </Form.Field>
                                    <Button 
                                        color="blue" 
                                        type='submit'
                                        disabled={!this.state.message}
                                    >
                                        Send
                                    </Button>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => {this.setState({modalOpen: false})}}>
                                    Done
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    {/* TODO: Include ability to cancel requests for mentors */}
                        <ProfileModal menteeId={this.state.menteeId}/>
                    </div>
                    {/* <Modal
                        open={this.state.modalOpen}
                        trigger={
                            <Button
                                onClick={() => {this.setState({modalOpen: true})}}
                                centered
                                style={{'width': '100%'}}
                            >
                                Chat!
                            </Button>
                        }>
                        <Modal.Header>Your conversation with {mentee.name}</Modal.Header>
                        <Modal.Content>
                            <FeedChat events={this.getMessageEvents(this.props.mentorMessages, this.props.menteeMessages)}/>
                            <Form onSubmit={this.sendMessage}>
                            <Form.Field
                                type="text">
                                    <label>Message</label>
                                    <input maxlength={MAX_CHARS_MESSAGE} placeholder='Your message...' name="message" onChange={this.handleChange} value={this.state.message} />
                                </Form.Field>
                                <Button 
                                    color="blue" 
                                    type='submit'
                                    disabled={!this.state.message}
                                >
                                    Send
                                </Button>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={() => {this.setState({modalOpen: false})}}>
                                Done
                            </Button>
                        </Modal.Actions>
                    </Modal> */}
                </Card.Content>
            </Card>
        )
    }
    
}