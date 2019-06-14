import React, { Component } from 'react'
import { Grid, Form, Container, Message, Button, Dropdown } from 'semantic-ui-react'
import _ from 'lodash'
import {BACKEND} from "../App"

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function convertTo12h(time) {
    let hh = parseInt(time/100);
    let mm = (time%100)
    let mmString = mm === 50 ? `30` : `00`;
    let meridian = hh/12 > 1 && hh/12 < 2 ? 'pm' : 'am';
    return `${hh%12===0 ? 12: hh%12}.${mmString}${meridian}`
}

// returns a 2d array where each item is array of 24h time and day
function generateTimesfromStartOfSlot(day, startTimeIn24h, slotsNum) {
    let allTimes = []
    let dayMoved = false; // day is only going to be moved once possibly in one timeSlot
    while (slotsNum) {
        slotsNum--;
        allTimes.push({time: startTimeIn24h%2400, day: day});
        startTimeIn24h += 50; // increment by 30 min
        if (startTimeIn24h/2400 > 1 && !dayMoved) {
            day = moveDay(day, true); // move day forward if time is in next day, only possibility is moving day forward
            dayMoved = true;
        }
    }
    return allTimes;
}

function convertTo24hours(time) {
    let pm = time.substring(time.length-2) === 'pm'
    let mentorAdjustedTime = 0;
    let hours = time.length > 3 ? parseInt(time.substring(0,2))*100 : parseInt(time[0])*100;
    if ( (pm && hours === 1200) || (!pm && hours === 1200) ) {
        hours = 0; //1200 will be added to pm, 12am needs to be reset to 0
    }
    mentorAdjustedTime = hours + (pm ? 1200 : 0);
    return mentorAdjustedTime;
}

function moveDay(day, moveDayForward) {
    let dayInd = (days.indexOf(day) + (moveDayForward ? 1 : -1)) % days.length
    if (dayInd < 0) {
        return days[6];
    }
    return days[dayInd];
}

function adjustTime(mentorTime, menteeTimeZone, mentorTimeZone) {
    let parts = mentorTime.split('-');
    let GMTOffset = 0;
    GMTOffset = parseInt(menteeTimeZone.substring(3)) - parseInt(mentorTimeZone.substring(3)); //from perspective of mentee --> mentee GMT - mentor GMT
    let adjustedTime = 0;
    // adjusted time is brought to mentee's timeZone, postive when mentee ahead
    adjustedTime = convertTo24hours(parts[1])+GMTOffset;
    let day = parts[0];
    let timeIn24h = adjustedTime;
    // move day forward
    if (adjustedTime > 2400) {
        day = moveDay(parts[0], true);
        timeIn24h = adjustedTime%2400;
    }
    // move day backward
    if (adjustedTime < 0) {
        day = moveDay(parts[0], false);
        timeIn24h = 2400+adjustedTime;
    }
    // return an array of 6 times
    console.log("generating slots from", `${day}-${timeIn24h}`);
    let timesIn24h = generateTimesfromStartOfSlot(day, timeIn24h, 6);
    return timesIn24h.map(timeSlot => {
        let dayTimeSlots = [];
        let _12hrTime = convertTo12h(timeSlot.time)
        dayTimeSlots.push(`${timeSlot.day}-${_12hrTime}`)
        return [...dayTimeSlots]
    })
}

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
            // takes mentor and mentorPicked bool as prop
            this.setState({
                topicOptions:  _.map(this.state.mentor && this.state.mentor.preferredTopics, option => ({
                    key: option,
                    text: option,
                    value: option
                }))
            },() => {
                let menteeTimeZoneAdjustedTimes = this.state.mentor && this.state.mentor.preferredTimes.map(
                        time => {
                            return [...adjustTime(time, this.props.menteeTimeZone, this.state.mentor.timeZone)]
                        }
                    );
                let menteeTimes = menteeTimeZoneAdjustedTimes.flat();
                this.setState({
                    timeOptions: _.map(menteeTimes, option => ({
                        key: option,
                        text: option,
                        value: option
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