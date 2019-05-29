import React, { Component } from 'react'
import { Grid, Form, Container, Message, Button, Checkbox } from 'semantic-ui-react'
import _ from 'lodash'

export const CUSTOM_ENTRY = 'Custom Entry'; //magic string
// takes mentor and mentorPicked bool as prop
const TOPIC_OPTIONS = ['General Consulting', 'Essay Brainstorming', 'Essay Critique', 'College Shortlisting', 'Extra-curricular Development', 'Financial Aid Matters', 'VISA application', CUSTOM_ENTRY]
let topic_options = _.map(TOPIC_OPTIONS, option => ({
    key: option,
    text: option,
    value: option
}))

export default class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: this.props.mentorPicked ? `Your call will be scheduled with ${this.props.mentor}.` :
                `We will match you to a mentor who's most apt to meet your needs.`,
            topicSelection: '',
            disableCustomTopic: true,
            topicSelectComplete: false,
            timeSelectionComplete: false,
            useDefaultTime: false,
            time: '',
            day: '',
            customCompleteTime: '',
            submissionComplete: false
        }
        this.handleTopicChoice = this.handleTopicChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUseDefaultTime = this.handleUseDefaultTime.bind(this);
        this.handleCustomTopicEntry = this.handleCustomTopicEntry.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.renderSubmissionMessage = this.renderSubmissionMessage.bind(this);
    }

    gmtMapper(timezone) {
        let gmtOffset = parseInt(timezone)/60;
        let prefix = gmtOffset >= 0 ? '+' : '-';
        return `GMT${prefix}${gmtOffset}`
    }
    updateCustomTime() {
        let timeZone = new Date().getTimezoneOffset();
        let time = `${this.state.time} - ${this.state.day} - ${this.gmtMapper(timeZone)}`
        this.setState({
            customCompleteTime: time
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.updateCustomTime();
        this.setState({
            submissionComplete: true
        })
        // send updated information
        /*
        This function might be better passed in as prop from NavBar to update schedule when populated with new entry
        */
    }
    handleTopicChoice(e, {value}) {
        // check async await pattern, nest as callbacks if not working
        e.preventDefault();
        if (value===CUSTOM_ENTRY) {
            this.setState({
                disableCustomTopic: false
            })
        } else {
            this.setState({
                topicSelection: value,
                disableCustomTopic: true,
                topicSelectComplete: true,
            })
        }
    }

    handleCustomTopicEntry(e, {value}) {
        e.preventDefault();
        this.setState({
            topicSelection: value,
            topicSelectComplete: true,
        })
    }

    // customTimeComplete will be true only when both time and day and non-empty
    handleTimeChange(e) {
        e.preventDefault();
        let time = e.target.value.toString();
        this.setState({
            time: time
        }, () => {
            this.setState({
                timeSelectionComplete: this.state.time!=='' && this.state.day!==''
            })
        });
    }

    handleDayChange(e, {value}) {
        e.preventDefault();
        this.setState({
            day: value
        }, () => {
            this.setState({
                timeSelectionComplete: this.state.time!=='' && this.state.day!==''
            })
        })
    }

    handleUseDefaultTime(e) {
        e.preventDefault();
        this.setState({
            useDefaultTime: !this.state.useDefaultTime,
            timeSelectionComplete: !this.state.timeSelectionComplete,
        })
    }

    renderSubmissionMessage(){
        let message1 = `Your call is scheduled with ${this.props.mentorPicked ? 
            this.props.mentor + '.' : 'a mentor we will pick for you shortly.'} `
        let message2 = `Your call will be about ${this.state.topicSelection}. `
        let message3 = `You have requested to ${this.state.useDefaultTime ? 'be matched as per your default time availabilities' :
            'to schedule at ' + this.state.customCompleteTime}.`
        return (
                <Message 
                    floating={true}
                    positive={true}
                >
                    <Message.Header>You have successfully requested a Call!</Message.Header>
                    <p>{message1 + message2 + message3}</p>
                </Message>
            )
        
    }

    render() {
        const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let daysDropdownContent = DAYS.map(day => {
            return {
                key: day,
                text: day,
                value: day,
            }
        })
        let gridStyle = {
            width: '100%',
            margin: '20px',
        }
        // consider adding error attribute to incomplete fields, but for now disable the submit button
        return(
            <Container>
                  <Message>
                    <Message.Header>Scheduling form</Message.Header>
                    <p>
                    {this.state.message}
                    </p>
                    {this.state.submissionComplete? this.renderSubmissionMessage() : null}
                </Message>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Grid rows={5} style={gridStyle}>
                        <Grid.Row>
                            <Form.Select 
                                options={topic_options} 
                                placeholder='Select a topic'
                                onChange={this.handleTopicChoice}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Form.Input fluid label='Custom Topic Entry' 
                                placeholder='Custom Entry'
                                disabled={this.state.disableCustomTopic}
                                onChange={this.handleCustomTopicEntry}/>
                        </Grid.Row>
                        <Grid.Row>
                            <Checkbox toggle
                                label='Use my default time slots to match a time.' 
                                onChange={this.handleUseDefaultTime}
                                checked={this.state.useDefaultTime}

                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Form.Input 
                                disabled={this.state.useDefaultTime} 
                                onChange={this.handleTimeChange}
                                name='time'
                                id='time-for-slot'
                                label='Time'
                                type='time'
                            />
                            <Form.Select 
                                disabled={this.state.useDefaultTime} 
                                onChange={this.handleDayChange}
                                placeholder='Day'
                                label='Day'
                                options={daysDropdownContent}
                                value={this.state.day}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Button 
                                disabled={!this.state.timeSelectionComplete 
                                    && !this.state.topicSelectionComplete} 
                                type='submit'>Submit
                            </Button>
                        </Grid.Row>
                        </Grid>
                    </Form.Group>      
            </Form>
          </Container>
        )
    }
}