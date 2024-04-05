import { Row, Col, Tab, Tabs, Button  } from 'react-bootstrap';
import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';
function Profile() {
    return (
        <>
            <Row className="profile-banner">
                <Button className='profile-btn'>
                    <EditBanner />
                </Button>
            </Row>
            <Tabs defaultActiveKey="Posts" className="profile-header-list">
                <Tab eventKey="Posts" title={<Col><p>Posts</p><p><b>13</b></p></Col>}>
                    {/* <p>Posts</p>
                    <p><b>21</b></p> */}
                </Tab>
                <Tab eventKey="Likes" title={<Col><p>Likes</p><p><b>13</b></p></Col>}>
                    {/* <p>Likes</p>
                    <p><b>255</b></p> */}
                </Tab>
                {/* <Tab eventKey="Answers" title={<Col><p>Answers</p><p><b>13</b></p></Col>}>
                    <p>Answers</p>
                    <p><b>13</b></p>
                </Tab>
                <Tab eventKey="Questions" title={<Col><p>Questions</p><p><b>13</b></p></Col>}>
                    <p>Questions</p>
                    <p><b>13</b></p>
                </Tab> */}
                <Tab eventKey="Bookmarks" title={<Col><p>Bookmarks</p><p><b>13</b></p></Col>}>
                    {/* <p>Bookmarks</p>
                    <p><b>2</b></p> */}
                </Tab>
            </Tabs>
            <Row className='d-flex'>
                <Col className=''>
                    <Button className='profile-avatar'>
                        <EditBanner />
                    </Button> 
                </Col>
            </Row>
        </>
    );
}

export default Profile;