import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {createPost, updatePost} from "../scripts/postHandlers";

export default function LinkPostEditor({id, content, show, setShow, refreshData}) {
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
            createPost('link', formData)
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
                        <Form.Label>Заголовок</Form.Label>
                        <Form.Control onChange={handleChange} name={"title"} type={'text'}
                                      value={formData.title}/>
                    </Form.Group>
                    <Form.Group className={"form-group"}>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control onChange={handleChange} name={"description"} rows={2} as="textarea"
                                      value={formData.description}/>
                    </Form.Group>
                    <Form.Group className={"form-group"}>
                        <Form.Label>Ссылка</Form.Label>
                        <Form.Control onChange={handleChange} name={"link"} type={'text'}
                                      value={formData.link}/>
                    </Form.Group>

                    {/* TODO: image form support */}
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