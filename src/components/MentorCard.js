// DEPRECATED FILE, not used anywhere
import React from 'react'
import { Grid, Card, Image } from 'semantic-ui-react'

export default class MentorCard extends React.Component {
    render() {
        //TODO: Include link to mentor profile page
        const {name, school, position, location, image} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid columns={2}>
                    <Grid.Column width={4}>
                        <Image size='medium' style={{'object-fit': 'cover'}} src={image} />
                    </Grid.Column>
                    <Grid.Column width={12}>
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
                        {/* <Card.Content extra>
                            <Icon name='user'>
                            Go to Profile
                            </Icon>
                        </Card.Content> */}
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}