import {Fragment, useEffect, useState} from "react";
import {createPost, updatePost} from "../scripts/postHandlers";
import {Button, Card, Col, Form, ListGroup, Modal, Offcanvas, Row} from "react-bootstrap";

export function MapPostEditor({id, content, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(content)
    const [selectedItem, setSelectedItem] = useState(null)

    const addMarkerItem = () => {
        setFormData(values => ({
            ...values,
            markers: [
                ...values.markers,
                {
                    title: 'Новый заголовок.',
                    description: 'Новое описание.',
                    position: {lat: 0, lng: 0},
                    visible: true,
                    image: '/assets/images/600x200-placeholder.png'
                }
            ]
        }))
    }

    const handleReset = () => {
        setFormData(content)
    }

    const handleSubmit = (evt) => {
        if (id) {
            updatePost(id, formData)
        } else {
            createPost('map', formData)
        }

        refreshData()
        evt.preventDefault()
    }

    const handleClose = () => {
        setShow(false)
    }

    return (<Fragment>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Редактировать</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <MapPostMarkerEditor formData={formData} setFormData={setFormData} selectedItem={selectedItem}
                                     setSelectedItem={setSelectedItem}/>

                <Card style={{width: '100%', marginTop: '2vh'}}>
                    <Card.Header>Компоненты карты</Card.Header>
                    {formData.markers.length > 0 ?
                        <ListGroup variant="flush">
                            {formData.markers.map((marker, i) => {
                                return (
                                    <Fragment key={i}>
                                        {/* TODO: Add edit and delete buttons (icons) */}
                                        <ListGroup.Item onClick={() => setSelectedItem(i)}>
                                            <Row>
                                                <Col md={8}>
                                                    <h5>{marker.title}</h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div style={{maxHeight: '20vh', overflowY: 'visible'}}>
                                                        {marker.description}
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
                            <Button onClick={addMarkerItem} variant="outline-success">Добавить</Button>
                        </div>
                    </Card.Footer>
                </Card>
                <div className="add-block-buttons__wrapper">
                    <Button onClick={handleSubmit} variant={"success"} className={"add-block-button"}>
                        Сохранить пост
                    </Button>
                    <Button onClick={handleReset} variant={"danger"} className={"add-block-button"}>
                        Отменить
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

        setItemData(values => (
            {
                ...values,
                [name]: value
            }))
    }

    // TODO: error handling, accuracy check
    const handleCoordinates = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        if (name === 'latitude') {
            if (value <= 90 && value >= -90) {
                setItemData(values => (
                    {
                        ...values,
                        position: {
                            lat: value,
                            lng: values.position.lng
                        }
                    }))
            }
        } else if (name === 'longitude') {
            if (value <= 180 && value >= -180) {
                setItemData(values => (
                    {
                        ...values,
                        position: {
                            lat: values.position.lat,
                            lng: value
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
            title: itemData.title,
            description: itemData.description,
            position: {
                lat: parseFloat(itemData.position.lat).toFixed(5),
                lng: parseFloat(itemData.position.lng).toFixed(5),
            }
        }

        setFormData(values => (
            {
                ...values,
                markers: items
            }
        ))

        handleClose()
    }

    // TODO: fix form for new marker addition
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение записи</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className={"form-group"}>
                    <Form.Label>Заголовок</Form.Label>
                    <Form.Control onChange={handleChange} name={"title"} type={'text'}
                                  value={itemData?.title}/>
                </Form.Group>
                <Form.Group className={"form-group"}>
                    <Form.Label>Описание</Form.Label>
                    <Form.Control onChange={handleChange} name={"description"} rows={3} as={'textarea'}
                                  value={itemData?.description}/>
                </Form.Group>

                <Form.Group className={"form-group"}>
                    <Form.Label>Широта</Form.Label>
                    <Form.Control onChange={handleCoordinates} name={"latitude"} type={'float'}
                                  value={itemData?.position.lat}/>
                    <Form.Label>Долгота</Form.Label>
                    <Form.Control onChange={handleCoordinates} name={"longitude"} type={'float'}
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
        </Modal>
    )
}