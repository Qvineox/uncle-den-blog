import {Fragment, useEffect, useState} from "react";
import {Button, Card, Col, Form, ListGroup, Modal, Offcanvas, Row} from "react-bootstrap";

import '../../styles/admin/editors.scss'
import {insertPost} from "../../scripts/dataHandlers";

export default function AccordionPostEditor({post, show, setShow, refreshData}) {
    const [formData, setFormData] = useState(post.content)
    const [selectedItem, setSelectedItem] = useState(null)

    const addAccordionItem = () => {
        setFormData(values => ({
            accordionItems: [
                ...values.accordionItems,
                {
                    title: 'Новый заголовок.',
                    description: 'Новое описание.'
                }
            ]
        }))
    }

    const removeAccordionItem = (index) => {
        let items = formData.accordionItems
        items.splice(index, 1)

        setFormData(values => ({
            ...values, accordionItems: items
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
                    Редактировать аккордион
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <AccordionPostItemEditor formData={formData} setFormData={setFormData} selectedItem={selectedItem}
                                         setSelectedItem={setSelectedItem}/>

                <Card className={'post-editor__card-items'}>
                    <Card.Header>Компоненты аккордиона</Card.Header>
                    {formData.accordionItems.length > 0 ?
                        <ListGroup variant="flush">
                            {formData.accordionItems.map((marker, i) => {
                                return (
                                    <Fragment key={i}>
                                        {/* TODO: Add edit and delete buttons (icons) */}
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
                                                    <img alt={'remove'} onClick={() => removeAccordionItem(i)}
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
                            })}
                        </ListGroup>
                        :
                        <Card.Body className="text-center">
                            <Card.Title>Пусто</Card.Title>
                        </Card.Body>
                    }
                    <Card.Footer>
                        <div className={"flex-center"}>
                            <Button onClick={addAccordionItem} variant="outline-success">Добавить</Button>
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

const AccordionPostItemEditor = ({formData, setFormData, selectedItem, setSelectedItem}) => {
    const [show, setShow] = useState(false)
    const [itemData, setItemData] = useState(null)

    useEffect(() => {
        if (selectedItem !== null) {
            setItemData(formData.accordionItems[selectedItem])
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
        let items = formData.accordionItems

        items[selectedItem] = itemData

        setFormData(values => (
            {
                ...values,
                accordionItems: items
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
                    <Form.Control className={"modal-form__form__text"}
                                  onChange={handleChange}
                                  name={"title"}
                                  type={'text'}
                                  value={itemData?.title}/>
                    <Form.Text className='modal-form__form__hint'>
                        Значение на закрытом элементе аккордиона.
                    </Form.Text>
                </Form.Group>
                <Form.Group className={"modal-form__form"}>
                    <Form.Label className={"modal-form__form__label"}>Описание</Form.Label>
                    <Form.Control className={"modal-form__form__textarea"}
                                  onChange={handleChange}
                                  name={"description"}
                                  rows={5}
                                  as={'textarea'}
                                  value={itemData?.description}/>
                    <Form.Text className='modal-form__form__hint'>
                        Рекомендуется от 50 до 200 символов.
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