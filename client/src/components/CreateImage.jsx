import React from 'react';
import { Image } from 'react-bootstrap';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { SERVER_URL } from '../config';

function CreateImage({ url, alt, width, height, rounded }) {
    return (
        <Image
            src={url !== null ? `${SERVER_URL}/${url}` : imagePlaceholder}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit: 'cover' }}
            className={rounded ? 'rounded-circle' : ''}
        />
    )
}

export default CreateImage