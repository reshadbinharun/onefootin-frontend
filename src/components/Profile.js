/* eslint-disable max-len */
import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import CardImage from './CardImage';
import CardDetails from './CardDetails';

export default class Profile extends React.Component {
    render() {
        return (  
            <Container>
                <Grid columns={2}>
                    <Grid.Column>
                        <CardImage
                        name = {this.props.name}
                        image = {this.props.image}/>
                    </Grid.Column>
                    <Grid.Column>
                        <CardDetails
                            name={this.props.name}
                            school={this.props.school}
                            memberSince={this.props.memberSince}
                            connections={this.props.connections}
                        />
                    </Grid.Column>
                </Grid>
            </Container>
          )
    }
}
