// TODO: Deprecated, remove
import React from 'react'
import { Card, Button } from 'semantic-ui-react'

export default class CallCard extends React.Component {
    render() {
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            // TODO: if mentee info available on confirmedRequests field of mentor, update
            // TODO: update reschedule/cancel with backend calls
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Mentee Reshad</Card.Header>
                    <Card.Meta>Topic</Card.Meta>
                    <Card.Description>
                        Mentee School
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='dark orange'>
                        Reschedule
                    </Button>
                    <Button basic color='yellow'>
                        Cancel
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}