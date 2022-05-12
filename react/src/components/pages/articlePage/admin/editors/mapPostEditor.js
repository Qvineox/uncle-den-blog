import {Fragment, useEffect, useState} from "react";
import {Button, Card, Col, Form, ListGroup, Modal, Offcanvas, Row} from "react-bootstrap";

import '../../../../styles/admin/post-editors.scss'
import {insertPost} from "../../../../../scripts/dataHandlers";

export function MapPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)
    const [selectedItem, setSelectedItem] = useState(null)

    const addMarkerItem = () => {
        setFormData(values => ({
            ...values, markers: [...values.markers, {
                title: 'Новый заголовок.',
                description: 'Новое описание.',
                position: {lat: 0, lng: 0},
                visible: true,
                image: '/assets/images/600x200-placeholder.png'
            }]
        }))
    }

    const removeMarkerItem = (index) => {
        let items = formData.markers
        items.splice(index, 1)

        setFormData(values => ({
            ...values, markers: items
        }))
    }

    const handleReset = () => {
        setFormData(post.content)
    }

    const handleSubmit = (evt) => {
        if (post.id) {
            let payload = {
                id: post.id,
                content: {
                    ...formData,
                    zoom: parseInt(formData.zoom),
                    center: {
                        lat: parseFloat(formData.center.lat), lng: parseFloat(formData.center.lng)
                    }
                }
            }

            insertPost(payload)
        }

        refreshData()
        evt.preventDefault()
    }

    const handleZoom = (evt) => {
        const value = evt.target.value;

        if (value <= 10 && value >= 1) {
            setFormData(values => ({
                ...values, zoom: value
            }))
        }
    }

    const handleCoordinates = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        if (name === 'latitude') {
            if (value <= 90 && value >= -90) {
                setFormData(values => ({
                    ...values, center: {
                        lat: value, lng: values.center.lng
                    }
                }))
            }
        } else if (name === 'longitude') {
            if (value <= 180 && value >= -180) {
                setFormData(values => ({
                    ...values, center: {
                        lat: values.center.lat, lng: value
                    }
                }))
            }
        }

    }

    const handleClose = () => {
        setShow(false)
    }

    return (<Fragment>
        <Offcanvas show={show} onHide={handleClose} className={'post-editor'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={'post-editor__title'}>Редактировать карту</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <MapPostMarkerEditor formData={formData} setFormData={setFormData} selectedItem={selectedItem}
                                     setSelectedItem={setSelectedItem}/>

                <Form.Group className={'post-editor__form'}>
                    <Form.Label className={'post-editor__form__label'}>Центр</Form.Label>


                    {/* TODO: add .success .error .warning class modifications */}
                    <div className="post-editor__form_coordinates">
                        <Form.Label className={'post-editor__form_coordinates__label'}>Широта</Form.Label>
                        <Form.Control className={'post-editor__form_coordinates__input'}
                                      onChange={handleCoordinates}
                                      name={"latitude"} type={'float'}
                                      value={formData.center.lat}/>

                        <Form.Label className={'post-editor__form_coordinates__label'}>Долгота</Form.Label>
                        <Form.Control className={'post-editor__form_coordinates__input'}
                                      onChange={handleCoordinates}
                                      name={"longitude"} type={'float'}
                                      value={formData.center.lng}/>
                    </div>
                </Form.Group>

                <Form.Group className={'post-editor__form'}>
                    <Form.Label className={'post-editor__form__label'}>Приближение</Form.Label>

                    <Form.Control className={'post-editor__form_number'} onChange={handleZoom}
                                  name={"zoom"} type={'number'}
                                  value={formData.zoom}/>

                    {/* TODO: add .success .error .warning class modifications */}
                    <Form.Text className='post-editor__form__hint'>
                        Рекомендуется значение от 3 до 7.
                    </Form.Text>
                </Form.Group>

                <Card className={'post-editor__card-items'}>
                    <Card.Header>Компоненты карты</Card.Header>
                    {formData.markers.length > 0 ? <ListGroup variant="flush">
                        {formData.markers.map((marker, i) => {
                            return (<Fragment key={i}>
                                <ListGroup.Item className={'post-editor__card-items__marker'}>
                                    <Row>
                                        <Col md={10}>
                                            <h5 className={'post-editor__card-items__marker__title'}>
                                                {marker.title}
                                            </h5>
                                        </Col>
                                        <Col md={2} className={'post-editor__card-items__marker-manage'}>
                                            <img alt={'edit'} onClick={() => setSelectedItem(i)}
                                                 src={process.env.PUBLIC_URL + '/assets/icons/edit.svg'}/>
                                            <img alt={'remove'} onClick={() => removeMarkerItem(i)}
                                                 src={process.env.PUBLIC_URL + '/assets/icons/delete.svg'}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className={'post-editor__card-items__marker__details'}>
                                                {marker.position.lat}, {marker.position.lng}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className={'post-editor__card-items__marker__description'}>
                                                {marker.description}
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </Fragment>)
                        })}
                    </ListGroup> : <Card.Body className="text-center">
                        <Card.Title>Пусто</Card.Title>
                    </Card.Body>}
                    <Card.Footer>
                        <div className={"flex-center"}>
                            <Button onClick={addMarkerItem} variant="outline-success">Добавить маркер</Button>
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

    export const MapPostMarkerEditor = ({formData, setFormData, selectedItem, setSelectedItem}) => {
        const [show, setShow] = useState(false)
        const [itemData, setItemData] = useState(null)

        useEffect(() => {
            if (selectedItem !== null) {
                setItemData(formData.markers[selectedItem])
                setShow(true)
            } else {
                setShow(false)
            }
        }, [selectedItem])

        const handleChange = (evt) => {
            const name = evt.target.name;
            const value = evt.target.value;

            setItemData(values => ({
                ...values, [name]: value
            }))
        }

        const handleCoordinates = (evt) => {
            const name = evt.target.name;
            const value = evt.target.value;

            if (name === 'latitude') {
                if (value <= 90 && value >= -90) {
                    setItemData(values => ({
                        ...values, position: {
                            lat: value, lng: values.position.lng
                        }
                    }))
                }
            } else if (name === 'longitude') {
                if (value <= 180 && value >= -180) {
                    setItemData(values => ({
                        ...values, position: {
                            lat: values.position.lat, lng: value
                        }
                    }))
                }
            }

        }

        const handleClose = () => {
            setSelectedItem(null)
        }

        const handleSubmit = () => {
            let items = formData.markers

            items[selectedItem] = {
                title: itemData.title, description: itemData.description, position: {
                    lat: parseFloat(itemData.position.lat), lng: parseFloat(itemData.position.lng),
                }
            }

            setFormData(values => ({
                ...values, markers: items
            }))

            handleClose()
        }

        return (<Modal show={show} onHide={handleClose} className={'modal-form'}>
            <Modal.Header closeButton>
                <Modal.Title className={'modal-form__title'}>Изменение маркера</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Заголовок</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange}
                                  name={"title"}
                                  type={'text'}
                                  value={itemData?.title}/>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Описание</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange}
                                  name={"description"}
                                  rows={3}
                                  as={'textarea'}
                                  value={itemData?.description}/>
                </Form.Group>

                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Широта</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleCoordinates}
                                  name={"latitude"}
                                  type={'float'}
                                  value={itemData?.position.lat}/>
                </Form.Group>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Долгота</Form.Label>
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleCoordinates}
                                  name={"longitude"}
                                  type={'float'}
                                  value={itemData?.position.lng}/>
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
        </Modal>)
    }