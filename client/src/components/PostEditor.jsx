import React, { useState } from 'react';
import { Form, FloatingLabel, Image } from 'react-bootstrap';

import { useAuth } from './AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function PostEditor() {
    const [value, setValue] = useState('');
    const { authUser } = useAuth();

    return (
        <Form className='post-editor'>
            <Image
                src={authUser.avatarUrl || imagePlaceholder}
                alt='profile'
                roundedCircle
            />
            <FloatingLabel controlId="floatingTextarea" label="What's new?">
                <Form.Control
                    as="textarea"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="What's new?"
                    style={{ minHeight: '135px' }}
                />
            </FloatingLabel>
        </Form>
    );
}

export default PostEditor;