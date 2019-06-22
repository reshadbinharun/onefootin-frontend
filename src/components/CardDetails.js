import React from 'react'
import { Card, Message } from 'semantic-ui-react'

//TODO: allow form that lets mentors edit their time preferences
export default class CardDetails extends React.Component {
    constructor(props) {
        super(props);
        this.renderAboutMe = this.renderAboutMe.bind(this);
    }

    renderAboutMe() {
        return (
            <Message
                icon='paper plane'
                header={`About ${this.props.name}...`}
                content={this.props.aboutYourself}
            />
        )
    }

    render() {
        let {name, school, memberSince} = this.props;
        return (
            <div>
                <Card>
                    <Card.Content>
                    <Card.Header>{name}</Card.Header>
                    <Card.Meta>{school}</Card.Meta>
                    {this.props.isMentor ? <Card.Meta>{this.props.position}</Card.Meta> : null}
                    {this.renderAboutMe()}
                    <Card.Description>{name} has been a member since {memberSince}.</Card.Description>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}
