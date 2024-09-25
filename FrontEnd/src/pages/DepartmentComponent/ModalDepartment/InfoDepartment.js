import {Button, Modal} from "react-bootstrap";
import PropTypes from "prop-types";


const InfoModal = ({ isOpen, onClose, title, content,className }) => {
    return (
        <Modal show={isOpen} onHide={onClose} className={className}>
            <Modal.Header closeButton={true}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

InfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    content: PropTypes.node,
    className: PropTypes.string
};

export default InfoModal;
