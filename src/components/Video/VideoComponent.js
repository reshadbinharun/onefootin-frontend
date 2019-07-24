import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';
import { Button, Container, Grid, Message, Form, Icon, TextArea, Label } from "semantic-ui-react"
import {BACKEND} from "../../App";
import Timer from "react-compound-timer";
import swal from "sweetalert";

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
            notes: '',
        };
        this.joinRoom = this.joinRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.detachTracks = this.detachTracks.bind(this);
        this.detachParticipantTracks =this.detachParticipantTracks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
      e.preventDefault();
      let change = {}
      change[e.target.name] = e.target.value
      this.setState(change)
  }

    handleSubmit(e) {
      e.preventDefault();
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      fetch(`${BACKEND}/sendNotes`, {
        method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
              notes: this.state.notes,
              requestId: this.props.requestId,
            })
      }).then(res => {
        if (res.status === 200) {
          alert(`Successfully sent notes to mentee!`)
        } else {
          alert(`Something went wrong. Please try again.`)
        }
      })
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
    alert('Could not connect to Twilio: ' + error.message + 'Please try joining call again.');
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

render() {
    /* 
     Controls showing of the local track
     Only show video track after user has joined a room else show nothing 
    */
    let showLocalTrack = this.state.localMediaAvailable ? (
      <Container>
        <div ref="localMedia" />
        <Timer
          initialTime={0}
          direction="forward"
          checkpoints={[
              {
                  time: 30 * 60 * 1000,
                  callback: () => swal("You have already used 30 minutes. Call will end in another 5 minutes!", {
                    timer: 5000,
                    icon: "info",
                    showConfirmButton: false,
                  }),
              },
              {
                  time: 35 * 60 * 1000,
                  callback: () => {
                    swal("Call will end in 5 seconds...", {
                      timer: 5000,
                      icon: "warning",
                      showConfirmButton: false,
                    })
                    setTimeout(() => {this.leaveRoom()}, 3000);
                  },
              }
          ]}
          >
              {() => (
                  <React.Fragment>
                    <Label style={{margin: "10px"}} color="orange" tag>
                      <Icon name="stopwatch"/>
                      <Timer.Minutes />:
                      <Timer.Seconds />
                    </Label>
                  </React.Fragment>
              )}
          </Timer>
        </Container>) : '';
    /*
     Controls showing of ‘Join Room’ or ‘Leave Room’ button.  
     Hide 'Join Room' button if user has already joined a room otherwise 
     show `Leave Room` button.
    */
    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
        <Button
        style={{
          margin: "10px"
        }}
        onClick={this.leaveRoom} 
        > Leave Room </Button>
        ) : (
        <Button onClick={this.joinRoom} > Join Room </Button>);
    return (
        <Container centered>
        <Grid row={2}>
          <Grid.Row>
          <Grid columns={2}>
                <Grid.Column>
                  <Grid.Row>
                    <Container style={{width:"510px"}}>
                      <Message
                        style={{width:"500px"}}
                        content={this.props.myName}
                        icon='user circle'
                      />
                      {showLocalTrack}
                    </Container>
                   {/* Show local track if available */}
                  </Grid.Row>
                  <Grid.Row>
                    <Grid columns={2}>
                    <Grid.Column>
                    <div className="flex-item">
                    {joinOrLeaveRoomButton}  {/* Show either ‘Leave Room’ or ‘Join Room’ button */}
                    </div>
                    </Grid.Column>
                    </Grid>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                  <Grid.Row>
                    {/* 
                    The following div element shows all remote media (other participant’s tracks) 
                    */}
                    <Container style={{width:"510px"}}>
                      <Message
                        style={{width:"500px"}}
                        content={this.props.otherName}
                        icon='user circle'
                      />
                      <div ref="remoteMedia" id="remote-media" />
                    </Container>
                    
                  </Grid.Row>
                </Grid.Column>
            </Grid>
          </Grid.Row>
          {this.props.isMentor ? 
          <Grid.Row>
            <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <TextArea
                placeholder="Please enter any notes you would like to send the mentee by email here..."
                centered
                style={{
                  width: "500px",
                  height: "200px",
                  margin: "10px"
                }}  name="notes" onChange={this.handleChange}
              />
            </Form.Field>
            <Button 
              color="yellow" 
              type='submit'
              style={{
                margin: "10px"
              }}>
              <Icon name="tasks"/>
              Send Notes!
            </Button>
            </Form>
          </Grid.Row> : null
        }
        </Grid> 
        </Container>
    );
  }
}