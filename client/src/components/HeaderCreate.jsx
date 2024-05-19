import React from 'react';
import { Modal } from 'react-bootstrap';

import PostEditor from './PostEditor';

function HeaderCreate({ show, setShow }) {
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            className='create-post-modal'
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Publish a post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PostEditor setShow={setShow} />
            </Modal.Body>
        </Modal>
    )
}

export default HeaderCreate;