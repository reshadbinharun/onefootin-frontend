/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import SearchBar from './SearchBar';
import MentorNetworkCard from './MentorNetworkCard';

//sample connection data, remove when back-end finished
const mentors = [
    {name: 'Md Reshad Bin Harun',
    school: 'Tufts University',
    connectionSince: 'May 2016',
    company: 'Stratasys',
    country: 'Bangladesh',
    image: 'images/sample.png'},
    {name: 'Mir Faiyaz',
    school: 'Dartmouth',
    connectionSince: 'May 2018',
    company: 'Altman Vilandrie',
    country: 'Bangladesh',
    image: 'images/mir.png'},
    {name: 'Anindya Kumar Guha',
    school: 'Colgate',
    connectionSince: 'Dec 2016',
    company: 'Amazon',
    country: 'Bangladesh',
    image: 'images/anindya.png'},
    {name: 'Rakin Muhtahi',
    country: 'Bangladesh',
    school: 'Amherst',
    connectionSince: 'Apr 2017',
    company: 'New York University School of Medicine',
    image: 'images/rakin.png'},
    {name: 'Roza Ogurlu',
    school: 'Tufts',
    connectionSince: 'May 2017',
    company: 'Boston Children\'s Hospital',
    country: 'Turkey',
    image: 'images/roza.png'},
]
export default class MentorNetwork extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchMode: false,
            searchTerms: '',
        }
        this.updateSearchTerms = this.updateSearchTerms.bind(this);
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
        return [mentor.name, mentor.school, mentor.connectionSince, mentor.company, mentor.country];
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
                name={mentor.name}
                school={mentor.school}
                connectionSince={mentor.connectionSince}
                company={mentor.company}
                country={mentor.country}
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
                        There as {mentors.length} Mentors currently in network.
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <SearchBar
                            onSearchMode={this.updateSearchTerms}
                        />
                    </Grid.Column>
                </Grid>
                <Container>
                    {this.state.searchMode ? 
                    this.renderUserCards(this.filterResults(mentors)) : this.renderUserCards(mentors)}
                </Container>
            </Container>
          )
    }
}
