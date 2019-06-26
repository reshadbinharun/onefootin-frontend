import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { BACKEND } from "../App";
let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

let buttonStyle = {
    width: '80%',
}

export default class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            incorrectCredentials: false,
            error: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitAsMentee = this.handleSubmitAsMentee.bind(this);
        this.handleSubmitAsMentor = this.handleSubmitAsMentor.bind(this);
        this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
    }

    //TODO: combine both handleSubmit functions into one which takes a bool for isMentor
    handleSubmitAsMentor(e) {
        e.preventDefault();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/mentorLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            let resolvedRes = await res;
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedRes.error ? resolvedRes.error : `Your login was unsuccessful.`,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                resolvedRes = await resolvedRes.json()
                this.setState({
                    incorrectCredentials: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedRes, true);
                })
            }
        });
    }

    handleSubmitAsMentee(e) {
        e.preventDefault();
        console.log("mentee sign in")
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/menteeLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            let resolvedRes = await res;
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedRes.error ? resolvedRes.error : `Your login was unsuccessful.`,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                resolvedRes = await resolvedRes.json()
                this.setState({
                    incorrectCredentials: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedRes, false);
                })
            }
        });        
    }
    
    handleChange(e) {
    e.preventDefault();
    let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
    }

    renderIncorrectCredentialsMessage() {
    let messageStyle = {
        width: '80%',
        margin: '10px'
    }
    return this.state.incorrectCredentials ?
    <Grid centered>
        <Message
        error
        content={this.state.error}
        style = {messageStyle}
    />
    </Grid>
    : null
    }
    render() {
    return (<div>
        <Message
            style= {messageStyle}
            attached
            centered
            header="We've been there. We'll take you there."
            content='Please sign in.'
        />
        {this.renderIncorrectCredentialsMessage()}
            <Grid>
            <Grid.Row centered>
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
                </Form>
            </Grid.Row>
            <Grid.Row centered columns={2}>
                <Grid.Column>
                    <Button
                        style={buttonStyle}
                        onClick={this.handleSubmitAsMentee}
                        color="yellow" 
                    >
                        <Icon name="unlock"/>
                        Login as Mentee
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button 
                        style={buttonStyle}                        
                        onClick={this.handleSubmitAsMentor}
                        color="orange"
                    >
                        <Icon name="unlock"/>
                        Login as Mentor
                    </Button>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row centered>
                <Button onClick={this.props.toggleTest}>
                Toggle Test Mode
                </Button>
            </Grid.Row>
            </Grid>
            
        </div>)
    }
}