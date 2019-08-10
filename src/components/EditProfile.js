/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Form, Message, Dropdown, Icon, Button } from 'semantic-ui-react'
import { BACKEND } from "../App"
import swal from "sweetalert";
import { PREFERRED_TOPICS, LANGUAGE_OPTIONS } from "./SignUp/SignUpMentor";
let preferredTopicsOptions = PREFERRED_TOPICS.map(val => {
    return {key: val, text: val, value: val}
});
let languageOptions = LANGUAGE_OPTIONS.map(val => {
    return {key: val, text: val, value: val}
});

//TODO: Write handleSubmit functions and backend API to update database
let fieldStyle = {
    width: '100%',
}
    
export default class EditProfile extends React.Component {
    // TODO: Add a property to show requests serviced
    constructor(props){
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            school: '',
            major: '', // mentor
            location: '',
            preferredTopics: [], // mentor
            position: '', // mentor
            languages: [], // mentor
            zoom_info: '', //mentor
            aboutYourself: '',
            imageLink: '',
            submitting: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
        this.handleMentorEditSubmit = this.handleMentorEditSubmit.bind(this);
        this.handleMenteeEditSubmit = this.handleMenteeEditSubmit.bind(this);
    }

    handleMentorEditSubmit(e) {
        if (this.state.password !== this.state.confirmPassword) {
            swal({
                title: "Passwords do not match!",
                text: "Please ensure your passwords match.",
                icon: "error",
            });
            return;
        }
        e.preventDefault();
        let payload = {
            password: this.state.password,
            school: this.state.school,
            major: this.state.major, // mentor
            location: this.state.location,
            preferredTopics: this.state.preferredTopics,
            languages: this.state.languages, //mentor
            zoom_info: this.state.zoom_info,
            position: this.state.position, // mentor
            aboutYourself: this.state.aboutYourself,
            imageLink: this.state.imageLink,
            email: this.props.email
        }
        this.setState({
            submitting: true,
        }, async () => {
            fetch(`${BACKEND}/editMentor`, {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
               }).then(async res => {
                   let resolvedRes = await res;
                   if (resolvedRes.status !== 200) {
                    swal({
                        title: "Oops!",
                        text: "Something went wrong... Please try again.",
                        icon: "error",
                    });
                   }
                   else {
                    swal({
                        title: "All set!",
                        text: "You've just updated your profile.",
                        icon: "success",
                      });
                    this.props.goBack();
                   }
               }).then(() => {
                   this.setState({
                       submitting: false,
                   }, () => {
                    this.props.goBack();
                   })
            })
        })
    }

    handleMenteeEditSubmit(e) {
        if (this.state.password !== this.state.confirmPassword) {
            swal({
                title: "Passwords do not match!",
                text: "Please ensure your passwords match.",
                icon: "error",
            });
            return;
        }
        let payload = {
            password: this.state.password,
            school: this.state.school,
            location: this.state.location,
            aboutYourself: this.state.aboutYourself,
            imageLink: this.state.imageLink,
            email: this.props.email,
        }
        this.setState({
            submitting: true,
        }, async () => {
            fetch(`${BACKEND}/editMentee`, {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
               }).then(async res => {
                   let resolvedRes = await res;
                   if (resolvedRes.status !== 200) {
                    swal({
                        title: "Oops!",
                        text: "Something went wrong... Please try again.",
                        icon: "error",
                    });
                   }
                   else {
                    swal({
                        title: "All set!",
                        text: "You've just updated your profile.",
                        icon: "success",
                      });
                    this.props.goBack();
                   }
               }).then(() => {
                   this.setState({
                       submitting: false,
                   }, () => {
                    this.props.goBack();
                   })
            })
        })
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

    handleChangeLanguages(e, {value}) {
        e.preventDefault();
        this.setState({
            languages: value
        })
    }

    render() {
        let mentorEditForm = 
        <Form onSubmit={this.handleMentorEditSubmit}>
            <Form.Field
                type="password"
                style={fieldStyle}
            >
                <label>Password</label>
                <input placeholder='***' name="password" type="password" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field
                type="password"
                style={fieldStyle}
            >
                <label>Confirm Password</label>
                <input placeholder='***' name="confirmPassword" type="password" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
                disabled={true}
            >
                <label>Name</label>
                <input placeholder='Name' name="name" value={this.props.name} />
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Major</label>
                <input placeholder={this.props.major} name="major" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>College</label>
                <input placeholder={this.props.school} name="college" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field>
                <label>What languages do you speak?</label>
                    <Dropdown placeholder='Select all languages you speak...' fluid multiple selection options={languageOptions} onChange={this.handleChangeLanguages} name="languages" value={this.state.languages}/>
                </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Location</label>
                <input placeholder={this.props.location} name="location" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Professional Position</label>
                <input placeholder={this.props.position} name="position" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Zoom Meeting Link</label>
                <input placeholder={this.props.zoom_info} name="zoom_info" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Tell us a little bit about yourself!</label>
                <input placeholder={this.props.aboutYourself} name="aboutYourself" maxLength = "500" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field>
                <label>Select the topics you would like to consult.</label>
            <Dropdown placeholder='Preferred Topics' fluid multiple selection options={preferredTopicsOptions} onChange={this.handleChangeTopic} name="preferredTopics"/>
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
            <Button onClick={(e) => this.props.goBack(e)}>
                <Icon name="backward"/>
                Go Back.
            </Button>
        </Form>

        let menteeEditForm = 
        <Form onSubmit={this.handleMenteeEditSubmit}>
            <Form.Field
                type="password"
                style={fieldStyle}
            >
                <label>Password</label>
                <input placeholder='***' name="password" type="password" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field
                type="password"
                style={fieldStyle}
            >
                <label>Confirm Password</label>
                <input placeholder='***' name="confirmPassword" type="password" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
                disabled={true}
            >
                <label>Name</label>
                <input placeholder='Name' name="name" value={this.props.name} />
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>School</label>
                <input placeholder={this.props.school} name="school" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                style={fieldStyle}
            >
                <label>Location</label>
                <input placeholder={this.props.location} name="location" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                    type="text"
                    style={fieldStyle}
                >
                    <label>Tell us a little bit about yourself!</label>
                    <input placeholder={this.props.aboutYourself} name="aboutYourself" maxLength = "500" onChange={this.handleChange}/>
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
            <Button onClick={(e) => this.props.goBack(e)}>
                <Icon name="backward"/>
                Go Back.
            </Button>
        </Form>
        return (  
            <Container>
                <Grid centered>
                {this.props.isMentor ? 
                    mentorEditForm
                    : 
                    menteeEditForm
                    }
                </Grid>
            </Container>
          )
    }
}
