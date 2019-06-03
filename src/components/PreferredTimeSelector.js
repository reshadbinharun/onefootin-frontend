import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Button, Dropdown, Divider, Message, Container, Header } from 'semantic-ui-react';

//time choices
const PREFERRED_TIMES_SLOTS = ['6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'];
let preferredTimesSlots = PREFERRED_TIMES_SLOTS.map( val => {
    return {key: val, text: val, value: val}
})

// function getTimeSlots(day, preferredSlots) {
//     let slots = preferredSlots;
//     for (let i = 0; i < slots.length; i++) {
//         slots[i].value = `${day}-${slots[i].value}`
//     }
//     return slots;
// }

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class PreferredTimeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sundayPreferredTimes: [],
            mondayPreferredTimes: [],
            tuesdayPreferredTimes: [],
            wednesdayPreferredTimes: [],
            thursdayPreferredTimes: [],
            fridayPreferredTimes: [],
            saturdayPreferredTimes: [],
        }
        this.handleChangeSundayTime = this.handleChangeSundayTime.bind(this);
        this.handleChangeMondayTime = this.handleChangeMondayTime.bind(this);
        this.handleChangeTuesdayTime = this.handleChangeTuesdayTime.bind(this);
        this.handleChangeWednesdayTime = this.handleChangeWednesdayTime.bind(this);
        this.handleChangeThursdayTime = this.handleChangeThursdayTime.bind(this);
        this.handleChangeFridayTime = this.handleChangeFridayTime.bind(this);
        this.handleChangeSaturdayTime = this.handleChangeSaturdayTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // TODO: Refactor into map function to allow coe re-use
    handleChangeSundayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            sundayPreferredTimes: value
        })
    }
    handleChangeMondayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            mondayPreferredTimes: value
        })
    }
    handleChangeTuesdayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            tuesdayPreferredTimes: value
        })
    }
    handleChangeWednesdayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            wednesdayPreferredTimes: value
        })
    }
    handleChangeThursdayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            thursdayPreferredTimes: value
        })
    }
    handleChangeFridayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            fridayPreferredTimes: value
        })
    }
    handleChangeSaturdayTime(e, {value}) {
        e.preventDefault();
        this.setState({
            saturdayPreferredTimes: value
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        let preferredTimes = [
        ...this.state.sundayPreferredTimes && this.state.sundayPreferredTimes.map(time => `Sunday-${time}`),
        ...this.state.mondayPreferredTimes && this.state.mondayPreferredTimes.map(time => `Monday-${time}`),
        ...this.state.tuesdayPreferredTimes && this.state.tuesdayPreferredTimes.map(time => `Tuesday-${time}`),
        ...this.state.wednesdayPreferredTimes && this.state.wednesdayPreferredTimes.map(time => `Wednesday-${time}`),
        ...this.state.thursdayPreferredTimes && this.state.thursdayPreferredTimes.map(time => `Thursday-${time}`),
        ...this.state.fridayPreferredTimes && this.state.fridayPreferredTimes.map(time => `Friday-${time}`),
        ...this.state.saturdayPreferredTimes && this.state.saturdayPreferredTimes.map(time => `Saturday-${time}`),
        ]
        this.props.setPreferredTimes(preferredTimes);
        this.props.handleSubmit();
    }
    render() {
        return (
            <Container>
                <Message
                    centered
                    content="Please select the times that work for you"
                    style = {messageStyle}
                />
                <Divider/>
                <Grid columns={7}>
                    <Grid.Column>
                        <Header>Sunday</Header>
                        <Divider/>
                            <Dropdown placeholder='Sunday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeSundayTime} name='Sunday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Monday</Header>
                        <Divider/>
                            <Dropdown placeholder='Monday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeMondayTime} name='Monday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Tuesday</Header>
                        <Divider/>
                            <Dropdown placeholder='Tuesday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeTuesdayTime} name='Tuesday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Wednesday</Header>
                        <Divider/>
                            <Dropdown placeholder='Wednesday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeWednesdayTime} name='Wednesday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Thursday</Header>
                        <Divider/>
                            <Dropdown placeholder='Thursday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeThursdayTime} name='Thursday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Friday</Header>
                        <Divider/>
                            <Dropdown placeholder='Friday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeFridayTime} name='Friday'/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header>Saturday</Header>
                        <Divider/>
                            <Dropdown placeholder='Saturday' fluid multiple selection options=
                            {preferredTimesSlots} 
                            onChange={this.handleChangeSaturdayTime} name='Saturday'/>
                    </Grid.Column>
                </Grid>
                <Button onClick={this.handleSubmit}>Submit</Button>
            </Container>
        )
    }
}