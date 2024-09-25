import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// import SelectDropdown from '../SelectDownButton';
import axios from 'axios';
import {Button, Col, Form, Row} from 'react-bootstrap';
import Input from '../InputComponents';
import {toast, ToastContainer} from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function FormComponentWithValidation(props) {
    const {fields, getData, action, idCurrent, onClose, api, title, dataForm} = props;

    const [formData, setFormData] = useState(() =>
        fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {})
    );

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("CREATE"+ JSON.stringify(formData));
            const url = action === 'EDIT' ? `${api}/${idCurrent}` : api;
            const method = action === 'EDIT' ? axios.put : axios.post;
            await method(url, formData);
            onClose();
            setFormData(fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {}));
            getData();
            toast.success(`${action === 'EDIT' ? 'Cập nhật' : 'Thêm mới'} thành công!`);  // Success toast
        } catch (error) {
            console.error(`Error ${action.toLowerCase()} item:`, error);
            toast.error(`Lỗi  ${action.toLowerCase()} .`);  // Error toast
        }
    };

    useEffect(() => {
        // if (action === 'EDIT' || action === 'VIEW') {
        //     axios.get(`${api}/${idCurrent}`)
        //         .then(res => setFormData(res.data))
        //         .catch(err => console.error('Error fetching data:', err));
        // }
        setFormData(dataForm)
    }, [dataForm]);
    const [selectOptions, setSelectOptions] = useState({});
    useEffect(() => {
        fields.forEach(field => {
            if (field.type === 'select' && field.apiUrl) {
                axios.get(field.apiUrl)
                    .then(res => setSelectOptions(prev => ({...prev, [field.name]: res.data})))
                    .catch(err => console.error('Error fetching select options:', err));
            }
        });
    }, [fields]);
    const renderField = (field) => {
        const commonProps = {
            key: field.name,
            md: 6, // not edit
            className: 'mb-3'
        };

        switch (field.type) {
            case 'text':
                return (
                    <Col {...commonProps}>
                        <Form.Group controlId={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Input
                                type="text"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="form-control"
                                disabled={action === 'VIEW'}
                            />
                        </Form.Group>
                    </Col>
                );
            case 'select':
                return (
                    <Col {...commonProps}>
                        <Form.Group controlId={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Select
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={action === 'VIEW'}
                            >
                                {field.defaultOption && (
                                    <option value={field.defaultOption.value}>
                                        {field.defaultOption.label}
                                    </option>
                                )}
                                {field.apiUrl && selectOptions[field.name] && selectOptions[field.name].map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                );
            case 'date':
                return (
                    <Col {...commonProps}>
                        <Form.Group controlId={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type="date"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                disabled={action === 'VIEW'}
                            />
                        </Form.Group>
                    </Col>
                );
            case 'number':
                return (
                    <Col {...commonProps}>
                        <Form.Group controlId={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type="number"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                disabled={action === 'VIEW'}
                            />
                        </Form.Group>
                    </Col>
                );
            default:
                return null;
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3 className="text-start mb-4">{title}</h3> {/* Add form title here */}
            <Row>
                {fields.map(renderField)}
            </Row>
            <div className="d-flex justify-content-center">
                <Button variant="secondary" className="me-2" type="button" onClick={() => {
                    setFormData(fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {}));
                    onClose()
                }}>Huỷ bỏ</Button>
                {action === 'VIEW'
                    ? <Button variant="primary" type="button">Chỉnh sửa</Button>
                    : <Button variant="primary" type="submit">Lưu lại</Button>
                }
            </div>
            <ToastContainer/> {/* Add ToastContainer here */}

        </Form>
    );
}

FormComponentWithValidation.defaultProps = {
    action: 'CREATE',
    onClose: () => {
    },
};

FormComponentWithValidation.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['text', 'select', 'date', 'number']).isRequired,
            label: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            apiUrl: PropTypes.string,
            defaultOption: PropTypes.shape({
                value: PropTypes.string.isRequired,
                label: PropTypes.string,
            }),
        })
    ).isRequired,
    getData: PropTypes.func.isRequired,
    action: PropTypes.oneOf(['CREATE', 'EDIT', 'VIEW']),
    idCurrent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onClose: PropTypes.func,
    api: PropTypes.string.isRequired,
};

export default FormComponentWithValidation;
