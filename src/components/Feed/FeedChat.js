import React from 'react'
import { Feed, Divider } from 'semantic-ui-react'
import { messageChatFeed, mentorMessage, menteeMessage } from '../../inlineStyles'
import { MENTEE, MENTOR } from "../../magicString"

export default class FeedChat extends React.Component {
    constructor(props){
        super(props);
        this.getEvents = this.getEvents.bind(this);
    }
    /*
    format of events:
        role: role,
        date: dateString,
        sender: `${name} (${role})`,
        message: messageString
    */
    getEvents(events) {
        return events.map(evt => {
            let event = 
            <Feed.Event>
                {/* TODO: dateString to be included when in human-readable format 
                <Feed.Label>
                {evt.dateString}
                </Feed.Label> */}
                <Feed.Content>
                    <Feed.Summary>
                    {evt.message}
                    </Feed.Summary>
                    <Feed.Meta>
                    <strong>{evt.sender}</strong>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
            switch(evt.role){
                case(MENTEE):
                    return <div style={menteeMessage}>
                        {event}
                        <Divider/>
                    </div>
                case(MENTOR):
                    return <div style={mentorMessage}>
                        {event}
                        <Divider/>
                    </div>
                default:
                    return null
            }
            
        })
    }
    render(){
        return (
        <Feed style={messageChatFeed}>
            {this.getEvents(this.props.events)}
        </Feed>
        )
    }
}