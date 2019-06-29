import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Container, Button, Grid, Form} from 'semantic-ui-react';
import {ECA_STRATEGY, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING} from "../../src/topics"
import { BACKEND } from "../App"

let newMenteePayload = {
    name: "Reshad",
    email: "reshadbinharun@gmail.com",
    password: "password",
    school: "Tufts",
    timeZone: "GMT+4",
    location: "Dhaka"
  }

let newMentorPayload = {
    name: "Reshad",
    email: "reshad@gmail.com",
    password: "password",
    school: "Tufts",
    timeZone: "GMT+0600",
    location: "Iceland",
    position: "Consultant",
    major: "BME",
    preferredTimes: ['Sunday-9pm-12am', 'Sunday-12pm-3pm', 'Saturday-9am-12pm', 'Sunday-3pm-6pm'],
    preferredTopics: [ESSAY_BRAINSTORM, ECA_STRATEGY]
}

let newRequestPayload = {
    dateTime: ['Sunday-7.30pm'],
    requestorId: '7',
    topic: ECA_STRATEGY,
}

let confirmRequestPayload = {
    mentorId: '8',
    requestId: '3',
}

let topicMatchedMentorsPayload = {
    requestedTopics: [ECA_STRATEGY, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING]
}

let timeMatchedMentorsPayload = {
    menteeTime: 'Saturday-9.30pm',
    menteeTimezone: 'GMT+0000'
}

export default class Test extends Component {
    constructor() {
        super();
        this.menteeLogin = this.menteeLogin.bind(this);
        this.menteeAdd = this.menteeAdd.bind(this);
        this.menteeGet = this.menteeGet.bind(this);
        this.menteeLogout = this.menteeLogout.bind(this);

        this.mentorLogin = this.mentorLogin.bind(this);
        this.mentorAdd = this.mentorAdd.bind(this);
        this.mentorGet = this.mentorGet.bind(this);
        this.mentorLogout = this.mentorLogout.bind(this);

        this.mentorConfirmRequest = this.mentorConfirmRequest.bind(this);
        this.getAllRequests = this.getAllRequests.bind(this);
        this.getConfirmedRequests = this.getConfirmedRequests.bind(this);
        this.newRequest = this.newRequest.bind(this);

        this.uploadImageTest = this.uploadImageTest.bind(this);
    }
    // - - - Mentee Test Routes - - - //

