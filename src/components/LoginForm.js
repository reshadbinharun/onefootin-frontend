import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { BACKEND } from "../App";
import { MENTEE, MENTOR, ADMIN, SCHOOL_ADMIN } from '../magicString'

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

let buttonStyle = {
    width: '35%',
}

const compName = 'LoginForm_LS';

export default class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            incorrectCredentials: false,
            error: null,
            menteeLoginLoading: false,
            mentorLoginLoading: false,
            adminLoading: false,
            schoolAdminLoading: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitAsMentee = this.handleSubmitAsMentee.bind(this);
        this.handleSubmitAsMentor = this.handleSubmitAsMentor.bind(this);
        this.handleSubmitAsAdmin = this.handleSubmitAsAdmin.bind(this);
        this.handleSubmitAsSchoolAdmin = this.handleSubmitAsSchoolAdmin.bind(this);
        this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    //TODO: combine both handleSubmit functions into one which takes a bool for isMentor
    handleSubmitAsMentor(e) {
        e.preventDefault();
        this.setState({mentorLoginLoading: true});
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
            let resolvedResParsed = await resolvedRes.json();
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedResParsed.message ? resolvedResParsed.message : `Your login was unsuccessful.`,
                    mentorLoginLoading: false,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                this.setState({
                    incorrectCredentials: false,
                    mentorLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedResParsed, MENTOR);
                })
            }
        }).catch(err => {
            this.setState({
                mentorLoginLoading: false
            }, () => {
                window.alert("Whoops! The server's acting up... :(");
            })
        });
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
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

    handleSubmitAsMentee(e) {
        e.preventDefault();
        this.setState({menteeLoginLoading: true});
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
            let resolvedResParsed = await res.json();
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedResParsed.message ? resolvedResParsed.message : `Your login was unsuccessful.`,
                    menteeLoginLoading: false,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                this.setState({
                    incorrectCredentials: false,
                    menteeLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedResParsed, MENTEE);
                })
            }
        }).catch(err => {
            this.setState({
                menteeLoginLoading: false
            }, () => {
                window.alert("Whoops! The server's acting up... :(");
            })
        });        
    }

    handleSubmitAsAdmin(e) {
        e.preventDefault();
        this.setState({adminLoginLoading: true});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/adminLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            let resolvedRes = await res;
            let resolvedResParsed = await resolvedRes.json()
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedResParsed.message ? resolvedResParsed.message : `Your login was unsuccessful.`,
                    adminLoginLoading: false,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                this.setState({
                    incorrectCredentials: false,
                    adminLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedResParsed, ADMIN);
                })
            }
        }).catch(err => {
            this.setState({
                adminLoginLoading: false
            }, () => {
                window.alert("Whoops! The server's acting up... :(");
            })
        });
    }

    handleSubmitAsSchoolAdmin(e) {
        e.preventDefault();
        this.setState({schoolAdminLoginLoading: true});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/schoolAdminLogin`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            let resolvedRes = await res;
            let resolvedResParsed = await resolvedRes.json()
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedResParsed.message ? resolvedResParsed.message : `Your login was unsuccessful.`,
                    schoolAdminLoginLoading: false,
                },() => console.log("login rejected", resolvedRes))
            }
            else {
                this.setState({
                    incorrectCredentials: false,
                    schoolAdminLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedResParsed, SCHOOL_ADMIN);
                })
            }
        }).catch(err => {
            this.setState({
                schoolAdminLoginLoading: false
            }, () => {
                window.alert("Whoops! The server's acting up... :(");
            })
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
                    <input placeholder='***' name="password" type="password" onChange={this.handleChange} />
                </Form.Field>
                </Form>
            </Grid.Row>
            <Grid.Row centered>
                <Button.Group>
                <Button
                    style={buttonStyle}
                    onClick={this.handleSubmitAsMentee}
                    color="yellow" 
                    loading={this.state.menteeLoginLoading}
                >
                    <Icon name="unlock"/>
                    Login as Mentee
                </Button>
                <Button 
                    style={buttonStyle}                        
                    onClick={this.handleSubmitAsMentor}
                    color="orange"
                    loading={this.state.mentorLoginLoading}
                >
                    <Icon name="unlock"/>
                    Login as Mentor
                </Button>
                <Button 
                    style={buttonStyle}                        
                    onClick={this.handleSubmitAsAdmin}
                    color="gray"
                    loading={this.state.adminLoginLoading}
                >
                    <Icon name="unlock"/>
                    Login as Admin
                </Button>
                <Button 
                    style={buttonStyle}
                    onClick={this.handleSubmitAsSchoolAdmin}
                    color="gray"
                    loading={this.state.schoolAdminLoginLoading}
                >
                    <Icon name="unlock"/>
                    Login as School Admin
                </Button>
                </Button.Group>
            </Grid.Row>
            </Grid>  
        </div>)
    }
}