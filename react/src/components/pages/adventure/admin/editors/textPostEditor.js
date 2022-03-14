import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {createPost, updatePost} from "../scripts/postHandlers";

import '../../styles/admin/editors.scss'

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
        <Offcanvas show={show} onHide={handleClose} className={'post-editor'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={'post-editor__title'}>
                    Редактировать текстовый пост
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form.Group className={'form-group post-editor__form'}>
                    <Form.Label className={'post-editor__form__label'}>Основной текст</Form.Label>
                    <Form.Control className={'post-editor__form_textarea'} onChange={handleChange}
                                  name={"description"} rows={10} as="textarea"
                                  value={formData.description}/>

                    {/* TODO: add .success .error .warning class modifications */}
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется от 50 до 150 символов.
                    </Form.Text>
                </Form.Group>
                <hr className="post-editor__separator"/>
                <div className="post-editor__button-wrapper">
                    <Button variant="secondary" onClick={handleReset}>
                        Отменить
                    </Button>

                    {/* TODO: add disable function */}
                    <Button variant="primary" onClick={handleSubmit}>
                        Сохранить изменения
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    </Fragment>)
}