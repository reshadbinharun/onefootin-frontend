import React, { Component } from 'react';
import {Grid, Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
    }
    renderLoginStateInfo() {
        let loggedIn = this.props.loggedIn;
        // let refLink = loggedIn ? '/logout' : '/login'
        let style = {
            'padding-top': '50px'
        }
        return (
        <Grid.Column 
            width = {6}
            style = {style}
            >
            <Button class="ui button" onClick={this.props.logout}>{loggedIn ? 'Log Out' : 'Log In'}</Button>
        </Grid.Column>)
    }

    renderLogo() {
        // TODO: Fix broken logo render
        return (
            <img class="ui small image centered" src={require("./logo.png")} alt="logo"/>
        )
    }
    render () {
        return (
            <Grid columns={3}>
                <Grid.Column width = {5}>
                    <div></div>
                </Grid.Column>
                <Grid.Column width = {5}>
                    {this.renderLogo()}
                </Grid.Column>
                {this.props.loggedIn ? this.renderLoginStateInfo(): null}
            </Grid>
        )
    }
}