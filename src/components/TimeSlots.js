import React from 'react'
import { List, Form, Button, Dropdown} from 'semantic-ui-react'

export default class TimeSlots extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            slots: [],
            time: '',
            day: ''
        }
        this.addTime = this.addTime.bind(this);
        this.removeTime = this.removeTime.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    gmtMapper(timezone) {
        let gmtOffset = parseInt(timezone)/60;
        let prefix = gmtOffset >= 0 ? '+' : '-';
        return `GMT ${prefix}${gmtOffset}`
    }
    addTime(e) {
        e.stopPropagation();
        let timeZone = new Date().getTimezoneOffset();
        let time = `${this.state.time} - ${this.state.day} - ${this.gmtMapper(timeZone)}`
        this.setState({
            slots : [...this.state.slots, time]
        })
    }

    renderSubmitButton() {
        return ((this.state.slots.length >= 5) ?
            null : <Button type='submit'>Submit</Button>
            )
    }

    removeTime(toRemove) {
        let newSlots = this.state.slots;
        newSlots.splice(newSlots.indexOf(toRemove),1);
        this.setState({
            slots: newSlots
        })
    }

    listTimes(allTimes) {
        return allTimes.map((time, ind) => {
            return <List.Item as='li' key={ind}>{time}<Button onClick={() => this.removeTime(time)}>x</Button></List.Item>
        })
    }

    handleTimeChange(e) {
        e.preventDefault();
        let time = e.target.value.toString();
        this.setState({
            time: time
        });
    }

    handleDayChange(e, {value}) {
        e.preventDefault();
        this.setState({
            day: value
        })
    }
    render() {
        const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let daysDropdownContent = DAYS.map(day => {
            return {
                key: day,
                text: day,
                value: day,
            }
        })
        let timeInputStyle = {
            width: '80%'
        }
        const value = this.state.day;
        return (
            <div>
                <Form onSubmit={this.addTime}>
                    <Form.Input onChange={this.handleTimeChange}
                        name='time'
                        id='time-for-slot'
                        label='Time'
                        type='time'
                        style={timeInputStyle}
                    />
                    <Dropdown onChange={this.handleDayChange}
                        placeholder='Day'
                        selection
                        options={daysDropdownContent}
                        value={value}
                        style={timeInputStyle}
                    />
                    {this.renderSubmitButton()}
                </Form>
                <List as='ol'> {this.listTimes(this.state.slots)} </List>
            </div>
            
        )
    }
}