/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import SearchBar from './SearchBar';
import MentorNetworkCard from './MentorNetworkCard';
import { BACKEND, restoreState, storeState } from "../App";

const compName = 'MentorNetwork_LS';

export default class MentorNetwork extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mentors: [],
            searchMode: false,
            searchTerms: '',
        }
        this.updateSearchTerms = this.updateSearchTerms.bind(this);
    }

    componentDidMount(){
        // TODO: await on restore before making calls? Do not make calls if state is restored?
        restoreState(compName);
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
        storeState(compName);
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
                        <SearchBar
                            onSearchMode={this.updateSearchTerms}
                        />
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
