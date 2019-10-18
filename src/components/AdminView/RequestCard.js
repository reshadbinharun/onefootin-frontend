import React from 'react'
import { Grid, Card, Button, Icon, Divider, Message } from 'semantic-ui-react'

export default class RequestCard extends React.Component {
    render() {
        const {menteeNameSchool, mentorNameCollege, topic, status, feedback, menteeIntro} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        <Grid.Row>
                            {/* Mentee Name x Mentor Name x Topic x Mentor Time */}
                            <Message>
                                Mentee: {menteeNameSchool} X Mentor: {mentorNameCollege} - Topic: {topic}
                            </Message>
                        </Grid.Row>
                        <Grid.Row>
                            <Message>
                                Status: {status}
                            </Message>
                            {/* Logic to determine status */}
                        </Grid.Row>
                        <Grid.Row>
                            {/* Feedback (if any) */}
                            {feedback? 
                            <div>
                                <Message.Header>
                                    Feedback
                                </Message.Header>
                                <Message>
                                    {feedback}
                                </Message>
                            </div>
                             : null}
                        </Grid.Row>
                        <Grid.Row>
                            {/* Mentee Intro (if any) */}
                            {menteeIntro? 
                            <div>
                                <Message.Header>
                                    Mentee's Introduction
                                </Message.Header>
                                <Message>
                                    {menteeIntro}
                                </Message>
                            </div>
                             : null}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        {/* Ping button */}
                        <Button/>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}