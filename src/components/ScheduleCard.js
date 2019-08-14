import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { BACKEND } from "../App"
import swal from "sweetalert";

export default class ScheduleCard extends React.Component {
    // TODO: Implement cancel and reschedule
    constructor(props){
        super(props);
        this.provideFeedback = this.provideFeedback.bind(this);
    }
    provideFeedback(e){
        console.log("provide feedback clicked");
        e.preventDefault();
        swal.withForm({
            title: 'Feedback Form',
            text: 'How did your call go?',
            showCancelButton: true,
            confirmButtonColor: 'orange',
            confirmButtonText: 'Submit!',
            closeOnConfirm: true,
            formFields: [
              { id: 'feedback', placeholder: 'feedback' },
            ]
          }, function (isConfirm) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/giveFeedback`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(this.swalForm)
            }).then(res => {
                console.log("feedback sent")
                if (res.status !== 200) {
                    console.log("Request failed")
                } else {
                    console.log("received response", res.json())
                    swal({
                        title: `Thank you for your feedback.`,
                        text: "Best of luck!",
                        icon: "success",
                    });
                }
            });
          })
    }
    render() {
        const {time, topic, mentor} = this.props;
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Call with: {mentor}</Card.Header>
                    <Card.Meta>{time}</Card.Meta>
                    <Card.Description>
                    You are scheduled for 30 minutes to discuss {topic}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='dark orange'
                        onClick={() => window.open(this.props.meetingRoom)}
                    >
                        Join Video Call
                    </Button>
                    <Button
                        onClick={this.props.requestDone ? this.provideFeedback : null}
                        basic color='yellow' disabled={!this.props.requestDone}>
                        Provide Feedback
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
    
}