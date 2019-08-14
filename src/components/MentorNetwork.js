/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Dropdown, Button } from 'semantic-ui-react'
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
        this.viewProfile = this.viewProfile.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
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

    viewProfile(e, {value}) {
        e.preventDefault();
        let mentorToLift = this.state.mentors.find(mentor => {return mentor.id === value});
        this.props.viewMentorProfile(mentorToLift);
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    updateSearchTerms(e, searchObject) {
        let searchTerms = searchObject.value
        e.preventDefault();
        if (!searchTerms) {
            this.setState({
                searchMode: false,
            })
        } else {
            this.setState({
                searchTerms: searchTerms,
                searchMode: true
            })
        }
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

    clearSearch(e) {
        e.preventDefault();
        this.setState({
            searchMode: false,
            searchTerms: '',
            searchTopic: '',
        })
    }

    filterResults(MentorObjects) {
        // eslint-disable-next-line
        if (this.state.searchTerms) {
            return MentorObjects.filter(mentor => {
                let bagOfWords = this.getBagofWords(mentor);
                let searchTerms = this.state.searchTerms;
                for (let i = 0; i < bagOfWords.length; i++) {
                    if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                        return true;
                    }
                }
            })
        } else if (this.state.searchTopic) {
            return MentorObjects.filter(mentor => {console.log(mentor); return mentor.preferredTopics.includes(this.state.searchTopic)})
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
                    viewProfile={this.viewProfile}
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
                        <Divider/>
                        <Grid.Row>
                            <Button onClick={this.clearSearch}>
                                Clear Search
                            </Button>
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
