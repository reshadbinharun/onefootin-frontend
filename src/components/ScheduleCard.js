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
        e.preventDefault();
        swal({
            text: "What did you like about the call? What could have been better?",
            content: "input",
            button: {
                text: "Submit!",
                closeModal: true,
            },
          }).then((feedback) => {
              let payload = {
                  requestId: this.props.requestId,
                  mentee_feedback: feedback
              }
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/giveFeedback`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status !== 200) {
                    swal({
                        title: `Oops!`,
                        text: "Something went wrong! Please try again.",
                        icon: "error",
                    });
                } else {
                    swal({
                        title: `Thank you for your feedback.`,
                        text: "Best of luck! App will now refresh to update appointments.",
                        icon: "success",
                    }).then(() => {
                        window.location.reload();
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
        /*
        States of Join Call Button
        1. Awaiting Confirmation... --> !confirmed, !done
        2. Join Video Call --> confirmed, !done
        3. Call Completed --> done, confirmed
        4. Call Completed --> !confirmed, done (invalid state)
        */
       let buttonText = (this.props.confirmed && !this.props.requestDone) ? 'Join Video Call' : this.props.requestDone ? 'Call Completed' : 'Awaiting Confirmation...';
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
                        disabled={!this.props.confirmed || this.props.requestDone}
                        onClick={() => window.open(this.props.meetingRoom)}
                    >
                        {buttonText}
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