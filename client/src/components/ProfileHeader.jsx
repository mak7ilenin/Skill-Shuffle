import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

function ProfileHeader() {
    return (
        <Tabs
            id='profileHeaderList'
            defaultActiveKey='posts'
            className="d-flex border-0 flex-row align-items-center justify-content-center h-100"
        >
            <Tab
                eventKey='posts'
                title={
                    <>
                        <p className='tab-name'>Posts</p>
                        <p className='tab-counter'>13</p>
                    </>
                }
            />
            <Tab
                eventKey='likes'
                title={
                    <>
                        <p className='tab-name'>Likes</p>
                        <p className='tab-counter'>13</p>
                    </>
                }
            />
            <Tab
                eventKey='bookmarks'
                title={
                    <>
                        <p className='tab-name'>Bookmarks</p>
                        <p className='tab-counter'>13</p>
                    </>
                }
            />
        </Tabs>
    )
}

export default ProfileHeader;