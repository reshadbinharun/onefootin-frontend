/* eslint-disable max-len */
import React from 'react'
import { Container } from 'semantic-ui-react'
import CallCard from './CallCard';
import VideoComponent from '../Video/VideoComponent';
import axios from 'axios';
import { BACKEND } from '../../App';

export default class Backlog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showVideo: false,
            requestIdForVideo: null,
            menteeName: '',
        }
        this.renderRequestCards = this.renderRequestCards.bind(this);
        this.getRequestForVideoMentor = this.getRequestForVideoMentor.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
    }

    leaveRoom() {
        this.setState({
            showVideo: false,
        })
    }

    getRequestForVideoMentor(requestId, menteeName) {
        // TODO: add corresponding "Join Call" Button from mentor that gets roomName
        axios.post(`${BACKEND}/getRoomName`, {
            requestId: this.props.requestId,
        }).then(results => {
            // Add room only if room does not exist
            const { roomName } = results.data;
            if (roomName === '') {
                console.log("roomName not set, adding room...")
                axios.post(`${BACKEND}/addRoom`, {
                    requestId: requestId,
                })
            }
        }).then(() => {
            this.setState({
                showVideo: true,
                requestIdForVideo: requestId,
                menteeName: menteeName,
            })
        }).catch(err => {
            throw(err)
        });
    }

    renderRequestCards(calls) {
        return calls.map(call => {
            return (
                <CallCard
                    // TODO: fetch info about mentor on getAllRequests backend call + adjust to Mentor's timezone
                    getRequestForVideoMentor={this.getRequestForVideoMentor}
                    mentorTimeZone={this.props.mentorTimeZone}
                    topic={call.topic}
                    time={call.dateTime}
                    requestId={call.id}
                    mentee={call.mentee}
                    confirmed={this.props.confirmed}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                {this.state.showVideo? <VideoComponent
                    otherName={this.state.menteeName}
                    myName={this.props.mentorName}
                    requestId={this.state.requestIdForVideo}
                    leaveRoom={this.leaveRoom}
                    email={this.props.mentorEmail}
                /> : this.renderRequestCards(this.props.calls)
                }
            </Container>
          )
    }
}
