import {Fragment, useEffect, useState} from "react";
import {Button, Card, Col, Form, ListGroup, Modal, Offcanvas, Row} from "react-bootstrap";
import {insertPost, uploadImage} from "../../../../../scripts/dataHandlers";

export default function CarouselPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState({
        id: post.id,
        order: post.order,
        carouselItems: post.content.carouselItems.map((item, index) => ({
            title: item.title,
            description: item.description,
            interval: item.interval,
            image: {
                path: item.image.path,
                alt: item.image.alt,
                interval: item.image.interval,

                // for properties stored locally; delete before fetch
                local: false,
                data: null
            }
        }))
    })

    const [selectedItem, setSelectedItem] = useState(null)

    const addCarouselItem = () => {
        setFormData(values => ({
            ...values,
            carouselItems: [
                ...values.carouselItems,
                {
                    title: 'Новый заголовок.',
                    description: 'Новое описание.',
                    interval: 5000,
                    image: {
                        path: null,
                        alt: null,

                        // for properties stored locally; delete before fetch
                        local: true,
                        data: null
                    }
                }
            ]
        }))
    }

    const removeCarouselItem = (index) => {
        let items = formData.carouselItems
        items.splice(index, 1)

        setFormData(values => ({
            ...values, carouselItems: items
        }))
    }

    const handleReset = () => {
        setFormData(post.content)
    }

    const handleSubmit = (evt) => {
        if (post.id && formData.carouselItems.length > 0) {
            let payload = {
                id: post.id,
                content: {
                    carouselItems: formData.carouselItems.map(item => ({
                        title: item.title,
                        description: item.description,
                        interval: item.interval,
                        image: {
                            path: item.image.path,
                            interval: item.image.interval,
                            local: item.image.local,
                            alt: item.image.alt
                        }
                    }))

                }
            }
            let imagesPayload = []

            formData.carouselItems.forEach((item, index) => {
                // check if image needs to be uploaded
                if (item.image.local && item.image.data) {
                    imagesPayload.push(item.image.data)
                }
            })

            if (imagesPayload.length > 0) {
                uploadImage(imagesPayload, post.id)
                    .catch(error => console.log(error))
                    .then(result => {
                        payload.content.carouselItems.forEach((item, index) => {
                            if (item.image.local) {
                                let {filePath, fileAlt} = result.data.images.shift()

                                payload.content.carouselItems[index].image = {
                                    path: filePath,
                                    alt: fileAlt,
                                }
                            } else {
                                payload.content.carouselItems[index].image = {
                                    path: payload.content.carouselItems[index].image.path,
                                    alt: payload.content.carouselItems[index].image.alt,
                                }
                            }
                        })
                    })
            }

            insertPost(payload)
                .catch(error => alert(error))
                .then(refreshData())

        }

        evt.preventDefault()
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        <Fragment>
            <Offcanvas show={show} onHide={handleClose} className={'post-editor'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className={'post-editor__title'}>Редактировать карусель</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <CarouselPostItemEditor formData={formData}
                                            setFormData={setFormData}
                                            selectedItem={selectedItem}
                                            setSelectedItem={setSelectedItem}/>

                    <Card className={'post-editor__carousel-items'}>
                        <Card.Header>Компоненты карусели</Card.Header>
                        {formData.carouselItems.length > 0 ?
                            <ListGroup variant="flush">
                                {formData.carouselItems.map((item, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <ListGroup.Item className={'post-editor__carousel-items__item'}>
                                                <Row>
                                                    <Col md={10}>
                                                        <h5 className={'post-editor__card-items__marker__title'}>
                                                            {item.title}
                                                        </h5>
                                                    </Col>
                                                    <Col md={2} className={'post-editor__card-items__marker-manage'}>
                                                        <img alt={'edit'} onClick={() => setSelectedItem(i)}
                                                             src={process.env.PUBLIC_URL + '/assets/icons/edit.svg'}/>
                                                        <img alt={'remove'} onClick={() => removeCarouselItem(i)}
                                                             src={process.env.PUBLIC_URL + '/assets/icons/delete.svg'}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <div className={'post-editor__card-items__marker__description'}>
                                                            {item.description}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        {item.image.path ?
                                                            <img className={item.image.local ? 'local' : 'uploaded'}
                                                                 alt={item.image.alt}
                                                                 src={item.image.local ? item.image.path : `${process.env.REACT_APP_BACKEND_HOST}${item.image.path}`}/>
                                                            :
                                                            <div className={'local'}>
                                                                <i>Изображение отсутствует.</i>
                                                            </div>}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </Fragment>
                                    )
                                })
                                }
                            </ListGroup>
                            :
                            <Card.Body className="text-center">
                                <Card.Title>Пусто</Card.Title>
                            </Card.Body>
                        }
                        <Card.Footer>
                            <div className={"flex-center"}>
                                <Button onClick={addCarouselItem} variant="outline-success">Добавить</Button>
                            </div>
                        </Card.Footer>
                    </Card>

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

const CarouselPostItemEditor = ({formData, setFormData, selectedItem, setSelectedItem}) => {
    const [show, setShow] = useState(false)
    const [itemData, setItemData] = useState(null)

    useEffect(() => {
        if (selectedItem !== null) {
            setItemData(formData.carouselItems[selectedItem])
            setShow(true)
        } else {
            setShow(false)
        }
    }, [selectedItem])

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setItemData(values => (
            {
                ...values,
                [name]: value
            }))
    }

    const handleImage = (evt) => {
        const file = evt.target.files[0]

        setItemData(values => ({
            ...values,
            image: {
                path: URL.createObjectURL(file),
                local: true,
                data: file
            }
        }))
    }

    const handleClose = () => {
        setSelectedItem(null)
    }

    const handleSubmit = () => {
        let items = formData.carouselItems

        items[selectedItem] = itemData

        setFormData(values => (
            {
                ...values,
                carouselItems: items
            }
        ))

        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose} className={'modal-form'}>
            <Modal.Header closeButton>
                <Modal.Title className={'modal-form__title'}>Изменение записи</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Заголовок</Form.Label>
                    <Form.Control className={"modal-form__form__text"} onChange={handleChange} name={"title"}
                                  type={'text'}
                                  value={itemData?.title}/>
                    <Form.Text className='modal-form__form__hint'>
                        Рекомендуется не более 5 слов.
                    </Form.Text>
                </Form.Group>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Описание</Form.Label>
                    <Form.Control className={"modal-form__form__textarea"}
                                  onChange={handleChange} name={"description"} rows={3} as={'textarea'}
                                  value={itemData?.description}/>
                    <Form.Text className='modal-form__form__hint'>
                        Рекомендуется до 50 символов.
                    </Form.Text>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Изображение</Form.Label>
                    <Form.Control className={'post-editor__form_image'} type="file" onChange={handleImage}/>
                    <Form.Text className='post-editor__form__hint'>
                        Изображение с устройства.
                    </Form.Text>
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Сохранить изменения
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
