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
        }
        this.renderRequestCards = this.renderRequestCards.bind(this);
        this.getRequestForVideo = this.getRequestForVideo.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
    }

    leaveRoom() {
        this.setState({
            showVideo: false,
        })
    }

    getRequestForVideo(requestId) {
        // TODO: add corresponding "Join Call" Button from mentor that gets roomName
        axios.post(`${BACKEND}/getRoomName`, {
            requestId: this.props.requestId,
        }).then(results => {
            // Add room only if room does not exist
            const { roomName } = results.data;
            if (roomName === '') {
                axios.post(`${BACKEND}/addRoom`, {
                    requestId: requestId,
                })
            }
        }).then(() => {
            console.log("setting show room")
            this.setState({
                showVideo: true,
                requestIdForVideo: requestId,
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
                    getRequestForVideo={this.props.confirmed ? this.getRequestForVideo : null}
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
                {this.state.showVideo? this.renderRequestCards(this.props.calls) :
                <VideoComponent
                    requestId={this.state.requestIdForVideo}
                    leaveRoom={this.leaveRoom}
                />}
            </Container>
          )
    }
}
