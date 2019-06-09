/* eslint-disable max-len */
import React from 'react'
import { Container } from 'semantic-ui-react'
import ConfirmedCallCard from './ConfirmedCallCard';

export default class ConfirmedCalls extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            requests: [],
        }
    }

    renderRequestCards(ScheduleObjects) {
        return ScheduleObjects.map(schedule => {
            return (
                <ConfirmedCallCard
                    //request object as prop
                />
            )
        })
    }

    render() {
        return (  
            <Container>
                {this.renderRequestCards(this.props.calls)}
            </Container>
          )
    }
}
