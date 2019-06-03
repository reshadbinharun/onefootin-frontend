import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid, Dropdown } from 'semantic-ui-react';

const BACKEND = process.env.BACKEND || 'http://localhost:8080';
// topic choices
export const ESSAY_BRAINSTORM = 'Essay Brainstorm';
export const ESSAY_CRITIQUE = 'Essay Critique';
export const ECA_STRATEGY = 'ECA Development';
export const COLLEGE_SHORTLISTING = 'College Shortlisting';
export const GENERAL_CONSULTATION = 'General Consulation';
export const FINANCIAL_AID_MATTERS = 'Financial Aid Matters';
const PREFERRED_TOPICS = [ESSAY_BRAINSTORM, ESSAY_CRITIQUE, ECA_STRATEGY, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION];
let preferredTopicsOptions = PREFERRED_TOPICS.map(val => {
    return {key: val, text: val, value: val}
})
//time choices
const PREFERRED_TIMES = ['6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'];
let preferredTimesOptions = PREFERRED_TIMES.map( val => {
    return {key: val, text: val, value: val}
})

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

function getTimezoneOffset() {
    function z(n) {
        return (n < 10 ? '0' : '') + n
    }
    let offset = new Date().getTimezoneOffset();
    let sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);
    return sign + z(offset/60 | 0) + z(offset%60);
  }

export default class SignUpMentee extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            school: '',
            major: '',
            location: '',
            preferredTimes: [],
            preferredTopics: [],
        }
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleSubmit(e) {
        e.preventDefault();
        let timeZone = `GMT${getTimezoneOffset()}`;
        let payload = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            school: this.state.school,
            major: this.state.major,
            location: this.state.location,
            preferredTimes: this.state.preferredTimes,
            preferredTopics: this.state.preferredTopics,
            timeZone: timeZone,
        }
        e.preventDefault();
        fetch(`${BACKEND}/newMentee`, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
           }).then(res => {
             console.log("received response", res.json())
           });
    }
    render() {
    return (<div>
        <Message
            style= {messageStyle}
            attached
            centered
            header="Mentor Sign up"
            content="Welcome! We\'re excited to have you on board."
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
                    <label>School</label>
                    <input placeholder='School' name="school" onChange={this.handleChange} />
                </Form.Field>
                {/* <Form.Field 
                    onChange={this.handleDayChange}
                    placeholder='Preferred Topics'
                    label='Preferred Topics'
                    options={PREFERRED_TOPICS}
                    value={this.state.day}
                /> */}
                <Dropdown placeholder='Preferred Topics' fluid multiple selection options={preferredTopicsOptions} />
                <Dropdown placeholder='Preferred Times' fluid multiple selection options={preferredTimesOptions} />
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