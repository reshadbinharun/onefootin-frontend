import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import {Container, Message, Grid} from 'semantic-ui-react';
import Test from './components/connectTest';
import LoginForm from "./components/LoginForm";

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
      incorrectCredentials: false,
      testMode: false,
    };
    this.renderLogin = this.renderLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
    this.toggleTest = this.toggleTest.bind(this);
  }

  toggleTest(e) {
    e.preventDefault();
    this.setState({
      testMode: !this.state.testMode
    })
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
    let loggedInView =       
      <NavBar
        image={this.state.image}
        name={this.state.name}
        school={this.state.school}
        memberSince={this.state.memberSince}
        connections={this.state.connections}
        />
    let loginForm = 
      <LoginForm
        handleSubmit = {this.handleSubmit}
        handleChange = {this.handleChange}
        toggleTest = {this.toggleTest}
      />
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
        {this.state.testMode? <Test/> : null}
      </div>
    )
  }
}
