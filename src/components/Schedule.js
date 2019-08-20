/* eslint-disable max-len */
import React from 'react'
import { Container } from 'semantic-ui-react'
import ScheduleCard from './ScheduleCard';
import { BACKEND } from "../App"
import { convertToViewerTimeZone } from "./TimezoneAdjustmentHelpers"

export default class Schedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            schedules: [],
            menteeId: null,
        }
        this.renderScheduleCards = this.renderScheduleCards.bind(this);
    }
    
    // TODO: use BACKEND to list confirmed calls
    componentDidMount() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        this.setState({
            menteeId: this.props.menteeId
        }, async () => 
            await fetch(`${BACKEND}/getConfirmedRequestsForMentee`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    menteeId: this.props.menteeId,
                })
            }).then(async res => {
                let resolvedRes = await res;
                if (resolvedRes.status !== 200) {
                    console.log("Request to get mentee schedules was not successful")
                } else {
                    resolvedRes = await res.json()
                    this.setState({
                        schedules: resolvedRes
                    })
                }
            })
        );
    }

    renderScheduleCards() {
        return this.state.schedules && this.state.schedules.filter(call => {
            return (!call.feedback_given || !call.confirmed);
        }).map(request => {
            return (
                <ScheduleCard
                    time={convertToViewerTimeZone(request.dateTime, request.mentee.timeZone)}
                    topic={request.topic}
                    mentor={request.mentor.name}
                    requestId={request.id}
                    meetingRoom={request.mentor.zoom_info}
                    requestDone={request.done}
                    confirmed={request.confirmed}
                /> 
            )
        })
    }

    render() {
        return (
            <Container>
                {this.renderScheduleCards()}
            </Container>
          )
    }
}
