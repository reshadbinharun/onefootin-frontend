import React from 'react'
import { Grid, Form, Message, Button, Dropdown } from 'semantic-ui-react'
import {ESSAY_BRAINSTORM, ESSAY_CRITIQUE, ECA_STRATEGY, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION} from "../topics"
import {BACKEND} from "../App"
import TimeSelector from "./TimeSelector"
import swal from "sweetalert";

const TOPIC_OPTIONS = [ECA_STRATEGY, ESSAY_CRITIQUE, ESSAY_BRAINSTORM, COLLEGE_SHORTLISTING, FINANCIAL_AID_MATTERS, GENERAL_CONSULTATION];
let topicsOptions = TOPIC_OPTIONS.map(val => {
    return {key: val, text: val, value: val}
})

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class ScheduleForm extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedTopics: [],
            selectTimes: false,
            mentorsByTopic: [],
        }
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
        this.selectTimes = this.selectTimes.bind(this);
        this.getMentorsByTopic = this.getMentorsByTopic.bind(this);
    }

    async selectTimes(e) {
        if (e) {e.preventDefault()};
        await this.getMentorsByTopic();
        if (this.state.selectedTopics.length !== 0) {
            this.setState({
                selectTimes: !this.state.selectTimes
            })
        } else {
            swal({
                title: "Slow down there!",
                text: "Please fill in all fields to continue.",
                icon: "warning",
            });
        }
    }

    handleChangeTopic(e, {value}) {
        e.preventDefault();
        this.setState({
            selectedTopics: value
        })
    }

    /*
    TODO: Adjust backend getMentorsByTopic(Union/Intersection) to determine if all matching mentors are returned
    */
    async getMentorsByTopic() {
        let payload = {requestedTopics: this.state.selectedTopics};
        console.log("get topic matched mentors");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        await fetch(`${BACKEND}/getMatchingMentorsByTopic`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(async res => {
            let resolvedRes = await res.json()
            if (res.status===200){
                console.log("received response", resolvedRes)
                this.setState({
                    mentorsByTopic: resolvedRes
                })
            } else {
                console.log("res rejected")
            }
        });
    }

    render() {
    return (
        <div>
            {
                this.state.selectTimes? <TimeSelector 
                    mentorsByTopic = {this.state.mentorsByTopic}
                    topics = {this.state.selectedTopics}
                    menteeId = {this.props.menteeId}
                    menteeTimeZone = {this.props.menteeTimeZone}
                /> : 
                <div>
                    <Message
                        style= {messageStyle}
                        attached
                        centered
                        header="Select topics you'd like to speak about."
                        content="We will show you times that we can accommodate you for."
                    />
                    <Grid>
                        <Grid.Column centered>
                        <Grid.Row>
                        <Form >
                            <Form.Field>
                            <Dropdown placeholder='Preferred Topics' fluid multiple selection options={topicsOptions} onChange={this.handleChangeTopic} name="preferredTopics"/>
                            </Form.Field>
                            <Grid.Row>
                                <Button onClick={this.selectTimes}>Select preferred times</Button>
                            </Grid.Row>
                            </Form>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </div>
            }
        </div>)
    }
}