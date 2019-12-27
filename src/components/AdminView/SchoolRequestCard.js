import React from 'react'
import { Grid, Card, Button, Modal, Form, Select } from 'semantic-ui-react'
import { adminContentOrangeStyle, adminContentYellowStyle } from "../../inlineStyles"
import {BACKEND} from "../../App";
import swal from "sweetalert";

export default class SchoolRequestCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            requestId: this.props.requestId,
            modalOpen: false,
            mentorPairId: null,
            mentors: []
        }
        this.handleMentorPick = this.handleMentorPick.bind(this);
    }

    componentDidMount(){
        if (this.props.topic) {
            var headers = new Headers();
            let payload = {
                topic: this.props.topic
            }
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch(`${BACKEND}/getMentorsByTopic`, {
                method: 'post',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(payload)
            }).then(async res => {
                let resolvedRes = await res;
                resolvedRes = await resolvedRes.json()
                this.setState({
                    mentors: resolvedRes && resolvedRes.mentors
                });
            });
        }
    }

    handleMentorPick(e, {value}) {
        e.preventDefault();
        this.setState({
            mentorPairId: value
        })
    }

    pairCall() {
        this.setState({
            modalOpen: false
        });
        let payload = {
            mentorId: this.state.mentorPairId,
            menteeId: this.props.menteeId,
            topic: this.props.topic,
            schoolName: this.props.schoolName,
            requestId: this.props.requestId
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/newAdminRequest`, {
            method: 'post',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(payload)
           }).then(async res => {
               let resolvedRes = await res;
               if (resolvedRes.status !== 200) {
                swal({
                    title: "Oops!",
                    text: "Something went wrong... Please try again.",
                    icon: "error",
                });
               }
               else {
                swal({
                    title: "Pair request sent!",
                    text: `You just requested a call with mentor on behalf of ${this.props.schoolName}.`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    render() {
        const {schoolName, topic, paired, menteeName, mentorName} = this.props;
        const options = this.state.mentors && this.state.mentors.map(mentor => {
            return {
                text: `${mentor.name} (${mentor.college})`,
                key: mentor.id,
                value: mentor.id
            }
        })
        return (
            <Card centered={true} style={paired? adminContentOrangeStyle : adminContentYellowStyle}>
                <Grid columns={2}>
                    <Grid.Column width={11}>
                        {mentorName?
                            <><strong>{menteeName}({schoolName})</strong> set for a call with <strong>{mentorName}</strong> about <strong>{topic}</strong>.</> :
                            <><strong>{schoolName}</strong> has requested a call for <strong>{menteeName}</strong> about <strong>{topic}</strong>.</>}
                        
                    </Grid.Column>
                    <Grid.Column width={5}>
                    {
                        paired? null :
                        <Modal
                            open={this.state.modalOpen}
                            trigger={
                                <Button
                                    onClick={() => {this.setState({modalOpen: true})}}
                                >
                                    Find Mentor to pair
                                </Button>
                            }>
                            <Modal.Header>Pair Mentor</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.pairCall}>
                                    <label>Select a mentor for {menteeName}({schoolName}) to consult {topic}</label>
                                    <Select compact options={options} defaultValue={null} name="mentorPairId" onChange={this.handleMentorPick}/>
                                    <Button 
                                        color="blue" 
                                        type='submit'
                                        disabled={!this.state.mentorPairId}
                                    >
                                        Pair!
                                    </Button>                                
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => {this.setState({modalOpen: false})}}>
                                    Done
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    } 
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}