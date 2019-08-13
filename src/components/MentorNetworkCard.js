import React from 'react'
import { Grid, Card, Image, Button, Icon, Divider } from 'semantic-ui-react'

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
            'height': '150px',
            // TODO: add image property
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
                        <Divider/>
                        <Grid.Row>
                            <Button  class="ui button" value={id} onClick={(this.props.viewProfile)}>
                                <Icon name='user' />
                                Go to Profile
                            </Button>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}