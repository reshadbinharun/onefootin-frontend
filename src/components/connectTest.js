import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Container, Button, Grid} from 'semantic-ui-react';

const BACKEND = 'http://localhost:8080'
let newMenteePayload = {
    name: "Reshad",
    email: "reshadbinharun@gmail.com",
    password: "password",
    school: "Tufts",
    timeZone: "GMT+4",
    location: "Dhaka"
  }

export default class Test extends Component {
    constructor() {
        super();
        this.menteeLogin = this.menteeLogin.bind(this);
        this.menteeAdd = this.menteeAdd.bind(this);
        this.menteeGet = this.menteeGet.bind(this);
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
            console.log("received response",res.json())
        });
    }
    render() {
        return (
            <Container>
                <Grid rows={1}>
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
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
} 