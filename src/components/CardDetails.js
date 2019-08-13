import React from 'react'
import { Card, Message } from 'semantic-ui-react'

//TODO: allow form that lets mentors edit their time preferences
export default class CardDetails extends React.Component {
    constructor(props) {
        console.log("props in Card Details", props);
        super(props);
        this.renderAboutMe = this.renderAboutMe.bind(this);
        this.getLanguages = this.getLanguages.bind(this);
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

    getLanguages(){
        let languages = this.props.languages;
        if (languages && languages.length > 1) {
            return 'I speak ' + languages.slice(0,-1).join(', ') + ' and '+ languages.slice(-1);
        } else {
            return `I speak ${languages[0]}`;
        }
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
                    {this.props.isMentor ? <Card.Meta>{this.getLanguages()}</Card.Meta> : null}
                    {this.renderAboutMe()}
                    <Card.Description>{name} has been a member since {memberSince}.</Card.Description>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}
