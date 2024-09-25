import React from 'react';
import InfoModal from "../ModalOvertime/InfoOvertime";

const ModalInfo = ({ isOpen, onClose, title, content }) => (
    <InfoModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        content={content}
    />
);

export default ModalInfo;