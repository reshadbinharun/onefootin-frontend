import React from 'react'
import { Card } from 'semantic-ui-react'
import TimeSlots from './TimeSlots'

export default class CardDetails extends React.Component {
    render() {
        let {name, school, memberSince, connections} = this.props;
        return (
            <div>
                <Card>
                    <Card.Content>
                    <Card.Header>{name}</Card.Header>
                    <Card.Meta>{school}</Card.Meta>
                    <Card.Meta>Connections: {connections}</Card.Meta>
                    <Card.Description>{name} has been a member since {memberSince}.</Card.Description>
                    </Card.Content>
                </Card>
                <Card>
                    <TimeSlots/>
                </Card>
            </div>
        );
    }
}
