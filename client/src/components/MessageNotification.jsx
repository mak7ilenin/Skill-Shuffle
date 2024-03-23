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
            variant="info"
            show={show}
            onClose={() => setShow(false)}
            dismissible
            className='alert-notification d-flex flex-column justify-content-center align-items-center'
        >
            <Alert.Heading>{notification.message}</Alert.Heading>
            <hr />
            <div className="alert-message d-flex flex-column flex-md-row align-items-center justify-content-between"
                onClick={() => {
                    setShow(false);
                    navigate(`/messenger?c=${AESEncrypt(notification.chat.id.toString())}`);
                }}
            >
                <Image
                    src={notification.chat.avatar_url ? `${SERVER_URL}/${notification.chat.avatar_url}` : imagePlaceholder}
                    width={35}
                    height={35}
                    alt={notification.chat.name}
                    roundedCircle
                />
                <div>
                    <h5>{notification.content}</h5>
                    <span>A few seconds ago</span>
                </div>
            </div>
        </Alert>
    );
}

export default MessageNotification;
