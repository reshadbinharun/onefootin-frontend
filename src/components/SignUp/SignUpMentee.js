import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { getTimezoneOffset } from "./SignUpMentor"
import { BACKEND } from "../../App"

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class SignUpMentee extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            school: '',
            location: '',
            aboutYourself: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleSubmit(e) {
        e.preventDefault();
        let readyForSubmit = this.state.name && this.state.email && this.state.password && this.state.school && this.state.location && this.state.aboutYourself
        if (readyForSubmit) {
            let timeZone = `GMT${getTimezoneOffset()}`;
            let payload = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                school: this.state.school,
                location: this.state.location,
                timeZone: timeZone,
                aboutYourself: this.state.aboutYourself
            }
            e.preventDefault();
            fetch(`${BACKEND}/newMentee`, {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            }).then(res => {
                console.log("received response", res.json())
                alert(`Congratulations. Your submission was successful! Please check your email to confirm your account.`)
                this.props.handleSignUp();
            });
        } else {
            //TODO: Replace with React-alert
            alert("Please fill in all fields");
        }
        
    }
    render() {
    return (<div>
        <Message
            style= {messageStyle}
            attached
            centered
            header="Mentee Sign up"
            content="Welcome! We're excited to have you on board."
        />
            <Grid>
            <Grid.Row centered>
            <Form onSubmit={this.handleSubmit}>
                <Form.Field
                type="email"
                required="true"
                style={fieldStyle}
                >
                    <label>Email</label>
                    <input placeholder='Email' name="email" onChange={this.handleChange} />
                </Form.Field>
                <Form.Field
                    type="password"
                    required="true"
                    style={fieldStyle}
                >
                    <label>Password</label>
                    <input placeholder='***' name="password" onChange={this.handleChange} />
                </Form.Field>
                <Form.Field
                    type="text"
                    required="true"
                    style={fieldStyle}
                >
                    <label>Name</label>
                    <input placeholder='Name' name="name" onChange={this.handleChange} />
                </Form.Field>
                <Form.Field
                    type="text"
                    required="true"
                    style={fieldStyle}
                >
                    <label>School</label>
                    <input placeholder='School' name="school" onChange={this.handleChange} />
                </Form.Field>
                <Form.Field
                    type="text"
                    required="true"
                    style={fieldStyle}
                >
                    <label>Location</label>
                    <input placeholder='Location' name="location" onChange={this.handleChange} />
                </Form.Field>
                <Form.Field
                        type="text"
                        required="true"
                        style={fieldStyle}
                    >
                        <label>Tell us a little bit about yourself!</label>
                        <input placeholder='Interests, Hobbies, Motos...' name="aboutYourself" maxLength = "500" onChange={this.handleChange} />
                    </Form.Field>
                <Button 
                    color="blue" 
                    type='submit'>
                    <Icon name="unlock"/>
                    Submit
                </Button>
                </Form>
            </Grid.Row>
            </Grid>
            
        </div>)
    }
}