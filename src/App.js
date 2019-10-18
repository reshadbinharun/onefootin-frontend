import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/Header';
import NavBarMentor from './components/MentorView/NavBarMentor';
import NavBarMentee from "./components/NavBarMentee";
import NavBarAdmin from "./components/AdminView/NavBarAdmin";
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import LoginForm from "./components/LoginForm";
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import SignUpMentor from './components/SignUp/SignUpMentor';
import SignUpMentee from './components/SignUp/SignUpMentee';
import SignUpAdmin from './components/SignUp/SignUpAdmin';
import { MENTEE, MENTOR, ADMIN } from './magicString';

export const BACKEND = process.env.REACT_APP_BACKEND || 'https://one-foot-in-backend.herokuapp.com';

const compName = 'App_LS';

export const PATHS = {
  root: "/",
  signupMentor: "/signupMentor",
  signupMentee: "/signupMentee",
  signupAdmin: "/signupAdmin"
}

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      // isMentor: false,
      role: '',
      mentorPayload: {},
      menteePayload: {},
      loggedIn: false,
    };
    this.renderLogin = this.renderLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.liftPayload = this.liftPayload.bind(this);
    this.componentCleanup = this.componentCleanup.bind(this);
  }

  componentCleanup() {
    sessionStorage.setItem(compName, JSON.stringify(this.state));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.componentCleanup);
    const persistState = sessionStorage.getItem(compName);
    if (persistState) {
      try {
        this.setState(JSON.parse(persistState));
      } catch (e) {
        console.log("Could not get fetch state from local storage for", compName);
      }
    }
  }

  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup);
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

  liftPayload(payload, role) {
    switch(role) {
      case (MENTEE):
          this.setState({
            role: MENTEE,
            menteePayload: payload
          });
          break;
      case (MENTOR):
        this.setState({
          role: MENTOR,
          mentorPayload: payload
        })
        break;
      case (ADMIN):
        this.setState({
          role: ADMIN,
          adminPayload: payload
        })
        break;
      default:
        return;
    }
  }

  renderLogin() {
    // TODO: switch-case with 3 views for loggedInView
    let loggedInView = null;
    switch(this.state.role)
    {
      case(MENTEE):
        loggedInView = 
          <NavBarMentor
            payload = {this.state.mentorPayload}
          />
          break;
      case(MENTOR):
        loggedInView =
          <NavBarMentee
            payload = {this.state.menteePayload}
          />
        break;
      case(ADMIN):
        loggedInView =
          <NavBarAdmin
            payload = {this.state.adminPayload}
            />
        break;
      default:
        loggedInView = null;
    }
    let navigation =
    <Grid centered>
      <Router>
            <div>
              <Switch>
                <Route exact path={PATHS.root} render={(props) => 
                  <div>
                    <div>
                    <Grid centered rows={1}>
                      <Grid.Row left>
                        <Button.Group>
                        <Button
                        >
                          <Link to={PATHS.signupMentor}>
                            Sign up as Mentor
                          </Link>
                        </Button>
                        <Button
                        >
                          <Link to={PATHS.signupMentee}>
                            Sign up as Mentee
                          </Link>
                        </Button>
                        <Button
                        >
                          <Link to={PATHS.signupAdmin}>
                            Sign up as Admin
                          </Link>
                        </Button>
                        </Button.Group>
                      </Grid.Row>
                    </Grid>
                    </div>
                    <Divider/>
                    <LoginForm {...props}
                      login = {this.login}
                      liftPayload = {this.liftPayload}
                    />
                  </div>
                }/>
                <Route exact path={PATHS.signupMentor} render={() => 
                  <SignUpMentor />}/>
                <Route exact path={PATHS.signupMentee} render={() => 
                  <SignUpMentee /> }/>
                <Route exact path={PATHS.signupAdmin} render={() => 
                  <SignUpAdmin /> }/>
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
      </div>
    )
  }
}
