import React, { Component } from 'react'
import { Grid, Form, Container, Message, Button, Dropdown } from 'semantic-ui-react'
import _ from 'lodash'
import {BACKEND} from "../App"
import { convertToViewerTimeZone } from './TimezoneAdjustmentHelpers';

export default class ScheduleFormMentorPicked extends Component {
    constructor(props){
        super(props);
        this.state = {
            topicSelection: '',
            timeSelection: '',
            mentor: null,
            topicOptions: [],
            timeOptions: [],
            formComplete: false,
        }
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderSubmissionMessage = this.renderSubmissionMessage.bind(this);
    }

    componentDidMount() {
    //TODO: use this.props.mentorId to get mentor info from backend
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
        }).then(() => {
            // TODO: store request time as GMT-free
            this.setState({
                topicOptions:  _.map(this.state.mentor && this.state.mentor.preferredTopics, option => ({
                    key: option,
                    text: option,
                    value: option
                }))
            },() => {
                console.log('preferred times is', this.state.mentor.preferredTimes)
                let menteeTimeObjects = this.state.mentor && this.state.mentor.preferredTimes.map(
                        time => {
                            console.log("time being viewed is", time)
                            return {
                                gmtFreeTime: time,
                                viewTime: convertToViewerTimeZone(time, this.props.menteeTimeZone)
                            }
                        }
                    );
                this.setState({
                    timeOptions: _.map(menteeTimeObjects, option => ({
                        key: option.viewTime,
                        text: option.viewTime,
                        value: option.gmtFreeTime
                    }))
                })
            })
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            formComplete: true,
        },() => {
            let newRequestPayload = {
                dateTime: this.state.timeSelection,
                requestorId: this.props.menteeId,
                topic: this.state.topicSelection,
                mentorId: this.state.mentor.id
            }
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/newRequestByMentor`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(newRequestPayload)
            }).then(res => {
                console.log("received response", res.json())
            });
        })
        // send updated information
        /*
        This function might be better passed in as prop from NavBar to update schedule when populated with new entry
        */
    }
    handleChangeTopic(e, {value}) {
        // check async await pattern, nest as callbacks if not working
        e.preventDefault();
        this.setState({
            topicSelection: value,
        })
    }
    handleChangeTime(e, {value}) {
        // check async await pattern, nest as callbacks if not working
        e.preventDefault();
        this.setState({
            timeSelection: value,
        })
    }

    renderSubmissionMessage(){
        let message1 = `Your call is scheduled with ${this.state.mentor.name}.`
        let message2 = `Your call will be about ${this.state.topicSelection}. `
        let message3 = `You have requested your call at ${this.state.timeSelection}.`
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
                    {`Your call will be scheduled with ${this.state.mentor && this.state.mentor.name}.`}
                    </p>
                    {this.state.formComplete? this.renderSubmissionMessage() : null}
                </Message>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Grid rows={5} style={gridStyle}>
                        <Grid.Row>
                            <Form.Field>
                                <Dropdown placeholder='Topic' fluid selection options={this.state.topicOptions} onChange={this.handleChangeTopic} name="preferredTopics"/>
                            </Form.Field>
                        </Grid.Row>
                        <Grid.Row>
                            <Form.Field>
                                <Dropdown placeholder='Times' fluid selection options={this.state.timeOptions} onChange={this.handleChangeTime} name="preferredTopics"/>
                            </Form.Field>
                        </Grid.Row>
                        <Grid.Row>
                            <Button 
                                disabled={!this.state.timeSelection 
                                    || !this.state.topicSelection} 
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