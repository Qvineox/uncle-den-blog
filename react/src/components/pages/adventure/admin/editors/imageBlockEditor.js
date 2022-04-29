import {Fragment, useEffect, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {updateImagePost} from "../scripts/postHandlers";

import '../../styles/admin/editors.scss'

export default function ImagePostEditor({id, content, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(content)

    const [images, setImages] = useState([])
    const [imageURLs, setImagesURLs] = useState([])

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setFormData(values => (
            {
                ...values,
                [name]: value
            }))
    }

    const handleImage = (evt) => {
        setImages([...evt.target.files])
    }

    const handleReset = () => {
        setFormData(content)
    }

    const handleSubmit = () => {
        if (id) {
            updateImagePost(id, formData, images)
        }

        refreshData()
    }

    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        if (images.length > 0) {
            const imagesURLs = []
            images.forEach(image => imagesURLs.push(URL.createObjectURL(image)))
            setImagesURLs(imagesURLs)
        }

    }, [images])

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
                                  name={"description"} rows={5} as="textarea"
                                  value={formData.description}/>

                    {/* TODO: add .success .error .warning class modifications */}
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется от 20 до 50 символов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Изображение</Form.Label>
                    <Form.Control className={'post-editor__form_image'} multiple type="file" onChange={handleImage}/>
                    <Form.Text className='post-editor__form__hint'>
                        Изображение с устройства.
                    </Form.Text>
                </Form.Group>

                {images.length > 0 &&
                    <div className={"image-preview"}>
                        <p>Загружаемые изображения</p>
                        <div className={"image-preview__uploads"}>
                            {imageURLs.map((imageSrc, index) => <img key={index} alt={`upload-${index}`}
                                                                     src={imageSrc}/>)}
                        </div>
                    </div>
                }

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