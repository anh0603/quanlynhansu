
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const InfoModal = ({ isOpen, onClose, title, content }) => {
    return (
        <Modal show={isOpen} onHide={onClose} className="modal_Liability">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            {/*<Modal.Footer>*/}
            {/*    <Button variant="secondary">Close</Button>*/}
            {/*</Modal.Footer>*/}
        </Modal>
    );
};

InfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    content: PropTypes.node
};

export default InfoModal;

