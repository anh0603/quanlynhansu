import React from 'react';
import InfoModal from "../ModalTimeOff/InfoTimeOff";

const ModalInfo = ({ isOpen, onClose, title, content }) => (
    <InfoModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        content={content}
    />
);

export default ModalInfo;