import React from 'react'
import { Grid, Card, Image } from 'semantic-ui-react'

export default class MentorSchoolCard extends React.Component {
    render() {
        const {name, image, college, position, memberSince, callsCompleted, location} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        let imageAspect = {
            'width': '200px',
            'height': '150px',
            'object-fit': 'cover'
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid columns={3}>
                    <Grid.Column width={4}>
                        <Image style={imageAspect} src={image} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card.Content>
                        <Card.Header>{name} (member since {memberSince}, completed {callsCompleted} calls)</Card.Header>
                        <Card.Description>
                            College: {college}
                        </Card.Description>
                        <Card.Description>
                            Position: {position}
                        </Card.Description>
                        <Card.Description>
                            Location: {location}
                        </Card.Description>
                        </Card.Content>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}