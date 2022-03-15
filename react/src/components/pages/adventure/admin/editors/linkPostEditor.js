import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {createPost, updatePost} from "../scripts/postHandlers";

import '../../styles/admin/editors.scss'

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
        <Offcanvas show={show} onHide={handleClose} className={'post-editor'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={'post-editor__title'}>Редактировать ссылку</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Заголовок</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange} name={"title"} type={'text'}
                                  value={formData.title}/>
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется использовать от 1 до 3 слов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Описание</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange} name={"description"} rows={2} as="textarea"
                                  value={formData.description}/>
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется использовать менее 5 слов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Ссылка</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange} name={"link"} type={'text'}
                                  value={formData.link}/>
                    <Form.Text className='post-editor__form__hint'>
                        Внутренная или внешняя ссылка.
                    </Form.Text>
                </Form.Group>

                {/* TODO: image form support */}

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