import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class LoginForm extends React.Component {
    render() {
    return (<div>
        <Message
            style= {messageStyle}
            attached
            centered
            header="We've been there. We'll take you there."
            content='Please sign in.'
        />
            <Grid>
            <Grid.Row centered>
            <Form onSubmit={this.props.handleSubmit}>
                <Form.Field
                type="email"
                required="true"
                style={fieldStyle}
                >
                    <label>Email</label>
                    <input placeholder='Email' name="email" onChange={this.props.handleChange} />
                </Form.Field>
                <Form.Field
                    type="password"
                    required="true"
                    style={fieldStyle}
                >
                    <label>Password</label>
                    <input placeholder='***' name="password" onChange={this.props.handleChange} />
                </Form.Field>
                <Button 
                    color="blue" 
                    type='submit'>
                    <Icon name="unlock"/>
                    Submit
                </Button>
                </Form>
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