import React from 'react'
import { Card, Button } from 'semantic-ui-react'

export default class ScheduleCard extends React.Component {
    render() {
        const {time, topic, mentor} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Call with: {mentor}</Card.Header>
                    <Card.Meta>{time}</Card.Meta>
                    <Card.Description>
                    You are scheduled for 30 minutes to discuss {topic}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='dark orange'>
                        Cancel
                    </Button>
                    <Button basic color='yellow'>
                        Reschedule
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}