import {Fragment, useEffect, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";

import '../../styles/admin/editors.scss'
import {insertPost, uploadImage} from "../../scripts/dataHandlers";

export default function ImagesPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)

    const [images, setImages] = useState([])

    useEffect(() => {
        setImages(formData.images.map(image => {
            return {
                url: image.path,
                local: false,

                // needed to upload (file data, blob)
                file: null
            }
        }))
    }, [])

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setFormData(values => ({
            ...values, [name]: value
        }))
    }

    const handleImage = (evt) => {
        const files = [...evt.target.files]

        let newFiles = []

        files.forEach(file => {
            newFiles.push({
                file: file,
                url: URL.createObjectURL(file),
                local: true
            })
        })

        setImages(values => (
            [
                ...values,
                ...newFiles
            ]))
    }

    const deleteImage = (isLocal, url) => {
        setImages(values => (
            values.filter(image => image.url !== url)
        ))

        if (!isLocal) {
            setFormData(values => (
                {
                    ...values,
                    images: values.images.filter(image => image.path !== url)
                }
            ))
        }

    }

    const handleReset = () => {
        setFormData(post.content)
    }

    const handleSubmit = (evt) => {
        if (post.id && images.length > 0) {
            // upload local images
            let imagesToUpload = images.filter(image => image.local === true);
            let newImages = imagesToUpload.map(item => item.file)

            console.log(newImages)

            if (newImages?.length > 0) {
                uploadImage(newImages, post.id)
                    .catch(error => console.log(error))
                    .then(result => {
                        const payload = {
                            id: post.id, content: {
                                ...formData,
                                images:
                                    [...formData.images,
                                        ...result.data.images.map(image => {
                                            return {
                                                path: image.filePath,
                                                alt: image.fileAlt
                                            }
                                        })
                                    ]
                            }
                        }

                        insertPost(payload)
                            .catch(error => console.log(error))
                            .then(refreshData())
                    })
            } else {
                const payload = {
                    id: post.id, content: {
                        ...formData,
                        images: [...formData.images]
                    }
                }

                insertPost(payload)
                    .catch(error => console.log(error))
                    .then(refreshData())
            }
        }


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
                                  name={"text"} rows={5} as="textarea"
                                  value={formData.text}/>

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
                        {images.map((image, index) =>
                            <img onClick={() => deleteImage(image.local, image.url)}
                                 className={image.local ? 'local' : 'uploaded'} key={index} alt={`upload-${index}`}
                                 src={image.local ? image.url : `${process.env.REACT_APP_BACKEND_HOST}${image.url}`}/>)}
                    </div>
                    <Form.Text className='post-editor__form__hint'>
                        Зеленым отмечены уже загруженные изображения. Щелкните, чтобы удалить.
                    </Form.Text>
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