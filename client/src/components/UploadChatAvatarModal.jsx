import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

function UploadChatAvatarModal({ showModal, setShowModal, setImageURL, setImageBlob }) {

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png']
        },
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = () => {
                setImageBlob(file);
                setImageURL(reader.result);
            };

            reader.readAsDataURL(file);
            setShowModal(false);
        }
    });

    return (
        <Modal className='upload-modal' show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Upload new photo</Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center align-items-center flex-column py-4'>
                <p className='mb-4'>
                    Add a photo to the chat so you and your friends can find it more easily.
                    <br /> You can upload an image in JPG, GIF or PNG format.
                </p>
                <Button variant='primary' title='add-file' className='px-4 align-items-center d-flex' {...getRootProps()}>
                    Select file
                    <input {...getInputProps()} />
                </Button>
            </Modal.Body>
            <Modal.Footer className='justify-content-center'>
                If you have any problems with your upload, try using a smaller photo.
            </Modal.Footer>
        </Modal>
    )
}

export default UploadChatAvatarModal