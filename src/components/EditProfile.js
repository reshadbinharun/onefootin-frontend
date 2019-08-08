/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Form, Message, Dropdown, Icon, Button } from 'semantic-ui-react'
import { BACKEND } from "../App"
import swal from "sweetalert";
import { PREFERRED_TOPICS } from "./SignUp/SignUpMentor";
let preferredTopicsOptions = PREFERRED_TOPICS.map(val => {
    return {key: val, text: val, value: val}
})

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
            preferredTopics: [],
            position: '', // mentor
            aboutYourself: '',
            imageLink: '',
            submitting: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleMentorEditSubmit = this.handleMentorEditSubmit.bind(this);
        this.handleMenteeEditSubmit = this.handleMenteeEditSubmit.bind(this);
    }

    handleMentorEditSubmit(e) {
        e.preventDefault();
        let payload = {
            password: this.state.password,
            school: this.state.school,
            major: this.state.major, // mentor
            location: this.state.major,
            preferredTopics: this.state.preferredTopics,
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
                    this.props.goBack(e);
                   })
            })
        })
    }

    handleMenteeEditSubmit(e) {
        let payload = {
            password: this.state.password,
            school: this.state.school,
            location: this.state.major,
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
                    this.props.goBack(e);
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

    render() {
        let mentorEditForm = 
        <Form onSubmit={this.handleMentorEditSubmit}>
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
                disabled={true}
            >
                <label>Name</label>
                <input placeholder='Name' name="name" value={this.props.name} />
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>Major</label>
                <input placeholder={this.props.major} name="major" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>School</label>
                <input placeholder={this.props.school} name="school" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>Location</label>
                <input placeholder={this.props.location} name="location" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>Professional Position</label>
                <input placeholder={this.props.position} name="position" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
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
                disabled={true}
            >
                <label>Name</label>
                <input placeholder='Name' name="name" value={this.props.name} />
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>School</label>
                <input placeholder={this.props.school} name="school" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                type="text"
                required="true"
                style={fieldStyle}
            >
                <label>Location</label>
                <input placeholder={this.props.location} name="location" onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field
                    type="text"
                    required="true"
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
