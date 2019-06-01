import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Container, Button, Grid} from 'semantic-ui-react';

const BACKEND = 'http://localhost:8080'
// topic choices
export const ESSAY_BRAINSTORM = 'essay brainstorm';
export const ECA_STRATEGY = 'eca strategy';
export const COLLEGE_SHORTLISTING = 'college shortlisting';

let newMenteePayload = {
    name: "Reshad",
    email: "reshadbinharun@gmail.com",
    password: "password",
    school: "Tufts",
    timeZone: "GMT+4",
    location: "Dhaka"
  }

let newMentorPayload = {
    name: "Mir",
    email: "mirfaiyaz@gmail.com",
    password: "password",
    school: "Dartmouth",
    timeZone: "GMT-6",
    location: "USA",
    position: "Consultant",
    major: "Mathematics",
    preferredTimes: ['Sunday-10pm', 'Monday-9pm', 'Saturday-12pm'],
    preferredTopics: [ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING, ECA_STRATEGY]
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
    }
    // - - - Mentee Test Routes - - - //

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

    render() {
        return (
            <Container>
                <Grid rows={2}>
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
                </Grid>
            </Container>
        )
    }
}