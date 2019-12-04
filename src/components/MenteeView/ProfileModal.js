/* eslint-disable max-len */
import React from 'react'
import { Modal, Card, Button, Header, Label, List, Image, Segment } from 'semantic-ui-react'
import { BACKEND } from "../../App"
import { groupByRank } from "./Tracking"

/*
props: menteeId
handlerFunction for open/Close Modal
*/
export default class MenteeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            school: '',
            ECA: [],
            collegeShortlist: [],
            grade: '',
            image: '',
            memberSince: '',
            location: ''
        }
        this.getECA = this.getECA.bind(this);
        this.getCollegesList = this.getCollegesList.bind(this);
    }

    componentDidMount() {
        if (this.props.menteeId) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            let payload = {
                menteeId: this.props.menteeId
            }
            fetch(`${BACKEND}/getMenteeInfo`, {
                method: 'post',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(payload)
            }).then(async res => {
                    let resolvedRes = await res;
                    resolvedRes = await resolvedRes.json()
                    // tracking info
                    console.log("profile modal", resolvedRes)
                    let {name, ECA, OAlevel, SAT, OtherExams, grade, collegeShortlist, memberSince, location, image, school} = resolvedRes
                    /*
                    parse mentee info from resolved Res
                    */
                    let ECAparsed = ECA && JSON.parse(ECA)
                    let CSLparsed = collegeShortlist && JSON.parse(collegeShortlist)
                    this.setState({
                        ECA: ECAparsed || [],
                        OALevel: OAlevel,
                        SAT: SAT,
                        OtherExams: OtherExams,
                        collegeShortlist: CSLparsed || [],
                        grade: grade,
                        name: name,
                        memberSince: memberSince,
                        image: image,
                        location,
                        school: school
                    })
            }
            ).catch(e => console.log(e))
        }
    }

    getECA() {
        if (this.state.ECA && !this.state.ECA.length) {
            return <Header block>No ECAs added!</Header>
        }
        return this.state.ECA && this.state.ECA.map(eca => {
            return <List.Item>
                        <Label>
                            Activity/Achievement: {eca.activityOrAchievement}
                        </Label>
                <List.Description>Position/Description: {eca.positionOrDesc}</List.Description>
                <List.Description>Commitment: {eca.yearsOfCommit}</List.Description>
            </List.Item>
        })
    }

    getCollegesList() {
        if (this.state.collegeShortlist && !this.state.collegeShortlist.length) {
            return <Header block>No colleges in shortlist!</Header>
        }
        let sortedShortlist = groupByRank(this.state.collegeShortlist)
        if (!sortedShortlist) {
            return []
        }
        let ranks = Object.keys(sortedShortlist)
        return ranks.map(rank => {
            if (!sortedShortlist[rank].length) {
                return null;
            }
            return(
                <>
                <Label size={'large'}>{rank}</Label>
                {sortedShortlist[rank].map( college => {
                    return (<List.Item>
                        <>
                        <Label size={'medium'} image>{college}
                        </Label>
                        </>
                    </List.Item>)
                })}
                </>
            )
        })
    }

    render() {
        return (
            <Modal
            open={this.state.modalOpen}
            trigger={
                <Button
                    onClick={() => {this.setState({modalOpen: true})}}
                >
                    View {this.state.name}'s Profile
                </Button>
            }>
            <Modal.Header>{this.state.name}</Modal.Header>
            <Modal.Content>
            <Card centered>
                <Image src={this.state.image} wrapped ui={false} />
                <Card.Content>
                <Card.Header>Attends {this.state.school}, in {this.state.grade} grade</Card.Header>
                <Card.Meta>
                    <span className='date'>Member since {this.state.memberSince}</span>
                </Card.Meta>
                <Card.Meta>
                    Location: {this.state.location}
                </Card.Meta>
                </Card.Content>
                <Card.Content centered>
                    <Segment style={{'width': '95%'}}>
                        <label>Colleges in shortlist:</label> <br/>
                        {this.getCollegesList()}
                    </Segment>
                    <Segment style={{'width': '95%'}}>
                        <label>Extra-curricular activities:</label>
                        {this.getECA()}
                    </Segment>
                </Card.Content>
            </Card>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {this.setState({modalOpen: false})}}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
        )
    }
}