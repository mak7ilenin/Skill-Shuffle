import React, { useState, useCallback, useRef } from 'react';
import { Form, Image, Row, Col, Button, Dropdown, Popover, OverlayTrigger, Stack } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import { useAuth } from './AuthContext';
import { API_SERVER } from '../config';
import EmojiGifPicker from './EmojiGifPicker';

import { CiSettings } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
// import { MdOutlineSlowMotionVideo } from "react-icons/md";
// import { GoFile } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function PostEditor({ setUser, setShow }) {
    const { authUser } = useAuth();
    const textareaRef = useRef(null);
    const [text, setText] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [disableComments, setDisableComments] = useState(false);
    const [disableNotification, setDisableNotifications] = useState(false);
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setText(e.target.value)
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const onDrop = useCallback(acceptedFiles => {
        // Calculate the number of files that can be added without exceeding the limit
        const numFilesToAdd = Math.min(acceptedFiles.length, 10 - files.length);

        // Only add enough files to reach the limit
        const filesToAdd = acceptedFiles.slice(0, numFilesToAdd);

        setFiles(prevFiles => [
            ...prevFiles,
            ...filesToAdd.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                blob: file
            }))
        ]);
    }, [files]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png']
        },
        onDrop,
        maxSize: 16 * 1024 * 1024, // 16 MB
        maxFiles: 10
    });

    const removeFile = file => () => {
        const newFiles = [...files];
        newFiles.splice(newFiles.indexOf(file), 1);
        setFiles(newFiles);
    };

    const createPost = (e) => {
        e.preventDefault();
        const formData = new FormData();

        const postObject = {
            text,
            privacy,
            allowComments: !disableComments,
            allowNotifications: !disableNotification
        }

        formData.append('post', JSON.stringify(postObject));
        files.forEach(file => {
            formData.append('files', file.blob);
        });

        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        axios.post(`${API_SERVER}/posts`, formData, config)
            .then(response => {
                // Check if setUser is defined
                if (setUser) {
                    setUser(prevUser => {
                        return {
                            ...prevUser,
                            posts: [response.data, ...prevUser.posts]
                        }
                    });
                }

                setText('');
                setPrivacy('public');
                setDisableComments(false);
                setDisableNotifications(false);
                setFiles([]);
                textareaRef.current.style.height = 'inherit';

                if (setShow) {
                    setShow(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const popover = (
        <Popover className='secondary-popover'>
            <Popover.Body>
                <Row fluid='md'>
                    <Form.Check
                        type="checkbox"
                        label="Disable comments"
                        checked={disableComments}
                        onChange={() => setDisableComments(!disableComments)}
                    />
                </Row>
                <Row fluid='md'>
                    <Form.Check
                        type="checkbox"
                        label="Disable notifications"
                        checked={disableNotification}
                        onChange={() => setDisableNotifications(!disableNotification)}
                    />
                </Row>
            </Popover.Body>
        </Popover>
    );

    return (
        <Form className='post-editor' onSubmit={createPost}>
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
                        ref={textareaRef}
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
                {files.length > 0 && (
                    <Stack className='post-editor__files mb-2 p-0'>
                        {files.map(file => {
                            return (
                                <Col key={file.name} className='post-editor__file'>
                                    <img src={file.preview} alt='preview' />
                                    <Button variant='none' className="remove-file" onClick={removeFile(file)}>
                                        <RxCross1 size={13} color='white' />
                                    </Button>
                                </Col>
                            )
                        })}
                    </Stack>
                )}
                <Row>
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
                            {/* <Button variant='none'>
                                <GoFile size={22} />
                            </Button>
                            <Button variant='none'>
                                <MdOutlineSlowMotionVideo size={22} />
                            </Button> */}
                            <Button variant='none' {...getRootProps()}>
                                <MdOutlineAddPhotoAlternate size={22} />
                                <input {...getInputProps()} />
                            </Button>
                            <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                                <Button variant='none'>
                                    <CiSettings size={25} />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col md='auto' className='post-editor__submit ms-3'>
                            <Button
                                variant='primary'
                                type='submit'
                                disabled={text.length > 3000 || (!text && files.length === 0)}
                            >
                                Post
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Row>
        </Form>
    );
}

export default PostEditor;