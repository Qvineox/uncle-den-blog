import {Fragment, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";

import '../../styles/admin/editors.scss'
import {insertPost, uploadImage} from "../../scripts/dataHandlers";

export default function LinkPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState({
        order: post.order,
        content: {
            title: post.content.title,
            description: post.content.description,
            link: post.content.link,
            image: {
                path: post.content.image.path,
                alt: post.content.image.alt,

                // for properties stored locally; delete before fetch
                local: false,
                data: null
            }
        }
    })


    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setFormData(values => (
            {
                ...values,
                content: {
                    ...values.content,
                    [name]: value
                }
            }))
    }

    const handleReset = () => {
        setFormData(post.content)
    }

    const handleImage = (evt) => {
        const file = evt.target.files[0]

        setFormData(values => ({
            ...values,
            content: {
                ...values.content,
                image: {
                    local: true,
                    data: file,
                    path: URL.createObjectURL(file),
                }
            }
        }))
    }

    const handleSubmit = (evt) => {
        let payload = {
            id: post.id,
            content: {
                ...formData.content,
            }
        }

        if (post.id) {
            if (formData.content.image.local) {
                uploadImage([formData.content.image.data], post.id)
                    .catch(error => alert(error))
                    .then(result => {
                        let {filePath, fileAlt} = result.data.images[0]

                        payload.content.image = {
                            path: filePath,
                            alt: fileAlt
                        }

                        insertPost(payload)
                            .catch(error => alert(error))
                            .then(refreshData())
                    })
            } else {
                delete payload.content.image.local
                delete payload.content.image.data

                insertPost(payload)
                    .catch(error => alert(error))
                    .then(refreshData())
            }

            evt.preventDefault()
        }
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
                                  value={formData.content.title}/>
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется использовать от 1 до 3 слов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Описание</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange} name={"description"} rows={2} as="textarea"
                                  value={formData.content.description}/>
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется использовать менее 5 слов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Ссылка</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange} name={"link"} type={'text'}
                                  value={formData.content.link}/>
                    <Form.Text className='post-editor__form__hint'>
                        Внутренная или внешняя ссылка.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Изображение</Form.Label>
                    <Form.Control className={'post-editor__form_image'} type="file" onChange={handleImage}/>
                    <Form.Text className='post-editor__form__hint'>
                        Изображение с устройства.
                    </Form.Text>
                </Form.Group>

                <div className="modal-form__image">
                    {formData.content.image.path ?
                        <img className={formData.content.image.local ? 'local' : 'uploaded'}
                             alt={formData.content.image.alt}
                             src={formData.content.image.local ? formData.content.image.path : `${process.env.REACT_APP_BACKEND_HOST}${formData.content.image.path}`}/>
                        :
                        <div className={'local'}>
                            <i>Изображение отсутствует.</i>
                        </div>}
                </div>

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