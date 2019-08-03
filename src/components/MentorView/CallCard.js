import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { moveDay, convertTo12h } from "../ScheduleFormMentorPicked"
import { BACKEND } from "../../App"
import swal from "sweetalert";

// Input of form 9.00am or 11.30pm
function convertTo24hours(time)
{
    let viewerAdjustedTime = 0;
    let pm = time.substring(time.length-2) === 'pm'
    let parts = time.split('.');
    let minStr = parts[1].substring(0,2);
    let min = minStr === '30' ? 50 : 0;
    let hours = parts[0].length > 1 ? parseInt(parts[0].substring(0,2))*100 : parseInt(time[0])*100;
    if ( (pm && hours === 1200) || (!pm && hours === 1200) ) {
        hours = 0; //1200 will be added to pm, 12am needs to be reset to 0
    }
    viewerAdjustedTime = hours + (pm ? 1200 : 0) + min;
    return viewerAdjustedTime;
}
/*
Unlike adjust time which returns an array of 6 30min slots with a start time
Input time is of form Sunday-9.00am-GMT+0400
*/
export function convertToViewerTimeZone(time, viewerGMT, otherGMT) {
    // console.log(`Time is converted from ${time} at ${otherGMT} to GMT ${viewerGMT}`);
    // TODO: Store time without the GMT append in database to avoid this parsing
    let parts = time.split('-');
    let GMTOffset = 0;
    GMTOffset = parseInt(viewerGMT.substring(3)) - parseInt(otherGMT.substring(3)); //from perspective of viewer --> viewer GMT - other GMT
    let adjustedTime = 0;
    // adjusted time is brought to viewer's timeZone, postive when viewer ahead
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
    let timeDisplay = `${day} ${convertTo12h(timeIn24h)}`.replace('{"','');
    return (timeDisplay);
}

export default class CallCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
    }
    handleConfirm(e) {
        console.log("clicked confirm");
        e.preventDefault();
        let confirmPayload = {
            requestId: this.props.requestId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/confirmRequest`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(confirmPayload)
        }).then(res => {
            if (res.status !== 200) {
                console.log("Request failed")
            } else {
                console.log("received response", res.json())
                swal({
                    title: `You've confirmed a call with ${this.props.mentee.name}`,
                    text: "Please refresh the app, to view current state of appointments.",
                    icon: "success",
                  });
            }
        });
    }
    render() {
        const {mentee, topic, time, mentorTimeZone} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            // TODO: update confirm/dismiss with backend calls
            // TODO: adjustTime to mentor's timeZone
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Request from {mentee.name}</Card.Header>
                    <Card.Meta>Topic {topic} at { convertToViewerTimeZone(time, mentorTimeZone, mentee.timeZone) }</Card.Meta>
                    <Card.Description>
                        {mentee.name} attends {mentee.school} and is from {mentee.location}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button 
                        onClick={(e) => this.props.confirmed ? this.props.getRequestForVideoMentor(this.props.requestId, mentee.name) : this.handleConfirm(e)}
                        basic color='dark orange'>
                        {this.props.confirmed ? 'Join Video Call' : 'Confirm'}
                    </Button>
                    {/* TODO: Include ability to cancell requests for mentors */}
                    <Button basic color='yellow' disabled>
                        Dismiss
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}