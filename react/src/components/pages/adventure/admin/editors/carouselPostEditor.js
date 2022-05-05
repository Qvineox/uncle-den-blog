import {Fragment, useEffect, useState} from "react";
import {createPost, updatePost} from "../scripts/postHandlers";
import {Button, Card, Col, Form, ListGroup, Modal, Offcanvas, Row} from "react-bootstrap";
import {insertPost} from "../../scripts/dataHandlers";

export default function CarouselPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)
    const [selectedItem, setSelectedItem] = useState(null)

    const addCarouselItem = () => {
        setFormData(values => ({
            carouselItems: [
                ...values.carouselItems,
                {
                    title: 'Новый заголовок.',
                    description: 'Новое описание.',
                    image: '/assets/images/1600x600-placeholder.png',
                    interval: 5000
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

                    <Card className={'post-editor__card-items'}>
                        <Card.Header>Компоненты карусели</Card.Header>
                        {formData.carouselItems.length > 0 ?
                            <ListGroup variant="flush">
                                {formData.carouselItems.map((item, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <ListGroup.Item className={'post-editor__card-items__marker'}>
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

                {/* TODO: add image form support */}

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
