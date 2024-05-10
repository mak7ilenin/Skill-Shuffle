import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

function SmallMenuModal({ showModal, closeModal, content, handleActionClick }) {
    const [modalContent, setModalContent] = useState();

    const getModalContent = useCallback(() => {
        switch (content) {
            case 'leave':
                return {
                    title: 'Leave chat',
                    body: 'If you leave, you won\'t receive any new messages from this chat. You can only return if there is enough room.',
                    button: 'Leave chat'
                };
            case 'clear':
                return {
                    title: 'Delete all messages',
                    body: 'Are you sure you want to delete the entire message history for this chat?',
                    button: 'Delete'
                };
            default:
                return '';
        }
    }, [content]);

    useEffect(() => {
        setModalContent(getModalContent());
    }, [content, getModalContent]);

    return (
        <Modal className='small-menu-modal' show={showModal} onHide={closeModal}>
            {modalContent && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalContent.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalContent.body}</Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-light' onClick={closeModal}>Cancel</button>
                        <button className='btn btn-danger' onClick={() => handleActionClick(content)}>{modalContent.button}</button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    )
}

export default SmallMenuModal