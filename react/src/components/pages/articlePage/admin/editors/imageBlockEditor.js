import {Fragment, useEffect, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";

import '../../../../styles/admin/post-editors.scss'
import {insertPost, uploadImage} from "../../../../../scripts/dataHandlers";

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
            uploadImage(images, post.id)
                .catch(error => console.log(error))
                .then(result => {
                    console.log(result.data)

                    const payload = {
                        id: post.id, content: {
                            ...formData,
                            path: result.data.images[0].filePath,
                            alt: result.data.images[0].fileAlt,
                        }
                    }

                    insertPost(payload)
                        .catch(error => console.log(error))
                        .then(refreshData())
                })
        }


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
                    ?????????????????????????? ?????????????????? ????????
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form.Group className={'post-editor__form'}>
                    <Form.Label className={'post-editor__form__label'}>???????????????? ??????????</Form.Label>
                    <Form.Control className={'post-editor__form_textarea'} onChange={handleChange}
                                  name={"text"} rows={5} as="textarea"
                                  value={formData.text}/>

                    {/* TODO: add .success .error .warning class modifications */}
                    <Form.Text className='post-editor__form__hint'>
                        ?????????????????????????? ???? 20 ???? 50 ????????????????.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>??????????????????????</Form.Label>
                    <Form.Control className={'post-editor__form_image'} type="file" onChange={handleImage}/>
                    <Form.Text className='post-editor__form__hint'>
                        ?????????????????????? ?? ????????????????????.
                    </Form.Text>
                </Form.Group>

                {images.length > 0 && <div className={"image-preview"}>
                    <p>?????????????????????? ??????????????????????</p>
                    <div className={"image-preview__uploads"}>
                        {imageURLs.map((imageSrc, index) => <img key={index} alt={`upload-${index}`}
                                                                 src={imageSrc}/>)}
                    </div>
                </div>}

                <hr className="post-editor__separator"/>

                <div className="post-editor__button-wrapper">
                    <Button variant="secondary" onClick={handleReset}>
                        ????????????????
                    </Button>

                    {/* TODO: add disable function */}
                    <Button variant="primary" onClick={handleSubmit}>
                        ?????????????????? ??????????????????
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    </Fragment>)
}