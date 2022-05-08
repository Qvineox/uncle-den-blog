import {Fragment, useEffect, useState} from "react";
import {Button, Card, Col, Form, ListGroup, Offcanvas, Row} from "react-bootstrap";
import {ACTIONS} from "../blocks";

export default function BlockEditor({newBlock, handleBlock, manager}) {

    // determine if you need to show
    const [show, setShow] = useState(false)
    useEffect(() => {
        if (newBlock) {
            setShow(true)


        } else {
            setShow(false)
        }
    }, [newBlock])

    const handleSubmit = async (evt) => {

        // refresh state to fetch new data
        await manager.commitBlock(newBlock)
        handleClose()

        evt.preventDefault()
    }

    const handleClose = () => {
        handleBlock({action: ACTIONS.CLEAR})
    }

    const handleReset = () => {
    //    TODO: handle reset functionality
    }

    const RenderForm = ({type, content}) => {
        const [newBlock, setNewBlock] = useState(content)

        const handleChange = (evt) => {
            const name = evt.target.name;
            const value = evt.target.value;

            setNewBlock(values => ({...values, [name]: value}))
        }

        switch (type) {
            case ACTIONS.ADD_TEXT_BLOCK:
                return (
                    <Fragment>
                        <Form.Group className={"form-group"}>
                            <Form.Label>Основной текст</Form.Label>
                            <Form.Control onChange={handleChange} name={"description"} rows={3} as="textarea"
                                          value={newBlock.description}/>
                            <Form.Text className="text-muted">
                                Основной текст блока (рекомендуется не более 250 символов).
                            </Form.Text>
                        </Form.Group>
                    </Fragment>
                )
            case ACTIONS.ADD_IMAGE_BLOCK:
                // TODO: Add image form support
                return (
                    <Fragment/>
                )
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
            case ACTIONS.ADD_MAP_BLOCK:
                const addMarker = () => {

                }

                const removeMarker = () => {

                }

                return (
                    <Fragment>
                        <Card style={{width: '100%', marginTop: '2vh'}}>
                            <Card.Header>Маркеры на карте</Card.Header>
                            {newBlock.markers.length > 0 ?
                                <ListGroup variant="flush">
                                    {newBlock.markers.map((marker, i) => {
                                        return (
                                            <Fragment key={i}>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <h6>{marker.title}</h6>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={6}>
                                                            LAT: {marker.position.lat}<br/>
                                                            LNG: {marker.position.lng}<br/>
                                                        </Col>
                                                        <Col md={6}>
                                                            DESC: {marker.description ? "YES" : "EMPTY"}<br/>
                                                            IMAGE: {marker.image ? "YES" : "NO"}
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            VISIBLE: {marker.visible ? "YES" : "NO"}
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
                                </Card.Body>}
                            <Card.Footer>
                                <div className={"flex-center"}>
                                    {/* TODO: Add image form for markers */}
                                    <Button onClick={() => addMarker()} variant="outline-success">Добавить</Button>
                                    <Button onClick={() => removeMarker()}
                                            variant="outline-danger">Убрать элемент</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Fragment>
                )
            case ACTIONS.ADD_ACCORDION_BLOCK:
                const addAccordionItem = () => {

                }

                const removeAccordionItem = () => {

                }

                return (
                    <Fragment>
                        <Card style={{width: '100%', marginTop: '2vh'}}>
                            <Card.Header>Компоненты аккордиона</Card.Header>
                            {newBlock.accordionItems.length > 0 ?
                                <ListGroup variant="flush">
                                    {newBlock.accordionItems.map((marker, i) => {
                                        return (
                                            <Fragment key={i}>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <h4>{marker.title}</h4>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div style={{maxHeight: '20vh', overflowY: 'scroll'}}>
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
                                    <Button onClick={addAccordionItem} variant="outline-success">Добавить</Button>
                                    <Button onClick={removeAccordionItem} variant="outline-danger">Убрать
                                        элемент</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Fragment>
                )
            case ACTIONS.ADD_LINK_BLOCK:
                return (
                    <Form.Group className={"form-group"}>
                        <Form.Group className={"form-group"}>
                            <Form.Label>Заголовок</Form.Label>
                            <Form.Control onChange={handleChange} type="text" value={newBlock.title}/>
                        </Form.Group>

                        <Form.Group className={"form-group"}>
                            <Form.Label>Основной текст</Form.Label>
                            <Form.Control onChange={handleChange} name={"description"} rows={3} as="textarea"
                                          value={newBlock.description}/>
                            <Form.Text className="text-muted">
                                Основной текст блока (рекомендуется не более 250 символов).
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className={"form-group"}>
                            <Form.Label>Ссылка</Form.Label>
                            <Form.Control onChange={handleChange} name={"link"} type="text" value={newBlock.link}/>
                        </Form.Group>
                    </Form.Group>
                )
        }
    }

    return (
        <Fragment>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Редактировать</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={evt => handleSubmit(evt)} onReset={handleReset} className={'admin editor'}>
                        {newBlock &&
                            <RenderForm type={newBlock.type} content={newBlock.content}/>
                        }
                        <div className="add-block-buttons__wrapper">
                            <Button type={"submit"} variant={"success"} className={"add-block-button"}>
                                Сохранить пост
                            </Button>
                            <Button type={"reset"} variant={"danger"} className={"add-block-button"}>
                                Очистить
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Fragment>
    )
}

