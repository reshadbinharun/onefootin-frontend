import React from 'react'
import { Grid, Card, Button, Icon, Divider, Message } from 'semantic-ui-react'
import { adminRowPaddingStyle, adminCardStyleYellow, adminContentOrangeStyle, adminContentYellowStyle } from "../../inlineStyles"

export default class RequestCard extends React.Component {
    render() {
        const {menteeNameSchool, mentorNameCollege, topic, status, feedback, menteeIntro} = this.props;

        return (
            <Card centered={true} style={adminCardStyleYellow}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            {/* Mentee Name x Mentor Name x Topic x Mentor Time */}
                            <Message style={adminContentYellowStyle}>
                                <strong>{mentorNameCollege}</strong> mentoring <strong>{menteeNameSchool}</strong> about <strong>{topic}</strong>
                            </Message>
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            <Message style={adminContentOrangeStyle}>
                                Status: <strong>{status}</strong>
                            </Message>
                            {/* Logic to determine status */}
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            {/* Feedback (if any) */}
                            {feedback? 
                            <div>
                                <Message.Header>
                                    <strong>Feedback</strong>
                                </Message.Header>
                                <Message style={adminContentYellowStyle}>
                                    " {feedback} "
                                </Message>
                            </div>
                             : null}
                        </Grid.Row>
                        <Grid.Row style = {adminRowPaddingStyle}>
                            <div>
                                <Message.Header>
                                    <strong>Mentee's Introduction</strong>
                                </Message.Header>
                                <Message style={adminContentOrangeStyle}>
                                    {menteeIntro}
                                </Message>
                            </div>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Button>
                            Ping participants!
                        </Button>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}