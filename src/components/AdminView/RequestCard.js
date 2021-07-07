import React from 'react'
import { Grid, Card, Button, Message, Modal, Form } from 'semantic-ui-react'
import { adminRowPaddingStyle, adminCardStyleYellow, adminContentOrangeStyle, adminContentYellowStyle } from "../../inlineStyles"
import {BACKEND} from "../../App";
import swal from "sweetalert";

export default class RequestCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            requestId: this.props.requestId,
            modalOpen: false,
            message: ''
        }
        this.pingParticipants = this.pingParticipants.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    pingParticipants(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            requestId: this.state.requestId,
            message: this.state.message
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/pingParticipants`, {
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
                    text: `You just pinged participants for this request.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    render() {
        const {menteeNameSchool, mentorNameCollege, topic, status, feedback, menteeIntro} = this.props;

        return (
            <Card centered={true} style={adminCardStyleYellow}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            <Message style={adminContentYellowStyle}>
                                <strong>{mentorNameCollege}</strong> mentoring <strong>{menteeNameSchool}</strong> about <strong>{topic}</strong>
                            </Message>
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            <Message style={adminContentOrangeStyle}>
                                Status: <strong>{status}</strong>
                            </Message>
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            {feedback? 
                            <div>
                                <Message.Header>
                                    <strong>Feedback</strong>
                                </Message.Header>
                                <Message style={adminContentYellowStyle}>
                                    " {feedback} "
                                </Message>
                            </div>
                             : null}
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            <div>
                                <Message.Header>
                                    <strong>Mentee's Introduction</strong>
                                </Message.Header>
                                <Message style={adminContentOrangeStyle}>
                                    {menteeIntro}
                                </Message>
                            </div>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    <Modal
                            open={this.state.modalOpen}
                            trigger={
                                <Button
                                    onClick={() => {this.setState({modalOpen: true})}}
                                >
                                    Ping Participants
                                </Button>
                            }>
                            <Modal.Header>Ping participants</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.pingParticipants}>
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
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}