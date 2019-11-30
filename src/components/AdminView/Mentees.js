/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Button } from 'semantic-ui-react'
import SearchBar from '../SearchBar';
import { BACKEND } from "../../App";
import MenteeCard from './MenteeCard';

const compName = 'Mentees_LS';

export default class Mentees extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mentees: [],
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
        fetch(`${BACKEND}/getAllMenteesByAdmin`, {
            method: 'get',
            credentials: 'include',
            headers: headers,
        }).then(async res => {
            let resolvedRes = await res;
            resolvedRes = await resolvedRes.json()
            this.setState({
                mentees: resolvedRes && resolvedRes.mentees
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

    getBagofWords(mentee) {
        return [mentee.name || '', mentee.school || '', mentee.location || ''];
    }

    clearSearch(e) {
        e.preventDefault();
        this.setState({
            searchMode: false,
            searchTerms: '',
        })
    }

    filterResults(MenteeObjects) {
        // eslint-disable-next-line
        return MenteeObjects.filter(mentee => {
            let bagOfWords = this.getBagofWords(mentee);
            let searchTerms = this.state.searchTerms;
            for (let i = 0; i < bagOfWords.length; i++) {
                if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                    return true;
                }
            }
        })
    }

    renderUserCards(MenteeObjects) {
        return MenteeObjects.map(mentee => {
            return (
                <MenteeCard
                    email={mentee.email}
                    name={mentee.name}
                    school={mentee.school}
                    memberSince={mentee.memberSince}
                    location={mentee.location}
                    callsRequested={mentee.callsRequested}
                    suspensionStatus={mentee.suspended}
                    menteeId={mentee.id}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Grid columns={1}>
                    <Grid.Column width={10}>
                        There as {this.state.mentees.length} Mentees currently in network.
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
                    this.renderUserCards(this.filterResults(this.state.mentees)) : this.renderUserCards(this.state.mentees)}
                </Container>
            </Container>
        )
    }
}
