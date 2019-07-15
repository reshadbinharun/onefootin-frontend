import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './components/Header';
import NavBarMentor from './components/MentorView/NavBarMentor';
import NavBarMentee from "./components/NavBarMentee";
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import LoginForm from "./components/LoginForm";
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import SignUpMentor from './components/SignUp/SignUpMentor';
import SignUpMentee from './components/SignUp/SignUpMentee';

export const BACKEND = process.env.BACKEND || 'https://onefootin-dev.herokuapp.com';

export const PATHS = {
 root: "/",
 signupMentor: "/signupMentor",
 signupMentee: "/signupMentee",
 mentor: "/mentor",
 mentee: "/mentee"
}

export default class App extends Component {
 constructor(){
   super();
   this.state = {
     isMentor: false,
     mentorPayload: {},
     menteePayload: {},
     loggedIn: false,
   };
   this.renderLogin = this.renderLogin.bind(this);
   this.logout = this.logout.bind(this);
   this.login = this.login.bind(this);
   this.toggleTest = this.toggleTest.bind(this);
   this.liftPayload = this.liftPayload.bind(this);
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

 renderLogin() {
   let signUpButtons =
   <div>
     <div>
       <Grid centered rows={1}>
         <Grid.Row left>
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
         </Grid.Row>
       </Grid>
     </div>
     <Divider/>
   </div>
   return (
<Grid centered>
 <Router>
 <Switch>
     <Route exact path={PATHS.root} render={(props) =>
       this.state.loggedIn ?
        this.state.isMentor ? <Redirect to={PATHS.mentor}/> : <Redirect to={PATHS.mentee}/>
       :
        <div>
          {signUpButtons}
          <LoginForm {...props}
            toggleTest = {this.toggleTest}
            login = {this.login}
            liftPayload = {this.liftPayload}
          />
        </div>
     }/>
     <Route exact path={PATHS.signupMentor} render={() =>
       <SignUpMentor />}/>
     <Route exact path={PATHS.signupMentee} render={() =>
       <SignUpMentee />}/>
     <Route exact path={PATHS.mentor} render={() =>
       <NavBarMentor
         payload = {this.state.mentorPayload}
       />
       }
      />
    <Route exact path={PATHS.mentee} render={() =>
       <NavBarMentee
         payload = {this.state.menteePayload}
       />
       }
      />
   </Switch>
 </Router>
 </Grid>
 )}

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
