import { Row } from "react-bootstrap";
import { Container } from 'react-bootstrap';
function Profile() {
    return (
        <>
                <div className="profile-banner">

                </div>
                <div className="profile-header">
                    <ul className="profile-header-list">
                        <li value={0}>
                            <p>Posts</p>
                            <p><b>21</b></p>
                        </li>
                        <li value={1}>
                            <p>Likes</p>
                            <p><b>255</b></p>
                        </li>
                        <li value={2}>
                            <p>Answers</p>
                            <p><b>13</b></p>
                        </li>
                        <li value={3}>
                            <p>Questions</p>
                            <p><b>13</b></p>
                        </li>
                        <li value={4}>
                            <p>Bookmarks</p>
                            <p><b>2</b></p>
                        </li>
                    </ul>
                </div>
        </>
    )
}

export default Profile;