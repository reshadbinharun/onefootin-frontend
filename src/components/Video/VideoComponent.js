import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';
import { Button, Container, Grid, Message } from "semantic-ui-react"
import {BACKEND} from "../../App"
import ChatComponent from '../Chat/ChatComponent';

const VIDEO_WIDTH = 450;

// Code inspired by Twilio Blogs --> https://www.twilio.com/blog/2018/03/video-chat-react.html

export default class VideoComponent extends Component {
    constructor(props) {
        super();
        this.state = {
            identity: null,  /* Will hold the fake name assigned to the client. The name is generated by faker on the server */
            roomName: '',    /* Will store the room name */
            roomNameErr: false,  /* Track error for room name TextField. This will    enable us to show an error message when this variable is true */
            previewTracks: null,
            localMediaAvailable: false, /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */
            hasJoinedRoom: false,
            activeRoom: null, // Track the current active room
            showChat: false,
        };
        this.joinRoom = this.joinRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.detachTracks = this.detachTracks.bind(this);
        this.detachParticipantTracks =this.detachParticipantTracks.bind(this);
    }

componentDidMount() {
    axios.post(`${BACKEND}/getRoomName`, {
      requestId: this.props.requestId,
    }).then(results => {
      const { roomName } = results.data;
      this.setState({ roomName });
    }).then(()=> {
      axios.post(`${BACKEND}/getTwilioToken`, {
        email: this.props.email,
      }).then(results => {
          /*
          Make an API call to get the token and identity(fake name) and  update the corresponding state variables.
          */
          const { identity, token } = results.data;
          console.log("participant identity is", identity)
          this.setState({ identity, token });
      });
    })
    
}

// Attach the Tracks to the DOM.
attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
}

// Attach the Participant's Tracks to the DOM.
attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
}

roomJoined(room) {
    // Called when a participant joins a room
    console.log("Joined as '" + this.state.identity + "'");
    this.setState({
        activeRoom: room,
        localMediaAvailable: true,
        hasJoinedRoom: true  // Removes ‘Join Room’ button and shows ‘Leave Room’
});

    // Attach LocalParticipant's tracks to the DOM, if not already attached.
    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector('video')) {
        this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
    // Attach the Tracks of the room's participants.
    room.participants.forEach(participant => {
        console.log("Already in Room: '" + participant.identity + "'");
        var previewContainer = this.refs.remoteMedia;
        this.attachParticipantTracks(participant, previewContainer);
      });
  
      // Participant joining room
      room.on('participantConnected', participant => {
        console.log("Joining: '" + participant.identity + "'");
      });
  
      // Attach participant’s tracks to DOM when they add a track
      room.on('trackAdded', (track, participant) => {
        console.log(participant.identity + ' added track: ' + track.kind);
        var previewContainer = this.refs.remoteMedia;
        this.attachTracks([track], previewContainer);
      });
  
      // Detach participant’s track from DOM when they remove a track.
      room.on('trackRemoved', (track, participant) => {
        console.log(participant.identity + ' removed track: ' + track.kind);
        this.detachTracks([track]);
      });
  
      // Detach all participant’s track when they leave a room.
      room.on('participantDisconnected', participant => {
        console.log("Participant '" + participant.identity + "' left the room");
        this.detachParticipantTracks(participant);
      });
  
      // Once the local participant leaves the room, detach the Tracks
      // of all other participants, including that of the LocalParticipant.
      room.on('disconnected', () => {
        if (this.state.previewTracks) {
          this.state.previewTracks.forEach(track => {
            track.stop();
          });
        }
        this.detachParticipantTracks(room.localParticipant);
        room.participants.forEach(this.detachParticipantTracks);
        this.state.activeRoom = null;
        this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
      });
}

joinRoom() {
     /* 
  Show an error message on room name text field if user tries joining a room without providing a room name. This is enabled by setting `roomNameErr` to true
    */
    if (!this.state.roomName.trim()) {
        this.setState({ roomNameErr: true });
        return;
    }

    console.log("Joining room '" + this.state.roomName + "'...");
    let connectOptions = {
        audio: true,
        name: this.state.roomName,
        video: {width: VIDEO_WIDTH}
    };

    if (this.state.previewTracks) {
        connectOptions.tracks = this.state.previewTracks;
    }

    /* 
  Connect to a room by providing the token and connection options that include the room name and tracks. We also show an alert if an error occurs while connecting to the room.    
  */  
  Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
    alert('Could not connect to Twilio: ' + error.message + 'Please try joining room again.');
  });

}
leaveRoom() {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false, 
      }, () => {
        this.props.leaveRoom();
      });
}

detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());
  this.detachTracks(tracks);
}

showChat(e) {
  e.preventDefault();
  this.setState({
    showChat: !this.state.showChat
  });
}

render() {
    /* 
     Controls showing of the local track
     Only show video track after user has joined a room else show nothing 
    */
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item"><div ref="localMedia" /> </div>) : '';   
    /*
     Controls showing of ‘Join Room’ or ‘Leave Room’ button.  
     Hide 'Join Room' button if user has already joined a room otherwise 
     show `Leave Room` button.
    */
    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
        <Button  onClick={this.leaveRoom} > Leave Room </Button>
        ) : (
        <Button onClick={this.joinRoom} > Join Room </Button>);
    let videoWindowStyle  = {
      width: '600px'
    }
    return (
        <Container centered>
          <Grid rows={2}>
            <Grid.Row>
              <Grid columns={2}>
                  <Grid.Column>
                    <Grid.Row style={videoWindowStyle}>
                      <Container>
                        <div className="flex-container"></div>
                        <Message
                          content={this.props.myName}
                          icon='user circle'
                        />
                      </Container>
                      {showLocalTrack} {/* Show local track if available */} 
                    </Grid.Row>
                    <Grid.Row >
                    <div className="flex-item">
                      {joinOrLeaveRoomButton}  {/* Show either ‘Leave Room’ or ‘Join Room’ button */}
                      </div>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid.Row style={videoWindowStyle}>
                      {/* 
                      The following div element shows all remote media (other participant’s tracks) 
                      */}
                      <Container>
                        <div className="flex-item" ref="remoteMedia" id="remote-media" />
                        <Message
                          content={this.props.otherName}
                          icon='user circle'
                        />
                      </Container>
                      
                    </Grid.Row>
                  </Grid.Column>
              </Grid>
            </Grid.Row>
            <Grid.Row>
              {this.state.showChat? 
              <ChatComponent
                requestId={this.props.requestId}
                roomName={this.state.roomName}
                showChat={this.showChat}
                email={this.props.email}
                myName={this.props.myName}
                otherName={this.props.otherName}
              /> : 
              <Button onClick={(e) => this.showChat(e)}>
                Enter Chat.
              </Button>}
            </Grid.Row>
          </Grid>
        </Container>
    );
  }
}