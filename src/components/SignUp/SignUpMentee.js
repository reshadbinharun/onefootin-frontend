import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid, Dropdown } from 'semantic-ui-react';
import { getTimezoneOffset } from "./SignUpMentor"
import { BACKEND, PATHS } from "../../App"
import { Redirect, Link } from "react-router-dom"
import axios from 'axios';
import swal from "sweetalert";

const compName = 'SignUpMentee_LS';
const CUSTOM = 'Other... (Not included in list)'

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
            confirmPassword: '',
            /*
            {
                id: '',
                name: '',
                region: '',
                contact: '',
            }
            */
            schools: [],
            schoolCustom: '', //custom choice
            school: '', // from available schools
            customSchoolSelected: false, // bool to indicate if user selected custom school
            location: '',
            aboutYourself: '',
            // TODO: include stock image if image link is empty, IMAGE LINK is optional
            imageLink: '',
            signUpDone: false,
            submitting: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.handleSchoolSelection = this.handleSchoolSelection.bind(this);
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
        // TODO: get list of available schools
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getSchools`, {
            method: 'get',
            headers: headers,
            credentials: 'include',
        }).then(async res => {
                let resolvedRes = await res;
                resolvedRes = await resolvedRes.json()
                this.setState({
                    schools: resolvedRes.schools
                })
        }
        ).catch(e => console.log(e))
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

    uploadImage(e) {
        e.preventDefault();
        let file = e.target.files[0];
        let data = new FormData();
        data.append('file', file);
        axios.post(`${BACKEND}/imageUpload`, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(
            success => {
                console.log(success); // Handle the success response object
                this.setState({imageLink: success.data})
            }
        ).catch(
            error => console.log(error) // Handle the error response object
        );
    }

    handleSchoolSelection(e, {value}) {
        e.preventDefault();
        if (value === CUSTOM) {
            this.setState({
                customSchoolSelected: true
            })
        } else {
            this.setState({
                school: value
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let readyForSubmit = (this.state.name && this.state.email && this.state.password && (this.state.school || this.state.schoolCustom) && 
        this.state.location && this.state.aboutYourself && this.state.confirmPassword) && (this.state.confirmPassword === this.state.password);
        this.setState({
            submitting: readyForSubmit,
        })
        if (readyForSubmit) {
            let timeZone = `GMT${getTimezoneOffset()}`;
            let payload = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                school: this.state.school,
                schoolCustom: this.state.schoolCustom,
                customSchoolSelected: this.state.customSchoolSelected,
                location: this.state.location,
                timeZone: timeZone,
                aboutYourself: this.state.aboutYourself,
                imageLink: this.state.imageLink
            }
            e.preventDefault();
            fetch(`${BACKEND}/newMentee`, {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            }).then(async res => {
                let resolvedRes = await res;
                if (resolvedRes.status === 200) {
                    swal({
                        title: "Congratulations!",
                        text: "Your submission was successful! Please check your email to confirm your account.",
                        icon: "success",
                      });
                    this.setState({
                        signUpDone: true
                    })
                }
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
    let schoolOptions = this.state.schools ? this.state.schools.map(school => {
        return {
            key: school.name,
            value: school.name,
            text: school.name
        }
    }) : null
    if (schoolOptions) {
        schoolOptions.push({
            key: CUSTOM,
            value: CUSTOM,
            text: CUSTOM
        })
    }
    return (
        <div>
            {
                this.state.signUpDone? <Redirect to="/" /> :
                <div>
                    <Message
                        style= {messageStyle}
                        attached
                        centered
                        header="Mentee Sign up"
                        content="Welcome! We're excited to have you on board."
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
                            {/* Dropdown with options, if option is other --> free input */}
                            {!this.state.customSchoolSelected?
                                 <Form.Field>
                                 <label>Select your school</label>
                                 <Dropdown placeholder='Select the school your attend' fluid selection options={schoolOptions} onChange={this.handleSchoolSelection} name="school"/>
                                </Form.Field>
                                 : 
                                 <Form.Field
                                 type="text"
                                 required="true"
                                 style={fieldStyle}
                                >
                                    <label>Add your School</label>
                                    <input placeholder='School' name="school" onChange={this.handleChange} />
                                </Form.Field>
                            }
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
                                <Form.Field>
                                    <label>Let's put a face on you! Please upload an image.</label>
                                    <input type="file" onChange={this.uploadImage} class="ui huge yellow center floated button"/>
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