/* eslint-disable max-len */
import React from 'react'
import { Container, Button, Modal, Form} from 'semantic-ui-react'
import { BACKEND } from "../../App";
import swal from "sweetalert";

const compName = 'SchoolDashboard_LS';
/*
    props: schoolId
*/
export default class SchoolDashboard extends React.Component {
    constructor(props){
        super(props);
        this.pingStudents = this.pingStudents.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount(){
        window.addEventListener('beforeunload', this.componentCleanup);
        // TODO: await on restore before making calls? Do not make calls if state is restored?
        const persistState = sessionStorage.getItem(compName);
        if (persistState) {
          try {
            this.setState(JSON.parse(persistState));
          } catch (e) {
            console.log("Could not get fetch state from local storage for", compName);
          }
        }
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    pingStudents(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            message: this.state.message,
            schoolId: this.props.schoolId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/pingStudents`, {
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

    render() {
        return (  
            <Container>
                <Modal
                    open={this.state.modalOpen}
                    trigger={
                        <Button
                            onClick={() => {this.setState({modalOpen: true})}}
                        >
                            Ping Students
                        </Button>
                    }>
                    <Modal.Header>Ping Students</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.pingStudents}>
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
            </Container>
        )
    }
}
