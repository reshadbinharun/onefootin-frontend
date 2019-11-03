import React from 'react'
import { Grid, Card, Button, Message, Modal, Form } from 'semantic-ui-react'
import { adminCardStyleYellow, adminContentOrangeStyle, adminRowPaddingStyle } from "../../inlineStyles"
import {BACKEND} from "../../App";
import swal from "sweetalert";

export default class MentorCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: this.props.email,
            name: this.props.name,
            modalOpen: false,
            message: ''
        }
        this.approveMentor = this.approveMentor.bind(this);
        this.pingMentor = this.pingMentor.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    pingMentor(e) {
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

    approveMentor(e){
        let payload = {
            mentorEmail: this.state.email
        }
        e.preventDefault();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/approveMentor`, {
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
                    title: "Mentor approved!",
                    text: `You have approved ${this.state.name}.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
               window.alert("Something went wrong, the server's funky!")
           });
    }
    render() {
        const {name, college, location, memberSince, callsCompleted, approved} = this.props;
        return (
            <Card centered={true} style={adminCardStyleYellow}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        <Grid.Row style={adminRowPaddingStyle}>
                            <Message style={adminContentOrangeStyle}>
                                <strong>{name}</strong> has been a member since {memberSince}, attends <strong>{college}</strong>, and is currently in <strong>{location}</strong>.
                            </Message>
                        </Grid.Row>
                        <Grid.Row style={adminRowPaddingStyle}>
                            Calls Completed: {callsCompleted}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        {approved ?
                        <Modal
                            open={this.state.modalOpen}
                            trigger={
                                <Button
                                    onClick={() => {this.setState({modalOpen: true})}}
                                >
                                    Ping Mentor
                                </Button>
                            }>
                            <Modal.Header>Ping {name}</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.pingMentor}>
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
                        :
                        <Button onClick={this.approveMentor}>
                            Approve
                        </Button>}
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}