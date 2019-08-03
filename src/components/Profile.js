/* eslint-disable max-len */
import React from 'react'
import { Container, Grid, Divider } from 'semantic-ui-react'
import CardImage from './CardImage';
import CardDetails from './CardDetails';
import EditProfile from './EditProfile';
import PreferredTimeEditor from './PreferredTimesEditor';

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
        <Divider/>
        {this.state.isMentor ? 
        mentorButtonCollection : buttonCollection
        }
    </Grid.Column>
    <Grid.Column>
        <CardDetails
            name={this.props.name}
            school={this.props.school}
            memberSince={this.props.memberSince}
            aboutYourself={this.props.aboutYourself}
            position={this.props.isMentor ? this.props.position : null }
            isMentor={this.props.isMentor}
        />
    </Grid.Column>
</Grid>

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
    }

    goBack(e) {
        e.preventDefault();
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
        return (  
            <Container>
            {
                this.state.editMode ? (
                    this.state.timeSelect ?
                    <PreferredTimeEditor
                        mentorEmail={this.props.email}
                        goBack={this.goBack}
                    /> :
                    <EditProfile
                        email={this.props.email}
                        isMentor={this.props.isMentor}
                        name={this.props.name}
                        goBack={this.goBack}
                    />
                ) : profile
            }
            </Container>
          )
    }
}
