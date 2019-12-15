/* eslint-disable max-len */
import React from 'react'
import { Container, Button, Modal, Form, Dropdown, Table, Select} from 'semantic-ui-react'
import { BACKEND } from "../../App";
import swal from "sweetalert";
import {ECA_STRATEGY, ESSAY_CRITIQUE, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION} from "../../topics";

const TOPIC_OPTIONS = [ECA_STRATEGY, ESSAY_CRITIQUE, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION];
let topicsOptions = TOPIC_OPTIONS.map(val => {
    return {key: val, text: val, value: val}
})

const compName = 'Students_LS';
/*
    props: schoolId
*/
export default class Students extends React.Component {
    constructor(props){
        super(props);
        state = {
            students: [],
            message: '',
            modalMessageOpen: false,
            modalRequestOpen: false,
            topicSelectedForMentorship: '',
            grade: ''
        }
        this.pingStudent = this.pingStudent.bind(this);
        this.requestMentorship = this.requestMentorship.bind(this);
        this.filterByGrade = this.filterByGrade.bind(this);
        this.requestTableRows = this.requestTableRows.bind(this);
        this.handleTopicSelection = this.handleTopicSelection.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
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
        let payload = {
            schoolId: this.props.schoolId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        // TODO: endpoint must return all data needed to populate table
        /*
        id, name, testsTaken, numCollegesInShortlist, hasEca, callRecord, email
        */
        fetch(`${BACKEND}/getAllStudentsBySchool`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                students: resolvedRes && resolvedRes.students
            });
        });
    }

    handleTopicSelection(e, {value}) {
        e.preventDefault();
        this.setState({
            topicSelectedForMentorship: value,
        })
    }

    handleChangeGrade(e, {value}) {
        e.preventDefault();
        this.setState({
            grade: value
        })
    }

    pingStudent(email, name) {
        this.setState({
            modalOpen: false
        });
        let payload = {
            email,
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
                    text: `You just pinged ${name}.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    // TODO: notify school admins of progress of request
    requestMentorship(studentId) {
        let payload = {
            studentId,
            topic: this.state.topicSelectedForMentorship,
            schoolId: this.props.schoolId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/makeSchoolRequest`, {
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
                    title: "Request Sent!",
                    text: `One of the moderators will pair up the student with one of our mentors soon!.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    renderTableRows(students) {
        if (students.length) {
            return students.map( student => {
                return (
                    <Table.Row>
                        <Table.Cell>
                            {student.name}
                        </Table.Cell>
                        <Table.Cell>
                            {student.testsTaken}
                        </Table.Cell>
                        <Table.Cell>
                            {student.numCollegesInShortlist}
                        </Table.Cell>
                        <Table.Cell>
                            {student.hasEca}
                        </Table.Cell>
                        <Table.Cell>
                            {student.callRecords}
                        </Table.Cell>
                        <Table.Cell>
                            <Modal
                                open={this.state.modalMessageOpen}
                                trigger={
                                    <Button
                                        style={buttonStyle3}
                                        onClick={() => {this.setState({modalMessageOpen: true})}}
                                    >
                                        Ping Student
                                    </Button>
                                }>
                                <Modal.Header>Ping {student.name}</Modal.Header>
                                <Modal.Content>
                                    <Form onSubmit={this.pingStudent(student.email)}>
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
                                    <Button onClick={() => {this.setState({modalMessageOpen: false})}}>
                                        Done
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                            <Modal
                                open={this.state.modalRequestOpen}
                                trigger={
                                    <Button
                                        style={buttonStyle3}
                                        onClick={() => {this.setState({modalRequestOpen: true})}}
                                    >
                                        Request Mentorship
                                    </Button>
                                }>
                                <Modal.Header>Requesting mentorship for {student.name}</Modal.Header>
                                <Modal.Content>
                                    <Form onSubmit={this.requestMentorship(student.email)}>
                                        <Dropdown placeholder='Select a topic for consultation' fluid selection options={topicsOptions} onChange={this.handleTopicSelection} name="topicSelectedForMentorship"/>
                                        <Button 
                                            color="blue" 
                                            type='submit'
                                            disabled={!this.state.topicSelectedForMentorship}
                                        >
                                            Request
                                        </Button>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={() => {this.setState({modalRequestOpen: false})}}>
                                        Done
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                                <ProfileModal menteeId={student.id}/>
                        </Table.Cell>
                    </Table.Row>
                )
            })
        }
        return null;
    }

    filterByGrade(students) {
        if (!this.state.grade) {
            return students
        }
        return students.map( student => {
            return student.grade === this.state.grade
        });
    }

    render() {
        return (  
            <Container>
                <Select compact options={['8th', '9th', '11th', '12th'].map(grade => {return {key: grade, value: grade, text: grade}})} defaultValue={null} name="grade" onChange={this.handleChangeGrade}/>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell singleLine>Name</Table.HeaderCell>
                        <Table.HeaderCell singleLine>Tests Taken</Table.HeaderCell>
                        <Table.HeaderCell singleLine># College in Shortlist</Table.HeaderCell>
                        <Table.HeaderCell singleLine>Has added ECA</Table.HeaderCell>
                        <Table.HeaderCell singleLine>Calls Completed/Requested</Table.HeaderCell>
                        <Table.HeaderCell singleLine>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderTableRows(this.filterByGrade(this.state.students))}
                    </Table.Body>   
                </Table>
            </Container>
        )
    }
}
