import {Fragment, useState} from "react";
import {MapPostMarkerEditor} from "./mapPostEditor"
import {Button, Card, Col, ListGroup, Offcanvas, Row} from "react-bootstrap";
import {insertPost} from "../../../../../scripts/dataHandlers";

import '../../../../styles/admin/post-editors.scss'

export default function MapHelperPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)
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
                    visibility: true
                }
            ]
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

    return (<Fragment>
        <Offcanvas show={show} onHide={handleClose} className={'post-editor'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={'post-editor__title'}>
                    Редактировать карту с подсказками
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <MapPostMarkerEditor formData={formData} setFormData={setFormData} selectedItem={selectedItem}
                                     setSelectedItem={setSelectedItem}/>

                <Card className={'post-editor__card-items'}>
                    <Card.Header>Компоненты карты</Card.Header>
                    {formData.markers.length > 0 ?
                        <ListGroup variant="flush">
                            {formData.markers.map((marker, i) => {
                                return (
                                    <Fragment key={i}>
                                        <ListGroup.Item className={'post-editor__card-items__marker'}>
                                            <Row>
                                                <Col md={10}>
                                                    <h5 className={'post-editor__card-items__marker__title'}>{marker.title}</h5>
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
                                                    <div className={'post-editor__card-items__marker__description'}>
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