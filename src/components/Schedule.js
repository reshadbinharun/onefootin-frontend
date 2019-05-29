/* eslint-disable max-len */
import React from 'react'
import { Container, Button, Segment, Icon } from 'semantic-ui-react'
import ScheduleCard from './ScheduleCard';

// topics will be selected from a limited selection
// mentors will be linked by mentor Id
// time format --> hh:mmAM - Day - GMT+00
//sample connection data, remove when back-end finished
const StockSchedules = [
    {id: 1,
    time: '12:00PM - Saturday - GMT-6',
    topic: 'General Consulting',
    mentor: 'Mir Faiyaz'},
    {id: 2,
    time: '1:00PM - Sunday - GMT-6',
    topic: 'Essay Brainstorming',
    mentor: 'Reshad Bin Harun'},
    {id: 3,
    time: '4:00PM - Friday - GMT-6',
    topic: 'College Shortlisting',
    mentor: 'Rakin Muhtadi'},
]
export default class Schedule extends React.Component {
    static LastScheduleId = 3; //increment everytime a new schedule is added
    constructor(props){
        super(props);
        this.state = {
            schedules: StockSchedules,
        }
    }

    renderScheduleCards(ScheduleObjects) {
        return ScheduleObjects.map(schedule => {
            return (
                <ScheduleCard
                time={schedule.time}
                topic={schedule.topic}
                mentor={schedule.mentor}
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                <Container>
                    <Segment attached='top'>
                        Schedule a New Call
                    </Segment>
                    <Button attached='bottom' animated='vertical' onClick={this.props.getForm}>
                        <Button.Content hidden>Schedule!</Button.Content>
                        <Button.Content visible>
                            <Icon name='calendar alternate outline' />
                        </Button.Content>
                    </Button>
                </Container>
                <Container>
                    {this.renderScheduleCards(StockSchedules)}
                </Container>
            </Container>
          )
    }
}
