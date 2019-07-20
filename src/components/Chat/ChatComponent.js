import React, { Component } from 'react';
import Chat from 'twilio-chat';
import BACKEND from '../../App'
import axios from 'axios';

// Chat component implementation inspired by --> https://github.com/philnash/react-programmable-chat/blob/master/client/src/ChatApp.js

export default class ChatComponent extends Component {
  constructor(props) {
    // TODO: props --> requestId, email as identity to get token with, self, other, showChat
    super(props);
    // const name = localStorage.getItem('name') || '';
    // const loggedIn = name !== '';
    this.state = {
    //   name,
    //   loggedIn,
        identity: '',
        token: '',
        chatReady: false,
        messages: [],
        newMessage: '',
        roomName: '',
    };
    // this.channelName = 'general';
  }

  componentWillMount = () => {
    // if (this.state.loggedIn) {
    //   this.getToken();
    // }
    this.getToken();
  };

  onNameChanged = event => {
    this.setState({ name: event.target.value });
  };

//   logIn = event => {
//     event.preventDefault();
//     if (this.state.name !== '') {
//       localStorage.setItem('name', this.state.name);
//       this.setState({ loggedIn: true }, this.getToken);
//     }
//   };

//   logOut = event => {
//     event.preventDefault();
//     this.setState({
//       name: '',
//       loggedIn: false,
//       token: '',
//       chatReady: false,
//       messages: [],
//       newMessage: ''
//     });
//     localStorage.removeItem('name');
//     this.chatClient.shutdown();
//     this.channel = null;
//   };

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
            /*
            Make an API call to get the token and identity(fake name) and  update the corresponding state variables.
            */
            const { identity, token } = results.data;
            console.log("participant identity is", identity)
            this.setState({ identity, token },
                this.initChat);
        });
      })
  };

  initChat = () => {
    this.chatClient = new Chat(this.state.token);
    this.chatClient.initialize().then(this.clientInitiated.bind(this));
  };

  clientInitiated = () => {
    this.setState({ chatReady: true }, () => {
      this.chatClient
        .getChannelByUniqueName(this.roomName)
        .then(channel => {
          if (channel) {
            return (this.channel = channel);
          }
        })
        .catch(err => {
          if(err.body.code === 50300){
            return this.chatClient.createChannel({
              uniqueName: this.channelName
            });
          }
        })
        .then(channel => {
          this.channel = channel;
          window.channel = channel;
          return this.channel.join();
        })
        .then(() => {
          this.channel.getMessages().then(this.messagesLoaded);
          this.channel.on('messageAdded', this.messageAdded);
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
    this.channel.sendMessage(message);
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
          <p>Logged in as {this.props.me}</p>
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


