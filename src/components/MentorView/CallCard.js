import React from 'react'
import { Card, Button } from 'semantic-ui-react'

export default class CallCard extends React.Component {
    render() {
        // const {menteeName, menteeSchool, menteeLocation, topic} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            // TODO: update after updating getAllRequests on backend
            // TODO: update confirm/dismiss with backend calls
            <Card style={cardStyle}>
                <Card.Content>
                    {/* <Card.Header>Request from {menteeName}</Card.Header> */}
                    <Card.Header>Request from Reshad</Card.Header>
                    <Card.Meta>Topic {this.props.topic}</Card.Meta>
                    {/* <Card.Description>
                        {menteeName} attends {menteeSchool} and is from {menteeLocation}
                    </Card.Description> */}
                    <Card.Description>
                        Reshad attends Tufts and is from Bangladesh
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='dark orange'>
                        Confirm
                    </Button>
                    <Button basic color='yellow'>
                        Dismiss
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}