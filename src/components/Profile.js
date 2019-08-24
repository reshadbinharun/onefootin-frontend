/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider, Icon, Button } from 'semantic-ui-react'
import CardImage from './CardImage';
import CardDetails from './CardDetails';
import EditProfile from './EditProfile';
import PreferredTimeEditor from './PreferredTimesEditor';

const compName = 'Profile_LS';

export default class Profile extends React.Component {
    // TODO: Add a property to show requests serviced
    // props isMentor, email
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            timeSelect: false,
        }
        this.goBack = this.goBack.bind(this);
        this.launchEditMode = this.launchEditMode.bind(this);
        this.launchTimeSelector = this.launchTimeSelector.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
        const persistState = sessionStorage.getItem(compName);
        // only read from cached state if on same mentor's profile
        if (persistState) {
            try {
                this.setState(JSON.parse(persistState));
                // set state but overwrite with API call
            } catch (e) {
                console.log("Could not get fetch state from local storage for", compName);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.isMentor) {
            this.componentCleanup();
            window.removeEventListener('beforeunload', this.componentCleanup);
        }
    }

    goBack() {
        this.setState({
            editMode : false,
            timeSelect: false,
        })
    }

    launchEditMode(e) {
        e.preventDefault();
        this.setState({
            editMode : true
        })
    }

    launchTimeSelector(e) {
        e.preventDefault();
        this.setState({
            timeSelect: true,
            editMode: true,
        })
    }
    render() {
        let buttonCollection = 
        <Button onClick={(e) => this.launchEditMode(e)}>
            <Icon name="edit"/>
                Edit Profile
        </Button>

        let mentorButtonCollection = 
        <Grid columns={2}>
            <Grid.Column>
                {buttonCollection}
            </Grid.Column>
            <Grid.Column>
                <Button onClick={(e) => this.launchTimeSelector(e)}>
                    <Icon name="calendar"/>
                        Change Time Preferences
                </Button>
            </Grid.Column>
        </Grid>
        let profile = 
        <Grid columns={2}>
            <Grid.Column>
                <CardImage
                name = {this.props.name}
                image = {this.props.image}
                />
                {this.props.viewMode ? null :
                this.props.isMentor ? 
                    mentorButtonCollection : buttonCollection
                }
                <Divider/>
                {this.props.viewMode ? 
                <Button onClick={(e) => this.props.goBackToMentorNetwork(e)}>
                    <Icon name="backward"/>
                    Back to network
                </Button>
                : null}
            </Grid.Column>
            <Grid.Column>
                <CardDetails
                    name={this.props.name}
                    school={this.props.school}
                    memberSince={this.props.memberSince}
                    aboutYourself={this.props.aboutYourself}
                    position={this.props.isMentor ? this.props.position : null }
                    isMentor={this.props.isMentor}
                    languages={this.props.languages}
                    mentorIdForStats={this.props.id}
                />
            </Grid.Column>
        </Grid>
        return (  
            <Container>
            {
                this.state.editMode ? (
                    this.state.timeSelect ?
                    <PreferredTimeEditor
                        mentorEmail={this.props.email}
                        goBack={this.goBack}
                        timeZone={this.props.timeZone}
                    /> :
                    <EditProfile
                        email={this.props.email}
                        isMentor={this.props.isMentor}
                        name={this.props.name}
                        goBack={this.goBack}
                        // props to populate values for edit form
                        school={this.props.school}
                        location={this.props.location}
                        aboutYourself={this.props.aboutYourself}
                        // mentors only
                        position={this.props.position}
                        major={this.props.major}
                        zoom_info={this.props.zoom_info}
                    />
                ) : profile
            }
            </Container>
          )
    }
}
