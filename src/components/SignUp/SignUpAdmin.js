import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { getTimezoneOffset } from "./SignUpMentor"
import { BACKEND, PATHS } from "../../App"
import { Redirect, Link } from "react-router-dom"
import swal from "sweetalert";

const compName = 'SignUpAdmin_LS';

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class SignUpAdmin extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            signUpDone: false,
            submitting: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
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
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleSubmit(e) {
        e.preventDefault();
        let readyForSubmit = (this.state.name && this.state.email && this.state.password && this.state.confirmPassword) && (this.state.confirmPassword === this.state.password);
        this.setState({
            submitting: readyForSubmit,
        })
        if (readyForSubmit) {
            let timeZone = `GMT${getTimezoneOffset()}`;
            let payload = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                timeZone: timeZone,
            }
            e.preventDefault();
            fetch(`${BACKEND}/newAdmin`, {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            }).then(res => {
                swal({
                    title: "Congratulations!",
                    text: "Your submission was successful! Please check your email to confirm your account.",
                    icon: "success",
                  });
                this.setState({
                    signUpDone: true
                })
            }).catch(err => {
                this.setState({
                    submitting: false
                }, () => {
                    window.alert("Whoops! The server's acting up... :(");
                })
            });
        } else {
            swal({
                title: "Yikes!",
                text: "Please fill in all fields to continue. Confirm that passwords match!",
                icon: "error",
            });
        }
        
    }
    render() {
    return (
        <div>
            {
                this.state.signUpDone? <Redirect to="/" /> :
                <div>
                    <Message
                        style= {messageStyle}
                        attached
                        centered
                        header="Admin Sign up"
                        content="Welcome admin! If you aren't Reshad or Mir, you must be really important!"
                    />
                        <Grid>
                        <Grid.Row centered>
                            <Button>
                                <Link to={PATHS.root}>
                                    Back
                                </Link>
                            </Button>
                        </Grid.Row>
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
                                <input placeholder='***' name="password" type="password" onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field
                                type="password"
                                required="true"
                                style={fieldStyle}
                            >
                                <label>Confirm Password</label>
                                <input placeholder='***' name="confirmPassword" type="password" onChange={this.handleChange} />
                            </Form.Field>
                            {this.state.password !== this.state.confirmPassword ? 
                            <Message
                                attached
                                centered
                                error
                                content="Your passwords do not match!"
                            /> 
                            : null}
                            <Form.Field
                                type="text"
                                required="true"
                                style={fieldStyle}
                            >
                                <label>Name</label>
                                <input placeholder='Name' name="name" onChange={this.handleChange} />
                            </Form.Field>
                            <Button 
                                color="blue" 
                                type='submit'
                                loading={this.state.submitting}>
                                <Icon name="unlock"/>
                                Submit
                            </Button>
                            </Form>
                        </Grid.Row>
                        </Grid>    
                    </div>
            }
        </div>
        )
    }
}