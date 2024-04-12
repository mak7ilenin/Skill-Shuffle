import React from 'react';
import { Row, Col, Container, Image, Stack, Button } from 'react-bootstrap';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function CreateChat() {
    return (
        <Container className='new-chat'>
            <Row className='chat-header d-flex justify-content-start py-3 px-4'>
                <Col className='me-4' xs lg={2}>
                    <Image
                        src={imagePlaceholder}
                        alt='Chat'
                        width='80'
                        height='80'
                        className='rounded'
                    />
                </Col>
                <Col xs>
                    <input
                        type='text'
                        placeholder='Enter a chat name'
                        className='chat-name'
                    />
                </Col>
            </Row>
            <Row className='search-friend'>
                <input
                    type='text'
                    placeholder='Enter friend’s name or surname'
                    className='px-4 py-3 border-1'
                />
            </Row>
            <Stack className='friend-list h-auto flex-grow-1 px-4 mt-3' direction='vertical' gap={3}>
                <div className="friend-container d-flex">
                    <div className="friend-info w-75 d-flex align-items-center">
                        <Image
                            src={imagePlaceholder}
                            alt='Friend'
                            width='35'
                            height='35'
                            className='rounded'
                        />
                        <span className='friend-name ms-3'>Friend Name</span>
                    </div>
                    <div className="friend-add w-25 d-flex justify-content-end align-items-center">
                        <input type="checkbox" name="friend" className='rounded' />
                    </div>
                </div>

                <div className="friend-container d-flex">
                    <div className="friend-info w-75 d-flex align-items-center">
                        <Image
                            src={imagePlaceholder}
                            alt='Friend'
                            width='35'
                            height='35'
                            className='rounded'
                        />
                        <span className='friend-name ms-3'>Friend Name</span>
                    </div>
                    <div className="friend-add w-25 d-flex justify-content-end align-items-center">
                        <input type="checkbox" name="friend" className='rounded' />
                    </div>
                </div>

                <div className="friend-container d-flex h-100">
                    <div className="friend-info w-75 d-flex align-items-center">
                        <Image
                            src={imagePlaceholder}
                            alt='Friend'
                            width='35'
                            height='35'
                            className='rounded'
                        />
                        <span className='friend-name ms-3'>Friend Name</span>
                    </div>
                    <div className="friend-add w-25 d-flex justify-content-end align-items-center">
                        <input type="checkbox" name="friend" className='rounded' />
                    </div>
                </div>
            </Stack>

            <Row className='create-chat-footer d-flex justify-content-end py-3 px-4 flex-grow-1'>
                <Button variant='light' className='w-auto me-3'>Cancel</Button>
                <Button variant='primary' className='w-auto'>Create Chat</Button>
            </Row>

        </Container>
    )
}

export default CreateChat