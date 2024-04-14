import React from 'react';
import { Image } from 'react-bootstrap';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { STATIC_RESOURCES } from '../config';

function CreateImage({ url, alt, width, height, rounded }) {
    return (
        <Image
            src={url !== null ? `${STATIC_RESOURCES}/${url}` : imagePlaceholder}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit: 'cover' }}
            className={rounded ? 'rounded-circle' : ''}
        />
    )
}

export default CreateImage