import React from 'react'
import { Grid, Card, Button, Message, Modal, Form } from 'semantic-ui-react'
import { adminCardStyleYellow, adminContentYellowStyle, adminRowPaddingStyle, adminContentOrangeStyle } from "../../inlineStyles"
import {BACKEND} from "../../App";
import swal from "sweetalert";
import ProfileModal from '../MenteeView/ProfileModal'

export default class MenteeCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: this.props.email,
            name: this.props.name,
            modalOpen: false,
            message: '',
            suspensionStatus: this.props.suspensionStatus
        }
        this.changeSuspensionMentee = this.changeSuspensionMentee.bind(this);
        this.pingMentee = this.pingMentee.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    pingMentee(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            email: this.state.email,
            message: this.state.message,
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/pingParticipant`, {
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
                    text: `You just pinged ${this.state.name}.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    changeSuspensionMentee(e){
        let newStatus = !this.state.suspensionStatus;
        let payload = {
            menteeEmail: this.state.email,
            newSuspensionStatus: newStatus
        }
        e.preventDefault();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/changeMenteeSuspension`, {
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
                }).then(() => {
                    
                });
                }
                else {
                    this.setState({
                        suspensionStatus: newStatus
                    }, () => {
                        swal({
                            title: "Suspension status changed!",
                            text: `You have changed suspension status of ${this.state.name}.`,
                            icon: "success",
                            });
                        })
                    }
            }).catch(err => {
                window.alert("Something went wrong, the server's funky!");
            });
    }
    render() {
        const {name, school, memberSince, location, callsRequested} = this.props;
        return (
            <Card centered={true} style={adminCardStyleYellow}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        <Grid.Row style={adminRowPaddingStyle}>
                            <Message style={adminContentOrangeStyle}>
                                <strong>{name}</strong> has been a member since {memberSince}, attends <strong>{school}</strong>, and is from <strong>{location}</strong>.
                            </Message>
                        </Grid.Row>
                        <Grid.Row style={adminRowPaddingStyle}>
                            <Message style={adminContentYellowStyle}>
                                Calls Requested: {callsRequested}
                            </Message>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Modal
                            open={this.state.modalOpen}
                            trigger={
                                <Button
                                    onClick={() => {this.setState({modalOpen: true})}}
                                >
                                    Ping Mentee
                                </Button>
                            }>
                            <Modal.Header>Ping {name}</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.pingMentee}>
                                <Form.Field
                                    type="text">
                                        <label>Message</label>
                                        <input placeholder='Your message...' name="message" onChange={this.handleChange} value={this.state.message} />
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
                        <Button onClick={this.changeSuspensionMentee}>
                            {this.state.suspensionStatus ? `Unsuspend` : `Suspend`}
                        </Button>
                        <Grid.Row>
                            <ProfileModal menteeId={this.props.menteeId}/>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}