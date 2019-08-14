import React, { Component } from 'react'
import { Grid, Form, Container, Message, Button, Dropdown } from 'semantic-ui-react'
import _ from 'lodash'
import {BACKEND} from "../App"
import { convertToViewerTimeZone } from './TimezoneAdjustmentHelpers';
import swal from "sweetalert";

export default class ScheduleFormMentorPicked extends Component {
    constructor(props){
        super(props);
        this.state = {
            topicSelection: '',
            timeSelection: '',
            mentee_intro: '',
            mentor: null,
            topicOptions: [],
            timeOptions: [],
            formComplete: false,
        }
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeIntro = this.handleChangeIntro.bind(this);
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
                let menteeTimeObjects = this.state.mentor && this.state.mentor.preferredTimes[0].map(
                        time => {
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
                mentorId: this.state.mentor.id,
                mentee_intro: this.state.mentee_intro,
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
                if (res.status !== 200) {
                    swal({
                        title: `Oops!`,
                        text: "Something went wrong! Please try again.",
                        icon: "error",
                    });
                } else {
                    swal({
                        title: `You're all set!`,
                        text: "You've successfully requested a call! Keep an eye out on your email for updates.",
                        icon: "success",
                    });
                }
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
    handleChangeIntro(e) {
        // check async await pattern, nest as callbacks if not working
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
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
                            <Form.Field
                            >
                                <label>Briefly tell us what you want to speak about.</label>
                                <input placeholder='Your intro for the call...' name="mentee_intro" maxLength = "500" onChange={this.handleChangeIntro} />
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