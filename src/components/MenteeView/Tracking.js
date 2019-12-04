import React from 'react'
import { Card, Divider, Form, Segment, List, Label, Button, Select, Modal, Input, Header, Icon } from 'semantic-ui-react'
import { BACKEND } from "../../App";
import swal from "sweetalert";

const compName = 'Tracking_LS';

export const REACH = 'Reach'
export const MATCH = 'Match'
export const SAFETY = 'Safety'

// TODO: Make update application details function

/*
    collegeShortlist: [
        {
        name: string,
        rank: string,
        }
    ],
    grade: string,
    OALevel: string,
    SAT: string,
    OtherExams: string,
    ECA: {
        activityOrAchievement: string,
        yearsOfCommit: string,
        positionOrDesc: string
    } [],
    viewMode: boolean,
    trackingId: string,
    menteeId: string
*/

export function groupByRank(collegeObjs) {

    let sortedShortList = {
        MATCH: [],
        REACH: [],
        SAFETY: []
    }
    collegeObjs.forEach( collegeObj => {
        switch(collegeObj.rank) {
            case(MATCH):
                sortedShortList.MATCH.push(collegeObj.name)
                break
            case(REACH):
                sortedShortList.REACH.push(collegeObj.name)
                break
            case(SAFETY):
                sortedShortList.SAFETY.push(collegeObj.name)
                break
            default:
                break
        }
    })
    return sortedShortList
}

