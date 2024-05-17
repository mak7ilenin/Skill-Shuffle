import React, { useState } from 'react';
import { Form, Image, Row, Col, Button, Dropdown, Popover, OverlayTrigger } from 'react-bootstrap';

import { useAuth } from './AuthContext';
import EmojiGifPicker from './EmojiGifPicker';

import { CiSettings } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { GoFile } from "react-icons/go";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function PostEditor() {
    const { authUser } = useAuth();
    const [text, setText] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [disableComments, setDisableComments] = useState(false);
    const [disableNotificatiosn, setDisableNotifications] = useState(false);

    const handleChange = (e) => {
        setText(e.target.value)
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const popover = (
        <Popover className='secondary-popover'>
            <Popover.Body>
                <Row fluid='md'>
                    <Form.Check
                        type="checkbox"
                        label="Allow comments"
                        checked={disableComments}
                        onChange={() => setDisableComments(!disableComments)}
                    />
                </Row>
                <Row fluid='md'>
                    <Form.Check
                        type="checkbox"
                        label="Disable notifications"
                        checked={disableNotificatiosn}
                        onChange={() => setDisableNotifications(!disableNotificatiosn)}
                    />
                </Row>
            </Popover.Body>
        </Popover>
    );

    return (
        <Form className='post-editor'>
            <Row>
                <Col className='post-editor__avatar'>
                    <Image
                        src={authUser.avatarUrl || imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='post-editor__textarea'>
                    <Form.Control
                        as="textarea"
                        placeholder="What's new?"
                        onChange={handleChange}
                        value={text}
                        maxLength={3000}
                    />
                </Col>
                <Col className='post-editor__pickers'>
                    <EmojiGifPicker setMessageContent={setText} emojisVisibility={true} />
                </Col>
            </Row>

            <Row className='post-editor__limit'>
                <Form.Text className={`${text.length >= 3000 ? 'over-limit' : ''}`}>
                    {text.length} / 3000
                </Form.Text>
            </Row>

            <hr className='my-2' />

            <Row className='post-editor__footer'>
                <Col className='d-flex justify-content-start align-self-center'>
                    <Dropdown
                        bsPrefix='custom-secondary-dropdown'
                        onSelect={(e) => setPrivacy(e)}
                        autoClose
                    >
                        <Dropdown.Toggle variant='secondary'>
                            {privacy === 'public' ? 'Public post' : 'Friends only'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align={'start end'}>
                            <Dropdown.Item eventKey={'public'} active={privacy === 'public'}>
                                Public post
                            </Dropdown.Item>
                            <Dropdown.Item eventKey={'friends'} active={privacy === 'friends'}>
                                Friends only
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className='d-flex justify-content-end'>
                    <Col md='auto' className='post-editor__icons'>
                        <Button variant='none'>
                            <GoFile size={22} />
                        </Button>
                        <Button variant='none'>
                            <MdOutlineSlowMotionVideo size={22} />
                        </Button>
                        <Button variant='none'>
                            <MdOutlineAddPhotoAlternate size={22} />
                        </Button>
                        <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                            <Button variant='none'>
                                <CiSettings size={25} />
                            </Button>
                        </OverlayTrigger>
                    </Col>
                    <Col md='auto' className='post-editor__submit ms-3'>
                        <Button variant='primary' type='submit'>
                            Post
                        </Button>
                    </Col>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditor;