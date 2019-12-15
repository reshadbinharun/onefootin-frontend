import React from 'react'
import { Grid, Card } from 'semantic-ui-react'
import { adminContentOrangeStyle, adminContentYellowStyle } from "../../inlineStyles"

export default class SchoolRequestCard extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const { topic, menteeName, mentorName, paired } = this.props;
        return (
            <Card centered={true} style={paired? adminContentOrangeStyle : adminContentYellowStyle}>
                <Grid columns={1}>
                    <Grid.Column width={13}>
                        {mentorName?
                            <><strong>{menteeName}({schoolName})</strong> set for a call with <strong>{mentorName}</strong> about <strong>{topic}</strong>.</> :
                            <>You have requested a call for <strong>{menteeName}</strong> about <strong>{topic}</strong>.</>}    
                    </Grid.Column>
                </Grid>
            </Card>
        )
    }
    
}