export default class Tracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collegeShortlist: [],
            grade: '',
            OALevel: '',
            SAT: '',
            OtherExams: '',
            ECA: [],
            rank: '', // for new college being added
            collegeName: '', // for new college being added
            activityOrAchievement: '', // for new eca
            yearsOfCommit: '', // for new eca
            positionOrDesc: '', // for new eca
        }
        this.componentCleanup = this.componentCleanup.bind(this);
        this.removeCollege = this.removeCollege.bind(this);
        this.addCollege = this.addCollege.bind(this);
        this.removeECA = this.removeECA.bind(this);
        this.addECA = this.addECA.bind(this);
        this.updateTracking = this.updateTracking.bind(this);
        this.getECA = this.getECA.bind(this);
        this.getCollegesList = this.getCollegesList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCollegeRank = this.handleChangeCollegeRank.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
    }

    // TODO: Include submit validator to disable update if new changes are same as old

    handleChangeGrade(e, {value}) {
        e.preventDefault();
        this.setState({
            grade: value
        })
    }

    handleChangeCollegeRank(e, {value}) {
        e.preventDefault();
        this.setState({
            rank: value
        })
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    updateTracking(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false
        });
        let payload = {
            trackingId: this.props.trackingId,
            menteeId: this.props.menteeId,
            collegeShortlist: this.state.collegeShortlist,
            grade: this.state.grade,
            OALevel: this.state.OALevel,
            SAT: this.state.SAT,
            OtherExams: this.state.OtherExams,
            ECA: this.state.ECA
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/updateTracking`, {
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
                    title: "Updated Application Details!",
                    text: `Mentors will be able to help you better now!`,
                    icon: "success",
                  });
               }
           }).catch(err => {
            window.alert("Something went wrong, the server's funky!")
        });
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount() {
        if (this.props.menteeId) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            let payload = {
                menteeId: this.props.menteeId
            }
            fetch(`${BACKEND}/getTracking`, {
                method: 'post',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(payload)
            }).then(async res => {
                    let resolvedRes = await res;
                    resolvedRes = await resolvedRes.json()
                    let {ECA, OAlevel, SAT, OtherExams, grade, collegeShortlist} = resolvedRes
                    let ECAparsed = JSON.parse(ECA)
                    let collegeShortlistParsed = JSON.parse(collegeShortlist)
                    this.setState({
                        ECA: ECAparsed || [],
                        OALevel: OAlevel,
                        SAT: SAT,
                        OtherExams: OtherExams,
                        collegeShortlist: collegeShortlistParsed || [],
                        grade: grade
                    })
            }
            ).catch(e => console.log(e))
        }
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
    }

    addCollege() {
        let newCollege = {
            rank: this.state.rank,
            name: this.state.collegeName
        }
        let collegeShortlistNew = this.state.collegeShortlist
        if (collegeShortlistNew.some( college => {
            return college.name.toLowerCase() === newCollege.name.toLowerCase()
        })) {
            return;
        }
        collegeShortlistNew.push(newCollege)
        this.setState({
            collegeShortlist: collegeShortlistNew
        })
    }

    addECA() {
        let newECA = {
            activityOrAchievement: this.state.activityOrAchievement,
            yearsOfCommit: this.state.yearsOfCommit,
            positionOrDesc: this.state.positionOrDesc
        }
        let ECAListNew = this.state.ECA
        ECAListNew.push(newECA)
        this.setState({
            ECA: ECAListNew
        })
    }

    removeECA(name){
        let ECA = this.state.ECA;
        ECA = ECA.filter(eca => {
            return eca.activityOrAchievement !== name
        })
        this.setState({
            ECA: ECA
        })
    }

    getECA(edit=true) {
        if (this.state.ECA && !this.state.ECA.length) {
            return <Header block>No ECAs added!</Header>
        }
        return this.state.ECA && this.state.ECA.map(eca => {
            return <List.Item>
                        <Label>
                            Activity/Achievement: {eca.activityOrAchievement}
                            {edit? <Icon onClick={() => this.removeECA(eca.activityOrAchievement)} name='delete' />: null}
                        </Label>
                <List.Description>Position/Description: {eca.positionOrDesc}</List.Description>
                <List.Description>Commitment: {eca.yearsOfCommit}</List.Description>
            </List.Item>
        })
    }

    removeCollege(name){
        let collegeShortlist = this.state.collegeShortlist;
        collegeShortlist = collegeShortlist.filter(college => {
            return college.name !== name
        })
        this.setState({
            collegeShortlist: collegeShortlist
        })
    }

    getCollegesList(edit=true) {
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
                            {edit? <Icon name='delete' onClick={() => this.removeCollege(college)}/>: null}
                        </Label>
                        </>
                    </List.Item>)
                })}
                </>
            )
            
        })
    }

    render() {
        let options = [REACH, MATCH, SAFETY].map(val => {
            return {
                key: val,
                value: val,
                text: val
            }
        })
        let updateCollegesField = 
            <Segment>
                <Form onSubmit={this.addCollege}>
                    <Form.Field>
                        <Header block>College Shortlist</Header>
                        <List>
                            {this.getCollegesList()}
                        </List>
                        <Input type='text' placeholder='New College...' action name="collegeName" onChange={this.handleChange}>
                            <input />
                            <Select compact options={options} defaultValue={null} name="rank" onChange={this.handleChangeCollegeRank}/>
                            <Button type='submit'>Add College</Button>
                        </Input>
                    </Form.Field>
                </Form>
            </Segment>
        
        let updateECAInfo = 
            <Segment>
                <Form onSubmit={this.addECA}>
                    <Header block>ECA Profile</Header>
                    <List>
                        {this.getECA()}
                    </List>
                    <Form.Field
                        type="text">
                        <label>Activity or Achievement</label>
                        <input maxLength={100} placeholder='Activity... ' name="activityOrAchievement" onChange={this.handleChange} value={this.state.activityOrAchievement} />
                    </Form.Field>
                    <Form.Field
                        type="text">
                        <label>Years of commitment</label>
                        <input maxLength={100} placeholder='Years involved... ' name="yearsOfCommit" onChange={this.handleChange} value={this.state.yearsOfCommit} />
                    </Form.Field>
                    <Form.Field
                        type="text">
                        <label>Position/Description</label>
                        <input maxLength={100} placeholder='Position or brief description of role... ' name="positionOrDesc" onChange={this.handleChange} value={this.state.positionOrDesc} />
                    </Form.Field>
                    <Button type='submit'>Add ECA</Button>
                </Form>
            </Segment>
        let testAndBackgroundInfo = 
            <Segment>
                <Form onSubmit={this.updateTracking}>
                    <Form.Field>
                        <label>Current Class/Grade</label>
                        <Select compact options={['8th', '9th', '11th', '12th'].map(grade => {return {key: grade, value: grade, text: grade}})} defaultValue={null} name="grade" onChange={this.handleChangeGrade}/>
                    </Form.Field>
                    <Form.Field
                        type="text">
                        <label>O/A Level (or equivalent)</label>
                        <input maxLength={200} placeholder='Your O/A level results...' name="OALevel" onChange={this.handleChange} value={this.state.OALevel} />
                    </Form.Field>
                    <Form.Field
                        type="text">
                        <label>SAT</label>
                        <input maxLength={200} placeholder='Your SAT results... (or registration date)' name="SAT" onChange={this.handleChange} value={this.state.SAT} />
                    </Form.Field>
                    <Form.Field
                        type="text">
                        <label>Other Exams</label>
                        <input maxLength={200} placeholder='Any other exam results... (or registration dates)' name="OtherExams" onChange={this.handleChange} value={this.state.OtherExams} />
                    </Form.Field>
                </Form>
            </Segment>
            
        let updateTrackingModal = <div>
            <Divider/>
            <Modal
                open={this.state.modalOpen}
                trigger={
                    <Button
                        onClick={() => {this.setState({modalOpen: true})}}
                        centered
                        style={{'width': '100%'}}
                    >
                        Update Application Details
                    </Button>
                }>
                <Modal.Header>Application Details</Modal.Header>
                <Modal.Content>
                    {updateCollegesField}
                    {updateECAInfo}
                    {testAndBackgroundInfo}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => {this.setState({modalOpen: false})}}>
                        Close
                    </Button>
                    <Button 
                        disabled={!this.state.grade && !this.state.OALevel && !this.state.OtherExams && !this.state.OtherExams && !this.state.rank && !this.state.collegeName && !this.state.positionOrDesc && !this.state.yearsOfCommit && !this.state.activityOrAchievement}
                        onClick={this.updateTracking}>
                        Update
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
        return (
            <div>
                <Divider/>
                <Card>
                    <Card.Content centered>
                        <Card.Header>Progress</Card.Header>
                        {!this.state.grade && !this.state.OALevel && !this.state.OtherExams && !this.state.collegeShortlist.length && !this.state.ECA.length ? <><Card.Meta>Application details not added...</Card.Meta> </> : null}
                        {this.state.collegeShortlist && this.state.collegeShortlist.length? 
                        <Segment>
                            <Header block>
                                College Shortlist
                            </Header>
                            <List>
                            {this.getCollegesList(false)}
                            </List>
                        </Segment>
                        : null}
                        {this.state.ECA && this.state.ECA.length? 
                        <Segment>
                            <Header block>ECA Profile</Header>
                            <List>
                                {this.getECA(false)}
                            </List>
                        </Segment>
                        : null}
                        {this.state.grade?
                        <>
                        <Card.Meta>Grade</Card.Meta>
                        <Card.Description>{this.state.grade}</Card.Description>
                        </>: null}
                        {this.state.OALevel?
                        <>
                        <Card.Meta>O/A Results (or equivalent)</Card.Meta>
                        <Card.Description>{this.state.OALevel}</Card.Description>
                        </>: null}
                        {this.state.OtherExams?
                        <>
                        <Card.Meta>Other Scores</Card.Meta>
                        <Card.Description>{this.state.OtherExams}</Card.Description>
                        </>: null}
                    </Card.Content>
                    {!this.props.viewMode? updateTrackingModal : null}
                </Card>
            </div>
        );
    }
}
