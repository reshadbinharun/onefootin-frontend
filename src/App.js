import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/Header';
import NavBarMentor from './components/MentorView/NavBarMentor';
import NavBarMentee from "./components/NavBarMentee";
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
// import Test from './components/connectTest';
import LoginForm from "./components/LoginForm";
import { Route, BrowserRouter as Router, Link, Switch, Redirect } from 'react-router-dom'
import SignUpMentor from './components/SignUp/SignUpMentor';
import SignUpMentee from './components/SignUp/SignUpMentee';

export const BACKEND = process.env.BACKEND || 'https://one-foot-in-backend.herokuapp.com' || 'http://localhost:8080';

const PATHS = {
  root: "/",
  signupMentor: "/signupMentor",
  signupMentee: "/signupMentee",
}

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      isMentor: false,
      mentorPayload: {},
      menteePayload: {},
      loggedIn: false,
      testMode: false,
      menteeSignUpDone: false,
      mentorSignUpDone: false,
    };
    this.renderLogin = this.renderLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.toggleTest = this.toggleTest.bind(this);
    this.liftPayload = this.liftPayload.bind(this);
    this.handleMenteeSignUp = this.handleMenteeSignUp.bind(this);
    this.handleMentorSignUp = this.handleMentorSignUp.bind(this);
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
      loggedIn: false
    })
  }

  login(){
    this.setState({
      loggedIn: true
    })
  }

  liftPayload(payload, isMentor) {
    if (isMentor) {
      this.setState({
        isMentor: true,
        mentorPayload: payload
      })
    } else {
      this.setState({
        isMentor: false,
        menteePayload: payload
      })
    }
  }

  handleMenteeSignUp() {
    this.setState({
      menteeSignUpDone: true,
    })
  }

  handleMentorSignUp() {
    this.setState({
      mentorSignUpDone: true,
    })
  }

  renderLogin() {
    let loggedInView =
      this.state.isMentor ? 
        <NavBarMentor
          payload = {this.state.mentorPayload}
        /> : 
        <NavBarMentee
          payload = {this.state.menteePayload}
        />
    let navigation =
    <Grid centered>
      <Router>
            <div>
              <div>
              <Grid centered rows={1}>
                <Grid.Row left>
                  <Button>
                    <Link to={PATHS.signupMentor}>
                      Sign up as Mentor
                    </Link>
                  </Button>
                  <Button>
                    <Link to={PATHS.signupMentee}>
                      Sign up as Mentee
                    </Link>
                  </Button>
                </Grid.Row>
              </Grid>
              </div>
              <Divider/>
              
              <Switch>
                <Route exact path={PATHS.root} render={(props) => 
                  <LoginForm {...props} 
                    toggleTest = {this.toggleTest}
                    login = {this.login}
                    liftPayload = {this.liftPayload}
                  /> 
                }/>
                <Route exact path={PATHS.signupMentor} render={() => (this.state.mentorSignUpDone ? 
                  <Redirect to={PATHS.root}/> : 
                  <SignUpMentor handleSignUp={this.handleMentorSignUp}/> )}/>
                <Route exact path={PATHS.signupMentee} render={() => (this.state.menteeSignUpDone ? 
                  <Redirect to={PATHS.root}/> : 
                  <SignUpMentee handleSignUp={this.handleMenteeSignUp}/> )}/>/>
              </Switch>
              
            </div>
          </Router>
    </Grid>
    
    return this.state.loggedIn ? loggedInView : navigation;
  }

  render() {
    return (
      <div>
        <Header
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          />
        <Container>{this.renderLogin()}</Container>
        {/* {this.state.testMode? <Test/> : null} */}
      </div>
    )
  }
}
