/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Dropdown } from 'semantic-ui-react'
import SearchBar from './SearchBar';
import MentorNetworkCard from './MentorNetworkCard';
import { BACKEND } from "../App";
import { PREFERRED_TOPICS } from "./SignUp/SignUpMentor";
let preferredTopicsOptions = PREFERRED_TOPICS.map(val => {
    return {key: val, text: val, value: val}
});

const compName = 'MentorNetwork_LS';

export default class MentorNetwork extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mentors: [],
            searchMode: false,
            searchTerms: '',
            searchTopic: '',
        }
        this.updateSearchTerms = this.updateSearchTerms.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.handleChangeTopic = this.handleChangeTopic.bind(this);
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
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/getAllMentors`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                mentors: resolvedRes && resolvedRes.mentors
            });
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    updateSearchTerms(e, searchObject) {
        let searchTerms = searchObject.value
        e.preventDefault();
        this.setState({
            searchTerms: searchTerms,
            searchMode: true
        })
    }

    getBagofWords(mentor) {
        return [mentor.name, mentor.school, mentor.position, mentor.location];
    }

    handleChangeTopic(e, {value}) {
        e.preventDefault();
        this.setState({
            searchTopic: value,
            searchMode: true
        })
    }

    filterResults(MentorObjects) {
        // eslint-disable-next-line
        if (!this.state.searchTerms) {
            return MentorObjects.filter(mentor => {
                let bagOfWords = this.getBagofWords(mentor);
                let searchTerms = this.state.searchTerms;
                for (let i = 0; i < bagOfWords.length; i++) {
                    if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                        return true;
                    }
                }
            })
        } else {
            return MentorObjects.filter(mentor => {return mentor.preferredTopics.includes(this.state.searchTopic)})
                .filter(mentorByTopic => {
                    let bagOfWords = this.getBagofWords(mentorByTopic);
                    let searchTerms = this.state.searchTerms;
                    for (let i = 0; i < bagOfWords.length; i++) {
                        if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                            return true;
                        }
                    }
                })
        }
    }

    renderUserCards(MentorObjects) {
        return MentorObjects.map(mentor => {
            return (
                <MentorNetworkCard
                    id={mentor.id}
                    name={mentor.name}
                    school={mentor.school}
                    position={mentor.position}
                    location={mentor.location}
                    image={mentor.image}
                    pickMentor={this.props.pickMentor}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Grid columns={2}>
                    <Grid.Column width={10}>
                        There as {this.state.mentors.length} Mentors currently in network.
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Grid.Row>
                            <SearchBar
                                onSearchMode={this.updateSearchTerms}
                            />
                        </Grid.Row>
                        <Divider/>
                        <Grid.Row>
                            <Dropdown placeholder='Search by topic' fluid selection options={preferredTopicsOptions} onChange={this.handleChangeTopic} name="searchTopic"/>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
                <Container>
                    {this.state.searchMode ? 
                    this.renderUserCards(this.filterResults(this.state.mentors)) : this.renderUserCards(this.state.mentors)}
                </Container>
            </Container>
        )
    }
}
