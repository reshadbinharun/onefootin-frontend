/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'

//TODO: Write handleSubmit functions and backend API to update database

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
        <Button onClick={(e) => this.goBack(e)}>
            <Icon name="backward"/>
            Go Back.
        </Button>
    </Form>

let mentorEditForm = 
    <Form onSubmit={handleMentorEditSubmit}>
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

export default class EditProfile extends React.Component {
    // TODO: Add a property to show requests serviced
    constructor(props){
        super(props);
        // isMentor
        // email
        // name
        // function props --> goBack
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
        this.setState({
            submitting: true,
        }, async () => {
            // form mentor payload and submit
        }).then(() => {
            // alert, wait 2 secs
            this.props.goBack(e);
        })
    }

    handleMenteeEditSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
        }, async () => {
            // form mentee payload and submit
        }).then(() => {
            // alert, wait 2 secs
            this.props.goBack(e);
        })
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    render() {
        return (  
            <Container>
                <Grid centered>
                {this.props.isMentor ? mentorEditForm : menteeEditForm}
                </Grid>
            </Container>
          )
    }
}
