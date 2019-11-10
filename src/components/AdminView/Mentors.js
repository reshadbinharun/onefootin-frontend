/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Button } from 'semantic-ui-react'
import SearchBar from '../SearchBar';
import { BACKEND } from "../../App";
import MentorCard from './MentorCard';

const compName = 'Mentors_LS';

export default class Mentors extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mentors: [],
            searchMode: false,
            searchTerms: '',
        }
        this.updateSearchTerms = this.updateSearchTerms.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
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
        fetch(`${BACKEND}/getAllMentorsByAdmin`, {
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
        if (!searchTerms) {
            this.setState({
                searchMode: false,
                searchTerms: searchTerms,
            })
        } else {
            this.setState({
                searchTerms: searchTerms,
                searchMode: true
            })
        }
    }

    getBagofWords(mentor) {
        return [mentor.name || '', mentor.college || '', mentor.location || ''];
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
        return MentorObjects.filter(mentor => {
            let bagOfWords = this.getBagofWords(mentor);
            let searchTerms = this.state.searchTerms;
            for (let i = 0; i < bagOfWords.length; i++) {
                if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                    return true;
                }
            }
        })
    }

    renderUserCards(MentorObjects) {
        return MentorObjects.map(mentor => {
            return (
                <MentorCard
                    name={mentor.name}
                    college={mentor.college}
                    location={mentor.location}
                    memberSince={mentor.memberSince}
                    callsCompleted={mentor.callsCompleted}
                    approved={mentor.approved}
                    email={mentor.email}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Grid columns={1}>
                    <Grid.Column width={10}>
                        There as {this.state.mentors.length} Mentors currently in network.
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Grid.Row>
                            <SearchBar
                                onSearchMode={this.updateSearchTerms}
                                searchValue={this.state.searchTerms}
                            />
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
