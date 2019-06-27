import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Message, Grid, Dropdown } from 'semantic-ui-react';
import PreferredTimeSelector from '../PreferredTimeSelector';
import {ESSAY_BRAINSTORM, ESSAY_CRITIQUE, ECA_STRATEGY, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION} from "../../topics"

const PREFERRED_TOPICS = [ESSAY_BRAINSTORM, ESSAY_CRITIQUE, ECA_STRATEGY, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION];
let preferredTopicsOptions = PREFERRED_TOPICS.map(val => {
    return {key: val, text: val, value: val}
})

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export function getTimezoneOffset() {
    function z(n) {
        return (n < 10 ? '0' : '') + n
    }
    let offset = new Date().getTimezoneOffset();
    let sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);
    return sign + z(offset/60 | 0) + z(offset%60);
  }

export default class SignUpMentor extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            school: '',
            major: '',
            location: '',
            preferredTopics: [],
            selectTimes: false,
            position: '',
            aboutYourself: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
        this.selectTimes = this.selectTimes.bind(this);
        this.setPreferredTimes = this.setPreferredTimes.bind(this);
        this.formPayload = this.formPayload.bind(this);
    }
    setPreferredTimes(preferredTimes) {
        this.setState({
            preferredTimes
        })
    }
    selectTimes(e) {
        if (e) {e.preventDefault()};
        let readyForTimeSelect = this.state.name && this.state.email && this.state.password &&
            this.state.major && this.state.location && this.state.preferredTopics.length && this.state.position
            && this.state.aboutYourself
        if (readyForTimeSelect) {
            this.setState({
                selectTimes: !this.state.selectTimes
            })
        } else {
            // react-alert
            alert("Please fill in all fields");
        }
    }
    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleChangeTopic(e, {value}) {
        e.preventDefault();
        this.setState({
            preferredTopics: value
        })
    }

    formPayload() {
        let timeZone = `GMT${getTimezoneOffset()}`;
        return {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            school: this.state.school,
            major: this.state.major,
            location: this.state.location,
            preferredTimes: this.state.preferredTimes,
            preferredTopics: this.state.preferredTopics,
            timeZone: timeZone,
            position: this.state.position,
            aboutYourself: this.state.aboutYourself
        }
    }

    render() {
    return (
    <div>
        <Message
            style= {messageStyle}
            attached
            centered
            header="Mentor Sign up"
            content="Welcome! We're excited to have you on board."
        />
            <Grid>
            {
                this.state.selectTimes? <PreferredTimeSelector 
                    payload={this.formPayload()}
                    setPreferredTimes={this.setPreferredTimes}
                    handleSignUp={this.props.handleSignUp}
                /> : 
                <Grid.Column centered>
                <Grid.Row>
                <Form >
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
                        <label>Major</label>
                        <input placeholder='Major' name="major" onChange={this.handleChange} />
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
                        <label>Professional Position</label>
                        <input placeholder='Position' name="position" onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field
                        type="text"
                        required="true"
                        style={fieldStyle}
                    >
                        <label>Tell us a little bit about yourself!</label>
                        <input placeholder='Interests, Hobbies, Motos...' name="aboutYourself" maxLength = "500" onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Select the topics you would like to consult.</label>
                    <Dropdown placeholder='Preferred Topics' fluid multiple selection options={preferredTopicsOptions} onChange={this.handleChangeTopic} name="preferredTopics"/>
                    </Form.Field>
                    <Grid.Row>
                        <Button onClick={this.selectTimes}>Select preferred times</Button>
                    </Grid.Row>
                    </Form>
                    </Grid.Row>
                </Grid.Column>
            }
            </Grid>
            
        </div>)
    }
}