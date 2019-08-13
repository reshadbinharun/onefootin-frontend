import React from 'react'
import { Grid, Card, Image, Button } from 'semantic-ui-react'

export default class MentorNetworkCard extends React.Component {
    render() {
        const {id, name, image, school, position, location} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        let imageAspect = {
            'width': '200px',
            'height': '150px'
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid columns={3}>
                    <Grid.Column width={4}>
                        <Image style={imageAspect} src={image} />
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        {/* <Card.Meta>
                            <span className='date'>Joined in {connectionSince}</span>
                        </Card.Meta> */}
                        <Card.Description>
                            School: {school}
                        </Card.Description>
                        <Card.Description>
                            Position: {position}
                        </Card.Description>
                        <Card.Description>
                            Location: {location}
                        </Card.Description>
                        </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Grid.Row>
                            <Button onClick={() => this.props.pickMentor(id)} class="ui button">Book!</Button>
                        </Grid.Row>
                        <Grid.Row>
                        </Grid.Row>
                        <Grid.Row>
                        <Card.Content extra>
                            <Icon name='user' onClick={() => this.props.viewProfile(id)}>
                            Go to Profile
                            </Icon>
                        </Card.Content>
                            {/* <Button  class="ui button">View Profile</Button> */}
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}