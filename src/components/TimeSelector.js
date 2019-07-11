import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Message, Dropdown, Button, Grid, Form } from 'semantic-ui-react';
import { adjustTime } from "./ScheduleFormMentorPicked";
import { BACKEND } from "../App"

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

// TODO: add a table that lists all times, has search, and pagination

// has props mentorsByTopic, selectedTopics, menteeId, menteeTimeZone
export default class TimeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timesOptions: [],
            timeSelection: [],
            submitting: false,
        }
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
        })
        let payload = {
            times: this.state.timeSelection,
            topics: this.props.topics
        };
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        await fetch(`${BACKEND}/addRequests`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(async res => {
            if (res.status===200){
                console.log("received response")
                // TODO: replace with react.alert
                alert("Thank you your submission has been received!");
            } else {
                console.log("res rejected")
            }
        });
    }

    handleChangeTime(e, {value}) {
        // check async await pattern, nest as callbacks if not working
        e.preventDefault();
        this.setState({
            timeSelection: value,
        },() => {
            console.log(this.state)
        })
    }

    componentDidMount() {
        let allTimeObjects = this.props.mentorsByTopic && this.props.mentorsByTopic.map(mentor => {
            return mentor.preferredTimes.map(time => {
                let menteeAdjustedTime = adjustTime(time, this.props.menteeTimeZone, mentor.timeZone);
                return menteeAdjustedTime.map(menteeAdjustedTimeSlot => {return {key: `${menteeAdjustedTimeSlot},${mentor.id},${this.props.menteeId}`, text: menteeAdjustedTimeSlot, value: `${menteeAdjustedTimeSlot},${mentor.id},${this.props.menteeId}`}})
            })
        })
        this.setState({
            timesOptions : allTimeObjects.flat().flat() || []
        })
    }
    render() {
        return (
            <div>
                <Message
                    style= {messageStyle}
                    attached
                    centered
                    header="Select the times that work for you."
                    content="We will match you to a mentor."
                />
                <Grid>
                        <Grid.Column centered>
                        <Grid.Row>
                        <Form >
                            <Form.Field>
                                <Dropdown placeholder='Preferred Times' fluid multiple selection options={this.state.timesOptions} onChange={this.handleChangeTime} name="preferredTimes"/>
                            </Form.Field>
                            <Grid.Row>
                                <Button loading = {this.state.submitting} onClick={this.handleSubmit}>Submit</Button>
                            </Grid.Row>
                            </Form>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
            </div>
        )
    }
}
