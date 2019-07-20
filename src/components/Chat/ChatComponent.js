import React, { Component } from 'react';
import Chat from 'twilio-chat';
import {BACKEND} from '../../App'
import axios from 'axios';

// Chat component implementation inspired by --> https://github.com/philnash/react-programmable-chat/blob/master/client/src/ChatApp.js

export default class ChatComponent extends Component {
  constructor(props) {
    // TODO: props --> requestId, email as identity to get token with, self, other, showChat
    super(props);
    this.state = {
        identity: '',
        token: '',
        chatReady: false,
        messages: [],
        newMessage: '',
        roomName: '',
        channel: null,
    };
    this.clientInitiated = this.clientInitiated.bind(this);
  }

  componentWillMount = () => {
    this.getToken();
  };

  onNameChanged = event => {
    this.setState({ name: event.target.value });
  };

  closeChat = event => {
    event.preventDefault();
    this.setState({
      token: '',
      chatReady: false,
      messages: [],
      newMessage: ''
    });
    this.chatClient.shutdown();
    this.state.channel = null;
    this.props.showChat(event);
  };

  getToken = () => {
    axios.post(`${BACKEND}/getRoomName`, {
        requestId: this.props.requestId,
      }).then(results => {
        const { roomName } = results.data;
        this.setState({ roomName });
      }).then(()=> {
        axios.post(`${BACKEND}/getTwilioChatToken`, {
          email: this.props.email,
        }).then(results => {
            const { identity, token } = results.data;
            console.log("participant identity for chat is", identity)
            console.log("state after getting chat token is", this.state)
            this.setState({ identity, token },
                this.initChat);
        });
      })
  };

  initChat = () => {
    this.chatClient = new Chat(this.state.token);
    // this.chatClient.initialize().then(this.clientInitiated.bind(this));
    this.chatClient.initialize();
    this.clientInitiated();
    console.log("chat initialized")
  };

  clientInitiated = () => {
      console.log("client initiated is called")
    this.setState({ chatReady: true }, () => {
      this.chatClient
        .getChannelByUniqueName(this.roomName)
        .then(channelRes => {
            console.log("gotten channel", channelRes)
          if (channelRes) {
            return (this.state.channel = channelRes);
          }
        })
        .catch(err => {
            console.log("error is ", err)
          if(err.body.code === 50300){
            return this.chatClient.createChannel({
              uniqueName: this.state.roomName
            });
          }
        })
        .then(channelNew => {
            console.log("creating new channel...")
          this.state.channel = channelNew;
          window.channel = channelNew;
          return this.state.channel.join();
        })
        .then(() => {
          this.state.channel.getMessages().then(this.messagesLoaded);
          this.state.channel.on('messageAdded', this.messageAdded);
        });
    });
  };

  messagesLoaded = messagePage => {
    this.setState({ messages: messagePage.items });
  };

  messageAdded = message => {
    this.setState((prevState, props) => ({
      messages: [...prevState.messages, message]
    }));
  };

  onMessageChanged = event => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    const message = this.state.newMessage;
    this.setState({ newMessage: '' });
    this.state.channel.sendMessage(message);
  };

  newMessageAdded = li => {
    if (li) {
      li.scrollIntoView();
    }
  };

  render() {
    const messages = this.state.messages.map(message => {
      return (
        <li key={message.sid} ref={this.newMessageAdded}>
          <b>{message.author}:</b> {message.body}
        </li>
      );
    });
    return (
        <div>
          <h3>Messages</h3>
          <p>Logged in as {this.props.myName}</p>
          <ul className="messages">
            {messages}
          </ul>
          <form onSubmit={this.sendMessage}>
            <label htmlFor="message">Message: </label>
            <input
              type="text"
              name="message"
              id="message"
              onChange={this.onMessageChanged}
              value={this.state.newMessage}
            />
            <button>Send</button>
          </form>
          <br /><br />
          <form onSubmit={this.props.showChat}>
            <button>Close Chat</button>
          </form>
        </div>
    )
  }
}


