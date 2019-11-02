/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Button } from 'semantic-ui-react'
import SearchBar from '../SearchBar';
import { BACKEND } from "../../App";
import MenteeCard from './MenteeCard';

const compName = 'Dashboard_LS';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount(){
        window.addEventListener('beforeunload', this.componentCleanup);
        // TODO: await on restore before making calls? Do not make calls if state is restored?
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

    clearSearch(e) {
        e.preventDefault();
        this.setState({
            searchMode: false,
            searchTerms: '',
        })
    }

    render() {
        return (  
            <Container>
                This is the Dashboard
            </Container>
        )
    }
}
