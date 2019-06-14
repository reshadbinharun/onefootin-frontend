import React, { Component } from 'react'
import { Grid, Form, Container, Message, Button, Checkbox } from 'semantic-ui-react'
import _ from 'lodash'
import {ESSAY_BRAINSTORM, ESSAY_CRITIQUE, ECA_STRATEGY, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION} from "../topics"
import {BACKEND} from "../App"

// takes mentor and mentorPicked bool as prop
const TOPIC_OPTIONS = [ECA_STRATEGY, ESSAY_CRITIQUE, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION];
let topic_options = _.map(TOPIC_OPTIONS, option => ({
    key: option,
    text: option,
    value: option
}))

//TODO: Remove custom topic/ match by default time

export default class ScheduleForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            topicSelection: '',
            topicSelectComplete: false,
            timeSelectionComplete: false,
            useDefaultTime: false,
            time: '',
            day: '',
            customCompleteTime: '',
            submissionComplete: false,
            mentor: null
        }
        this.handleTopicChoice = this.handleTopicChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUseDefaultTime = this.handleUseDefaultTime.bind(this);
        this.handleCustomTopicEntry = this.handleCustomTopicEntry.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.renderSubmissionMessage = this.renderSubmissionMessage.bind(this);
    }

    componentDidMount() {
        //TODO: use this.props.mentorId to get mentor info from backend
        if (this.props.mentorPicked) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/getMentorById`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    id: this.props.mentorId
                })
            }).then(async res => {
                let resolvedRes = await res;
                resolvedRes = await resolvedRes.json()
                console.log(resolvedRes)
                this.setState({
                    mentor: resolvedRes
                });
            });
        }
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
        this.setState({
            topicSelection: value,
            topicSelectComplete: true,
        })
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
            this.state.mentor.name + '.' : 'a mentor we will pick for you shortly.'} `
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
                    {this.props.mentorPicked ? `Your call will be scheduled with ${this.state.mentor && this.state.mentor.name}.` :
            `We will match you to a mentor who's most apt to meet your needs.`}
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