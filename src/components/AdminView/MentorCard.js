import React from 'react'
import { Grid, Card, Button, Icon, Divider, Message } from 'semantic-ui-react'

export default class MentorCard extends React.Component {
    render() {
        const {name, college, location, memberSince, callsCompleted} = this.props;
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
                            {/* Mentor Name x Member Since */}
                            <Message>
                                {name} - member since: {memberSince}
                            </Message>
                        </Grid.Row>
                        <Grid.Row>
                            {/* College x Location */}
                            {college} - {location}
                        </Grid.Row>
                        <Grid.Row>
                            {/* Calls Completed */}
                            Calls Completed: {callsCompleted}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        {/* Approve Mentor OR Ping button (if already approved) */}
                        <Button/>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}