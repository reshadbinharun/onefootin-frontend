/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import CardImage from './CardImage';
import CardDetails from './CardDetails';

export default class Profile extends React.Component {
    // TODO: Add a property to show requests serviced
    render() {
        return (  
            <Container>
                <Grid columns={2}>
                    <Grid.Column>
                        <CardImage
                        name = {this.props.name}
                        // TODO: Add image after storing in database
                        image = {this.props.image}
                        />
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
            </Container>
          )
    }
}
