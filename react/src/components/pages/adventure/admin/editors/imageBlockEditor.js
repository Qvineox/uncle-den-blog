import {Fragment, useEffect, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";

import '../../styles/admin/editors.scss'
import {insertPost, uploadImage} from "../../scripts/dataHandlers";

export default function ImagePostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)

    const [images, setImages] = useState([])
    const [imageURLs, setImagesURLs] = useState([])

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setFormData(values => ({
            ...values, [name]: value
        }))
    }

    const handleImage = (evt) => {
        setImages([...evt.target.files])
    }

    const handleReset = () => {
        setFormData(post.content)
    }

    const handleSubmit = (evt) => {

        if (post.id && images.length > 0) {
            console.log(images[0])
            uploadImage(images[0], post.id)
                .catch(error => console.log(error))
                .then(result => {
                    console.log(result.data)

                    const payload = {
                        id: post.id, content: {
                            ...formData, image: result.data.filePath, alt: result.data.fileAlt,
                        }
                    }

                    insertPost(payload)
                })
        }

        refreshData()
        evt.preventDefault()
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

                {images.length > 0 && <div className={"image-preview"}>
                    <p>Загружаемые изображения</p>
                    <div className={"image-preview__uploads"}>
                        {imageURLs.map((imageSrc, index) => <img key={index} alt={`upload-${index}`}
                                                                 src={imageSrc}/>)}
                    </div>
                </div>}

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