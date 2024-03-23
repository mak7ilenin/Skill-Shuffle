import { useState, useEffect } from 'react';
import { Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { SERVER_URL } from '../config';
import { AESEncrypt } from '../crypto';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function MessageNotification({ visible, notification }) {
    const [show, setShow] = useState(visible);
    const navigate = useNavigate();

    // Hide the alert after 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false);
        }, 5000);

        // Clear the timeout when component unmounts or when show is false
        return () => clearTimeout(timeout);
    }, [show]);

    return (
        <Alert
            variant="light"
            show={show}
            onClose={() => setShow(false)}
            onClick={() => {
                setShow(false);
                navigate(`/messenger?c=${AESEncrypt(notification.chat.id.toString())}`);
            }}
            dismissible
            className='alert-notification d-flex flex-column align-items-center'
        >
            <Alert.Heading>{notification.message}</Alert.Heading>
            <hr />
            <div className="alert-message d-flex flex-column flex-md-row align-items-center">
                <Image
                    src={notification.chat.avatar_url ? `${SERVER_URL}/${notification.chat.avatar_url}` : imagePlaceholder}
                    width={35}
                    height={35}
                    alt={notification.chat.name}
                    style={{ objectFit: 'cover' }}
                    roundedCircle
                />
                <div>
                    <h5>{notification.sender.first_name}</h5>
                    <span>{notification.content}</span>
                </div>
            </div>
        </Alert>
    );
}

export default MessageNotification;
