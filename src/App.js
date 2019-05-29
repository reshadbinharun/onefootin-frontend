import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import {Container, Form, Button, Icon, Message, Grid} from 'semantic-ui-react';

const CORRECT_EMAILS = ['reshad@ofi.com', 'mir@ofi.com']
const CORRECT_PASSWORD = 'password'

const IMAGE_MAP = [
  {
    email: "reshad@ofi.com",
    name: "Md Reshad Bin Harun",
    image: "images/reshad.png",
    school: "Tufts",
    memberSince: "Feb 4, 2014",
    connections: "20"
  },
  {
    email: "mir@ofi.com",
    name: "Mir Faiyaz",
    image: "images/mir.png",
    school: "Dartmouth",
    memberSince: "May 4, 2018",
    connections: "21"
  }
]


export default class App extends Component {
  constructor(){
    super();
    this.state = {
      name: 'Md Reshad Bin Harun',
      email: '',
      password: '',
      school: 'Tufts',
      memberSince: 'Feb 4, 2014',
      image: '',
      connections: 20,
      loggedIn: false,
      incorrectCredentials: false
    };
    this.renderLogin = this.renderLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
    this.handleBackEndClick = this.handleBackEndClick.bind(this);
  }

  handleBackEndClick(e){
    console.log("button clicked!")
    e.preventDefault();
    // fetch('http://localhost:8080/newMentee', {
    //   method: 'post',
    //   headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({
    //     name: "Reshad",
    //     email: "reshadbinharun@gmail.com",
    //     password: "password",
    //     school: "Tufts",
    //     timeZone: "GMT+4",
    //     location: "Dhaka"
    //   })
    //  }).then(res => {
    //    console.log("received response",res.json())
    //  });

    // var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // fetch('http://localhost:8080/getAllMentees', {
    //   method: 'get',
    //   credentials: 'include',
    //   headers: headers,
    // }).then(res => {
    //    console.log("received response",res.json())
    // });

    // fetch('http://localhost:8080/testJwt').then(res => {
    //    console.log("received response",res)
    // });

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Allow-Origin', 'localhost')
    fetch('http://localhost:8080/menteeLogin', {
      method: 'post',
      credentials: 'include',
      headers: headers,
      body: JSON.stringify({
        email: "reshadbinharun@gmail.com",
        password: "password",
      })
    }).then(async res => {
      let resolvedRes = await res.json()
      console.log("received jwt", resolvedRes);
      console.log("cookies are", document.cookie)
     });

    // fetch('http://localhost:8080/login', {
    //   method: 'post',
    //   headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({
    //     email: "reshadbinharun@gmail.com",
    //     password: "password",
    //   })
    // }).then(async res => {
    //   let resolvedRes = await res.json()
    //   console.log("received response", resolvedRes);
    //   window.sessionStorage.token = resolvedRes.token;
    //   console.log("session storage is", window.sessionStorage)
    //  });
  }

  logout(e){
    e.preventDefault();
    this.setState({
      loggedIn: !this.state.loggedIn
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    if (CORRECT_EMAILS.includes(this.state.email) && this.state.password === CORRECT_PASSWORD) {
      let signedInUserData = IMAGE_MAP.filter(user => user.email === this.state.email);
      console.log(signedInUserData);
      this.setState({
        loggedIn: true,
        incorrectCredentials: false,
        image: signedInUserData[0].image,
        name: signedInUserData[0].name,
        school: signedInUserData[0].school,
        memberSince: signedInUserData[0].memberSince,
        connections: signedInUserData[0].connections,
      })
    } else {
      this.setState({
        incorrectCredentials: true,
      })
    }
  }

  handleChange(e) {
    e.preventDefault();
    let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
  }

  renderIncorrectCredentialsMessage() {
    let messageStyle = {
      width: '80%',
      margin: '10px'
    }
    return this.state.incorrectCredentials ?
    <Grid centered>
      <Message
      error
      content="Your sign in credentials are incorrect."
      style = {messageStyle}
    />
    </Grid>
    : null
  }

  renderLogin() {
    let fieldStyle = {
      width: '100%',
    }
    let messageStyle = {
      padding: '20px',
      margin: '10px',
    }
    let loggedInView =       
      <NavBar
        image={this.state.image}
        name={this.state.name}
        school={this.state.school}
        memberSince={this.state.memberSince}
        connections={this.state.connections}
        />
    let loginForm =
      <div>
      <Message
        style= {messageStyle}
        attached
        centered
        header="We've been there. We'll take you there."
        content='Please sign in.'
      />
        <Grid>
          <Grid.Row centered>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field
              type="email"
              required="true"
              style={fieldStyle}
            >
                <label>Email</label>
                <input placeholder='Email' name="email" onChange={this.handleChange} />
              </Form.Field>
              <Form.Field
                type="password"
                required="true"
                style={fieldStyle}
              >
                <label>Password</label>
                <input placeholder='***' name="password" onChange={this.handleChange} />
              </Form.Field>
              <Button 
                color="blue" 
                type='submit'>
                <Icon name="unlock"/>
                Submit
              </Button>
            </Form>
          </Grid.Row>
          <Button onClick={this.handleBackEndClick}>Test Server Connection</Button>
        </Grid>
        
    </div>
    return this.state.loggedIn ? loggedInView : loginForm;
  }

  render() {
    return (
      <div>
        <Header 
          name={this.state.name} 
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          />
          {this.renderIncorrectCredentialsMessage()}
        <Container>{this.renderLogin()}</Container>
      </div>
    )
  }
}
