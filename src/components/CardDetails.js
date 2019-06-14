import React from 'react'
import { Card } from 'semantic-ui-react'

//TODO: allow form that lets mentors edit their time preferences
export default class CardDetails extends React.Component {
    render() {
        let {name, school, memberSince} = this.props;
        return (
            <div>
                <Card>
                    <Card.Content>
                    <Card.Header>{name}</Card.Header>
                    <Card.Meta>{school}</Card.Meta>
                    <Card.Description>{name} has been a member since {memberSince}.</Card.Description>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}
