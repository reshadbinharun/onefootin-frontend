import React from 'react'
import { Grid, Card, Icon, Image } from 'semantic-ui-react'

export default class MentorCard extends React.Component {
    render() {
        const {name, image, school, connectionSince, company, country} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid columns={2}>
                    <Grid.Column width={4}>
                        <Image src={image} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>
                            <span className='date'>Joined in {connectionSince}</span>
                        </Card.Meta>
                        <Card.Description>
                            School: {school}
                        </Card.Description>
                        <Card.Description>
                            Company: {company}
                        </Card.Description>
                        <Card.Description>
                            Country: {country}
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='user'>
                            Go to Profile
                            </Icon>
                        </Card.Content>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}