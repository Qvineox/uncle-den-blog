import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";

import '../../../../styles/admin/post-editors.scss'
import {insertPost} from "../../../../../scripts/dataHandlers";

export default function TextPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)

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
        setFormData(post.content)
    }

    const handleSubmit = (evt) => {
        if (post.id) {
            const payload = {
                id: post.id,
                content: formData
            }

            insertPost(payload)
        }

        refreshData()
        evt.preventDefault()
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
                <Form.Group className={'post-editor__form'}>
                    <Form.Label className={'post-editor__form__label'}>Основной текст</Form.Label>
                    <Form.Control className={'post-editor__form_textarea'} onChange={handleChange}
                                  name={"text"} rows={10} as="textarea"
                                  value={formData.text}/>

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