/* eslint-disable max-len */
import React from 'react'
import { Container, Button, Modal, Card, Form, Segment } from 'semantic-ui-react'
import { BACKEND } from "../../App";
import swal from "sweetalert";
import { adminCardStyleYellow } from "../../inlineStyles"


const compName = 'Dashboard_LS';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            schools: [],
            schoolName: '',
            schoolRegion: '',
            schoolContact: '',
            modalOpen: false
        }
        this.renderUserCards = this.renderUserCards.bind(this)
        this.addNewSchool = this.addNewSchool.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    addNewSchool(e) {
        e.preventDefault();
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            schoolName: this.state.schoolName,
            schoolContact: this.state.schoolContact,
            schoolRegion: this.state.schoolRegion
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/addSchool`, {
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
                    title: "Added new school!",
                    text: `Added new school for mentees to associate with`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
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
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getSchools`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                schools: resolvedRes && resolvedRes.schools
            });
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    renderUserCards(SchoolObjects) {
        if (!SchoolObjects) {
            return null
        }
        return SchoolObjects.map(school => {
            return (
                <Card style={adminCardStyleYellow}>
                    <Card.Header><strong>{school.name}</strong></Card.Header>
                    <Card.Meta>{school.region}</Card.Meta>
                    <Card.Meta>Contact: {school.contactEmail}</Card.Meta>
                </Card>
            )
        })
    }

    render() {
        return (  
            <Container>
                <Segment>
                    <label>Schools currently in system:</label>
                    {this.renderUserCards(this.state.schools)}
                </Segment>
                <Modal
                    open={this.state.modalOpen}
                    trigger={
                        <Button
                            onClick={() => {this.setState({modalOpen: true})}}
                        >
                            Add School
                        </Button>
                    }>
                    <Modal.Header>Add New School</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.addNewSchool}>
                        <Form.Field
                            type="text">
                                <label>School Name</label>
                                <input placeholder='School name' name="schoolName" onChange={this.handleChange} value={this.state.schoolName} />
                            </Form.Field>
                            <Form.Field
                            type="text">
                                <label>School Region</label>
                                <input placeholder='School region' name="schoolRegion" onChange={this.handleChange} value={this.state.schoolRegion} />
                            </Form.Field>
                            <Form.Field
                            type="text">
                                <label>School Moderator's Email</label>
                                <input placeholder='Email' name="schoolContact" onChange={this.handleChange} value={this.state.schoolContact} />
                            </Form.Field>
                            <Button 
                                color="blue" 
                                type='submit'
                                disabled={!this.state.schoolName || !this.state.schoolRegion || !this.state.schoolContact}
                            >
                                Add
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
