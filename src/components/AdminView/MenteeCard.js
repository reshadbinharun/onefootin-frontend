import React from 'react'
import { Grid, Card, Button, Icon, Divider, Message } from 'semantic-ui-react'

export default class MenteeCard extends React.Component {
    render() {
        const {name, school, memberSince, location, callsRequested} = this.props;
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
                            {/* Mentee Name x Member Since */}
                            <Message>
                                {name} - member since: {memberSince}
                            </Message>
                        </Grid.Row>
                        <Grid.Row>
                            {/* School X Location */}
                            <Message>
                                {school} - {location}
                            </Message>
                        </Grid.Row>
                        <Grid.Row>
                            {/* Calls Requested */}
                            <Message>
                                Calls Requested: {callsRequested}
                            </Message>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        {/* Ping button */}
                        <Button/>
                        {/* Suspend button */}
                        <Button/>
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}