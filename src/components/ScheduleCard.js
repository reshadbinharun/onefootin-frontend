import React from 'react'
import { Card, Button, Modal, Form, Divider } from 'semantic-ui-react'
import { BACKEND } from "../App"
import swal from "sweetalert";
import { MENTOR, MENTEE } from "./../magicString"
import FeedChat from "./Feed/FeedChat"

let MAX_CHARS_MESSAGE = process.env.REACT_APP_MAX_CHARS_MESSAGE || 200;

export function createMessageEvent(messages, name, role) {
    const dateLen = 13;
    let events = messages.map(msg => {
        let dateString = msg.substring(0, dateLen);
        let messageString = msg.substring(dateLen + 1);
        return {
            role: role,
            date: dateString,
            sender: `${name} (${role})`,
            message: messageString
        }
    })
    return events;
}

export default class ScheduleCard extends React.Component {
    // TODO: Implement cancel and reschedule
    constructor(props){
        super(props);
        this.state = {
            message: '',
            modalOpen: false 
        }
        this.provideFeedback = this.provideFeedback.bind(this);
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
        let menteeName = this.props.mentee;
        let mentorName = this.props.mentor;
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
            isMentor: false
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
    provideFeedback(e){
        e.preventDefault();
        swal({
            text: "What did you like about the call? What could have been better?",
            content: "input",
            button: {
                text: "Submit!",
                closeModal: true,
            },
          }).then((feedback) => {
              let payload = {
                  requestId: this.props.requestId,
                  mentee_feedback: feedback
              }
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/giveFeedback`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status !== 200) {
                    swal({
                        title: `Oops!`,
                        text: "Something went wrong! Please try again.",
                        icon: "error",
                    });
                } else {
                    swal({
                        title: `Thank you for your feedback.`,
                        text: "Best of luck! App will now refresh to update appointments.",
                        icon: "success",
                    }).then(() => {
                        window.location.reload();
                    });
                }
            });
          })
    }
    render() {
        const {time, topic, mentor} = this.props;
        const cardStyle = {
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        /*
        States of Join Call Button
        1. Awaiting Confirmation... --> !confirmed, !done
        2. Join Video Call --> confirmed, !done
        3. Call Completed --> done, confirmed
        4. Call Completed --> !confirmed, done (invalid state)
        */
       let buttonText = (this.props.confirmed && !this.props.requestDone) ? 'Join Video Call' : this.props.requestDone ? 'Call Completed' : 'Awaiting Confirmation...';
        return (
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Call with: {mentor}</Card.Header>
                    <Card.Meta>{time}</Card.Meta>
                    <Card.Description>
                    You are scheduled for 30 minutes to discuss {topic}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='dark orange'
                        disabled={!this.props.confirmed || this.props.requestDone}
                        onClick={() => window.open(this.props.meetingRoom)}
                    >
                        {buttonText}
                    </Button>
                    <Button
                        onClick={this.props.requestDone ? this.provideFeedback : null}
                        basic color='yellow' disabled={!this.props.requestDone}>
                        Provide Feedback
                    </Button>
                    </div>
                    <Divider/>
                    <Modal
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
                        <Modal.Header>Your conversation with {mentor}</Modal.Header>
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
                </Card.Content>
            </Card>
        )
    }
    
}