    uploadImageTest(e) {
        e.preventDefault();
        let file = e.target.files[0];
        console.log("file is", file)
        let data = new FormData();
        data.append('file', file);
        fetch(`${BACKEND}/imageUpload`, {
            method: 'POST',
            body: file
        }).then(
            response => response.json() // if the response is a JSON object
        ).then(
            success => console.log(success) // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );
    }

    menteeLogin(e) {
        e.preventDefault();
        console.log("mentee login");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/menteeLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: newMenteePayload.email,
                password: newMenteePayload.password,
            })
        }).then(async res => {
        let resolvedRes = await res.json()
            console.log("received jwt", resolvedRes);
            console.log("cookies are", document.cookie)
        });
    }
    menteeAdd(e) {
        e.preventDefault();
        console.log("mentee add");
        fetch(`${BACKEND}/newMentee`, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newMenteePayload)
           }).then(res => {
             console.log("received response", res.json())
           });
    }
    menteeGet(e) {
        e.preventDefault();
        console.log("mentee get");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllMentees`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            if (res.status===200){
                console.log("received response",res.json())
            } else {
                console.log("res rejected")
            }
        });
    }
    menteeLogout(e) {
        e.preventDefault();
        console.log("mentee logout");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/menteeLogout`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            console.log("received response", res)
        });
    }

    // - - - Mentor Test Routes - - - //

    mentorLogin(e) {
        e.preventDefault();
        console.log("mentor login");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/mentorLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: newMentorPayload.email,
                password: newMentorPayload.password,
            })
        }).then(async res => {
        let resolvedRes = await res.json()
            console.log("received jwt", resolvedRes);
            console.log("cookies are", document.cookie)
        });
    }
    mentorAdd(e) {
        e.preventDefault();
        console.log("mentor add");
        fetch(`${BACKEND}/newMentor`, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newMentorPayload)
           }).then(res => {
             console.log("received response", res.json())
           });
    }
    mentorGet(e) {
        e.preventDefault();
        console.log("mentor get");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllMentors`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            if (res.status===200){
                console.log("received response",res.json())
            } else {
                console.log("res rejected")
            }
        });
    }
    mentorLogout(e) {
        e.preventDefault();
        console.log("mentor logout");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/mentorLogout`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            console.log("received response", res)
        });
    }

    // - - - Request Test Routes - - - //

    newRequest(e) {
        e.preventDefault();
        console.log("new request");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/newRequest`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(newRequestPayload)
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
            }
        });
    }

    mentorConfirmRequest(e) {
        e.preventDefault();
        console.log("confirm request");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/confirmRequest`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(confirmRequestPayload)
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
            }
        });
    }

    getAllRequests(e) {
        e.preventDefault();
        console.log("get all requests");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllRequests`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
            }
        });
    }

    getConfirmedRequests(e) {
        e.preventDefault();
        console.log("get confirmed requests");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getConfirmedRequests`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
            }
        });
    }

    getTopicMatchedMentors(e) {
        e.preventDefault();
        console.log("get topic matched mentors");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getMatchingMentorsByTopic`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(topicMatchedMentorsPayload)
        }).then(async res => {
            let resolvedRes = await res.json()
            if (res.status===200){
                console.log("received response",resolvedRes)
            } else {
                console.log("res rejected")
            }
        });
    }

    getTimeMatchedMentors(e) {
        e.preventDefault();
        console.log("get time matched mentors");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getMatchingMentorsByTime`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(timeMatchedMentorsPayload)
        }).then(async res => {
            let resolvedRes = await res.json()
            if (res.status===200){
                console.log("received response",resolvedRes)
            } else {
                console.log("res rejected")
            }
        });
    }

    render() {
        return (
            <Container>
                <Grid rows={3}>
                    <Grid.Row centered>
                        <Button class="ui button" onClick={this.menteeLogin}>
                            Mentee Login
                        </Button>
                        <Button class="ui button" onClick={this.menteeAdd}>
                            Mentee Add
                        </Button>
                        <Button class="ui button" onClick={this.menteeGet}>
                            Get All Mentees
                        </Button>
                        <Button class="ui button" onClick={this.menteeLogout}>
                            Mentee Logout
                        </Button>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Button class="ui button" onClick={this.mentorLogin}>
                            Mentor Login
                        </Button>
                        <Button class="ui button" onClick={this.mentorAdd}>
                            Mentor Add
                        </Button>
                        <Button class="ui button" onClick={this.mentorGet}>
                            Get All Mentors
                        </Button>
                        <Button class="ui button" onClick={this.mentorLogout}>
                            Mentor Logout
                        </Button>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Button class="ui button" onClick={this.newRequest}>
                            Add Request
                        </Button>
                        <Button class="ui button" onClick={this.mentorConfirmRequest}>
                            Confirm Request
                        </Button>
                        <Button class="ui button" onClick={this.getAllRequests}>
                            Get All Requests
                        </Button>
                        <Button class="ui button" onClick={this.getConfirmedRequests}>
                            Get Confirmed Requests
                        </Button>
                        <Button class="ui button" onClick={this.getTopicMatchedMentors}>
                            Get Matching Mentors by Topic
                        </Button>
                        <Button class="ui button" onClick={this.getTimeMatchedMentors}>
                            Get Matching Mentors by Time
                        </Button>
                        <Form>
                            <Form.Field>
                                <label>Test image upload</label>
                                <input type="file" onClick={this.uploadImageTest} class="ui huge yellow center floated button"/>     
                            </Form.Field>
                        </Form>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}