import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {createPost, updatePost} from "../scripts/postHandlers";

export default function TextPostEditor({id, content, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(content)

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setFormData(values => (
            {
                ...values,
                [name]: value
            }))
    }

    const handleReset = () => {
        setFormData(content)
    }

    const handleSubmit = () => {
        if (id) {
            updatePost(id, formData)
        } else {
            createPost('text', formData)
        }

        refreshData()
    }

    const handleClose = () => {
        setShow(false)
    }

    return (<Fragment>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Редактировать</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Fragment>
                    <Form.Group className={"form-group"}>
                        <Form.Label>Основной текст</Form.Label>
                        <Form.Control onChange={handleChange} name={"description"} rows={3} as="textarea"
                                      value={formData.description}/>
                        <Form.Text className="text-muted">
                            Основной текст блока (рекомендуется не более 250 символов).
                        </Form.Text>
                    </Form.Group>
                </Fragment>
                <div className="add-block-buttons__wrapper">
                    <Button variant="secondary" onClick={handleReset}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Сохранить изменения
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    </Fragment>)
}