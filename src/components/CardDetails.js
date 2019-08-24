import React from 'react'
import { Card, Message, Statistic, Grid } from 'semantic-ui-react'
import { BACKEND } from "../App";

const compName = 'CardDetails_LS';

//TODO: allow form that lets mentors edit their time preferences
export default class CardDetails extends React.Component {
    constructor(props) {
        super(props);
        this.renderAboutMe = this.renderAboutMe.bind(this);
        this.getLanguages = this.getLanguages.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.state = {
            calls_requested: null,
            calls_completed: null,
        }
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
        const persistState = sessionStorage.getItem(compName);
        // only read from cached state if on same mentor's profile
        if (persistState) {
            try {
                this.setState(JSON.parse(persistState));
                // set state but overwrite with API call
            } catch (e) {
                console.log("Could not get fetch state from local storage for", compName);
            }
        }
        if (this.props.isMentor) {
            if (this.props.mentorIdForStats) {
                let payload = {
                    id: this.props.mentorIdForStats
                }
                fetch(`${BACKEND}/getRequestRecordsMentor`, {
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(payload)
                    }).then(async res => {
                        let resolvedRes = await res;
                        let status = resolvedRes.status;
                        resolvedRes = await resolvedRes.json()
                        if (status !== 200) {
                        }
                        else {
                        this.setState({
                            calls_completed: resolvedRes.calls_completed,
                            calls_requested: resolvedRes.calls_requested,
                        })
                        }
                    })
            }
        }
    }

    componentWillUnmount() {
        if (this.props.isMentor) {
            this.componentCleanup();
            window.removeEventListener('beforeunload', this.componentCleanup);
        }
    }

    renderAboutMe() {
        return (
            <Message
                icon='paper plane'
                header={`About ${this.props.name}...`}
                content={this.props.aboutYourself}
            />
        )
    }

    getLanguages(){
        let languages = this.props.languages;
        if (languages && languages.length > 1) {
            return 'I speak ' + languages.slice(0,-1).join(', ') + ' and '+ languages.slice(-1);
        } else {
            return `I speak ${languages && languages[0]}`;
        }
    }

    render() {
        let {name, school, memberSince} = this.props;
        return (
            <div>
                <Card>
                    <Card.Content>
                    <Card.Header>{name}</Card.Header>
                    <Card.Meta>{school}</Card.Meta>
                    {this.props.isMentor ? <Card.Meta>{this.props.position}</Card.Meta> : null}
                    {this.props.isMentor ? <Card.Meta>{this.getLanguages()}</Card.Meta> : null}
                    {this.renderAboutMe()}
                    <Card.Description>{name} has been a member since {memberSince}.</Card.Description>
                    </Card.Content>
                    {this.props.isMentor? <Card.Content>
                        <Grid.Row>
                            <Grid.Column>
                            <Statistic color='orange'>
                                <Statistic.Value>{this.state.calls_completed}</Statistic.Value>
                                <Statistic.Label>CALLS COMPLETED</Statistic.Label>
                            </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                            <Statistic color='yellow'>
                                <Statistic.Value>{this.state.calls_requested}</Statistic.Value>
                                <Statistic.Label>CALLS REQUESTED</Statistic.Label>
                            </Statistic>
                            </Grid.Column>
                        </Grid.Row>
                    </Card.Content> : null}
                </Card>
            </div>
        );
    }
}
