import {createContext, Fragment, useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";

import './styles/adventure.css'
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import {
    Accordion,
    Button,
    Card,
    Carousel,
    Col,
    Dropdown,
    Form,
    ListGroup,
    Modal,
    Offcanvas,
    Row
} from "react-bootstrap";
import {CustomMarker} from "../globe";
import {useParams} from "react-router-dom";

const ACTIONS = {
    SYNC: 'synchronize',
    ADD_TEXT_BLOCK: 'text', // content
    ADD_IMAGE_BLOCK: 'image', // image, content
    ADD_IMAGES_BLOCK: 'images', // [image]
    ADD_CAROUSEL_BLOCK: 'carousel', // [images, title]
    ADD_ACCORDION_BLOCK: 'accordion', // [title, content]
    ADD_MAP_BLOCK: 'map', // center, zoom, [title, description, position, image]
    ADD_MAP_HELPER_BLOCK: 'map-helper', // zoom, [title, description, position]
    ADD_LINK_BLOCK: 'link', // image, title, content, link
    CLEAR: 'clear' // all the above
}

const AdminContext = createContext();

export default function Adventure() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'

    const articleContent = useRef()

    const [addBlock, dispatch] = useReducer(reducer, null)
    const [editBlockIndex, setEditBlockIndex] = useState(null)

    const [showMapEditor, setShowMapEditor] = useState(false)

    function reducer(state, action) {
        let newBlock = {type: action.type}

        switch (action.type) {
            case ACTIONS.SYNC:
                return state
            case ACTIONS.ADD_TEXT_BLOCK:
                newBlock.content = {
                    description: "Sample text.",
                }
                break
            case ACTIONS.ADD_LINK_BLOCK:
                newBlock.content = {
                    title: "Sample title.",
                    description: "Sample text.",
                    link: "/sample-link",
                }
                break
            case ACTIONS.ADD_MAP_BLOCK:
                newBlock.content = {
                    center: {
                        lat: 45.51803,
                        lng: 23.09406
                    },
                    zoom: 5,
                    markers: []
                }
                break
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
                newBlock.content = {
                    zoom: 5,
                    markers: []
                }
                break
            case ACTIONS.ADD_ACCORDION_BLOCK:
                newBlock.content = {
                    accordionItems: []
                }
                break
            case ACTIONS.ADD_CAROUSEL_BLOCK:
                newBlock.content = {
                    carouselItems: [
                        {
                            image: 'sample',
                            title: 'Sample title',
                            description: 'Sample title',
                        }
                    ]
                }
                break
            case ACTIONS.CLEAR:
                return null
            default:
                return null
        }

        console.info('ADDING NEW BLOCK: ' + action.type)
        return newBlock
    }

    const [scrollPosition, setScrollPosition] = useState(0)
    const [currentMarker, setCurrentMarker] = useState(0)

    const [adventureData, setAdventureData] = useState(null)
    const [isAdventureLoaded, setAdventureLoaded] = useState(false)
    const {id} = useParams();

    const [articleComposition, setArticleComposition] = useState(null)
    const [mapState, setMapState] = useState({})

    function renderArticleBlock(type, content, index) {

        let deleteFunc = () => deleteBlock(index)
        let editFunc = () => setEditBlockIndex(index)

        switch (type.toString()) {
            case ACTIONS.ADD_TEXT_BLOCK:
                return (
                    <SimpleTextBlock onDelete={deleteFunc} onEdit={editFunc} text={content.description}/>
                )
            case ACTIONS.ADD_IMAGE_BLOCK:
                return (
                    <ImageBlock description={content.description} image={content.image} inverted={content.inverted}/>
                )
            case ACTIONS.ADD_IMAGES_BLOCK:
                return (
                    <MultiImageBlock images={content.images}/>
                )
            case ACTIONS.ADD_MAP_BLOCK:
                return (
                    <SimpleMapBlock onDelete={deleteFunc} onEdit={editFunc} center={content.center} zoom={content.zoom}
                                    locations={content.markers}/>
                )
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
                return (
                    <HelperMapBlock onDelete={deleteFunc} onEdit={editFunc} locations={content.markers}
                                    zoom={content.zoom}/>
                )
            case ACTIONS.ADD_LINK_BLOCK:
                return (
                    <LinkButtonBlock onDelete={deleteFunc} onEdit={editFunc} link={content.link} image={content.image}
                                     description={content.description}
                                     title={content.title}/>
                )
            case ACTIONS.ADD_ACCORDION_BLOCK:
                return (
                    <AccordionBlock onDelete={deleteFunc} onEdit={editFunc} items={content.accordionItems}/>
                )
            case ACTIONS.ADD_CAROUSEL_BLOCK:
                return (
                    <CarouselBlock carouselItems={content.carouselItems}/>
                )
            default:
                return <div>Error!</div>
        }
    }

    useEffect(() => {
        let composition = []

        console.log(`Adventure data: ${adventureData}`)

        adventureData?.article.articleBlocks.map((block, i) => {
            composition.push(
                <Fragment key={i}>
                    {renderArticleBlock(block.type, block.content, i)}
                </Fragment>
            )
        })

        setArticleComposition(composition)

        setEditBlockIndex(null)
        dispatch(ACTIONS.CLEAR)

        setMapState({center: adventureData?.article.map.positions[0], zoom: 5})
    }, [adventureData])

    useEffect(() => {
        fetch(`http://localhost:3002/adventures/${id}`).then(response => {
            return response.json()
        }).then((data) => {
            setAdventureData(data.result)
            setAdventureLoaded(true)
        })

        setScrollPosition(articleContent.current?.offsetTop / articleContent.current?.scrollHeight)
    }, [])

    useEffect(() => {
        changeLocation(adventureData?.article.map.positions[currentMarker], 5)
    }, [currentMarker])

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script', googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })

    const scrollEffect = () => {
        setScrollPosition((articleContent.current?.scrollTop + articleContent.current?.offsetTop) / articleContent.current?.scrollHeight)

        const closest = adventureData.article.map.offsets.reduce((a, b) => {
            return Math.abs(b - scrollPosition) < Math.abs(a - scrollPosition) ? b : a;
        });

        setCurrentMarker(adventureData.article.map.offsets.indexOf(closest))
    }

    const changeLocation = (center, zoom) => {
        setMapState(prevState => ({
            ...prevState.visible, center: center, zoom: zoom,
        }))
    }

    const deleteBlock = (index) => {
        let articleArray = adventureData.articleBlocks

        articleArray.splice(index, 1)

        setAdventureData(values => ({
            ...values,
            articleBlocks: articleArray
        }))
    }

    return (<Fragment>
            {isAdmin && isAdventureLoaded &&
                <Fragment>
                    <AdventureEditor setData={setAdventureData}
                                     adventureData={adventureData}
                                     editIndex={editBlockIndex}
                                     editSetter={setEditBlockIndex}
                                     addBlock={addBlock}/>

                    <MapEditor show={showMapEditor}
                               onShow={setShowMapEditor}
                               adventureData={adventureData}
                               onEdit={setAdventureData}/>

                    <div className={"scroll-helper"}>
                        {scrollPosition.toFixed(2)}
                    </div>
                    <div className={"admin editor-panel"}>
                        <Dropdown>
                            <Dropdown.Toggle variant={"outline-dark"} id="dropdown-basic">
                                <b>Добавить новый блок</b>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => dispatch({type: ACTIONS.ADD_TEXT_BLOCK})}>Текст</Dropdown.Item>
                                <Dropdown.Item disabled>Изображение</Dropdown.Item>
                                <Dropdown.Item disabled>Группа изображений</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item
                                    onClick={() => dispatch({type: ACTIONS.ADD_MAP_BLOCK})}>Карта</Dropdown.Item>
                                <Dropdown.Item onClick={() => dispatch({type: ACTIONS.ADD_MAP_HELPER_BLOCK})}>Карта
                                    с
                                    подсказками</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item
                                    onClick={() => dispatch({type: ACTIONS.ADD_ACCORDION_BLOCK})}>Аккордион</Dropdown.Item>
                                <Dropdown.Item disabled>Карусель</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item
                                    onClick={() => dispatch({type: ACTIONS.ADD_LINK_BLOCK})}>Ссылка</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button onClick={() => setShowMapEditor(true)} variant={"outline-dark"}><b>Редактировать
                            карту</b></Button>

                        <Button variant={"outline-success"}><b>Сохранить</b></Button>

                        <Button variant={"outline-danger"}><b>Отменить</b></Button>
                    </div>
                </Fragment>
            }

            {isAdventureLoaded &&
                <Fragment>
                    <div className={'adventure-header'}>
                        <h2>{adventureData.title}</h2>
                        <h3>{adventureData.description}</h3>
                    </div>
                    <div className={"adventure-body"}>
                        <div className={"adventure-body__map"}>
                            {isLoaded ? <Map mapState={mapState}/> : <div>Loading</div>}
                        </div>
                        <div onScroll={() => scrollEffect(scrollPosition)} ref={articleContent}
                             className={"adventure-body__content"}>

                            <AdminContext.Provider value={isAdmin}>
                                {isLoaded ? articleComposition : <div>Loading...</div>}
                            </AdminContext.Provider>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>

    )
}

const Map = (props) => {
    const mapRef = useRef(undefined)

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined
    }, [])

    useEffect(() => {
        mapRef.current?.panTo(props.mapState.center)
        // mapRef.current?.setZoom(props.mapState.zoom)
    }, [props.mapState])

    return (<Fragment>
        <GoogleMap
            mapContainerStyle={{
                width: '100%', height: '100%'
            }}
            center={props.mapState.center}
            zoom={props.mapState.zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
        />
    </Fragment>)
}

const SimpleTextBlock = (props) => {
    const isAdmin = useContext(AdminContext);

    return (<Fragment>
        <div className={"article-block text"}>
            <p>
                {props.text}
            </p>
            {isAdmin &&
                <div className={"block-tooltip"}>
                    <Button onClick={() => props.onEdit()} variant={"outline-light"}>Edit</Button>
                    <Button onClick={() => props.onDelete()} variant={"outline-danger"}>Delete</Button>
                </div>
            }
        </div>
    </Fragment>)
}

const ImageBlock = (props) => {
    return (<Fragment>
        <div className={props.inverted ? "article-block image-right" : "article-block image-left"}>
            <p>
                {props.description}
            </p>
            <img src={process.env.PUBLIC_URL + props.image} alt={"Placeholder alt"}/>
        </div>
    </Fragment>)
}

const MultiImageBlock = (props) => {
    return (<Fragment>
        <div className={"article-block images"}>
            {props.images.map((image, i) => {
                return <img key={i} src={process.env.PUBLIC_URL + image} alt={"Placeholder alt"}/>
            })}
        </div>
    </Fragment>)
}

const CarouselBlock = (props) => {
    return (<Carousel className={"article-block"}>
        {props.carouselItems.map((item, i) => {
            return (<Carousel.Item key={i} interval={item.interval}>
                <img
                    className="d-block w-100"
                    src={process.env.PUBLIC_URL + item.image}
                    alt={item.title}
                />
                <Carousel.Caption>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                </Carousel.Caption>
            </Carousel.Item>)
        })}
    </Carousel>)
}

const AccordionBlock = (props) => {
    const isAdmin = useContext(AdminContext);

    return (<Accordion className={"article-block"} defaultActiveKey="0">
        {props.items.map((item, i) => {
            return (
                <Fragment key={i}>
                    <Accordion.Item eventKey={i}>
                        <Accordion.Header>{item.title}</Accordion.Header>
                        <Accordion.Body>{item.description}</Accordion.Body>
                    </Accordion.Item>
                    {isAdmin &&
                        <div className={"block-tooltip"}>
                            <Button onClick={() => props.onEdit()} variant={"outline-light"}>Edit</Button>
                            <Button onClick={() => props.onDelete()} variant={"outline-danger"}>Delete</Button>
                        </div>
                    }
                </Fragment>
            )
        })}
    </Accordion>)
}

const SimpleMapBlock = (props) => {
    const isAdmin = useContext(AdminContext);

    const mapRef = useRef(undefined)

    const [mapItems, setMapItems] = useState([])

    useEffect(() => {
        let mapLocations = []

        props.locations.map((item, i) => {
            let position = {
                lat: parseFloat(item.position.lat),
                lng: parseFloat(item.position.lng)
            }

            mapLocations.push(<CustomMarker key={i} position={position} info={{
                title: item.title,
                description: item.description,
                image: item.image
            }}/>)
        })

        setMapItems(mapLocations)
    }, [props])

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined
    }, [])

    return (<Fragment>
        <div className="article-block map-block simple" style={{height: `${props.height}vh`}}>
            <GoogleMap
                mapContainerStyle={{
                    width: '100%', height: '100%'
                }}
                center={{lat: parseFloat(props.center.lat), lng: parseFloat(props.center.lng)}}
                zoom={props.zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                {mapItems}
            </GoogleMap>
            {isAdmin &&
                <div className={"block-tooltip"}>
                    <Button onClick={() => props.onEdit()} variant={"outline-light"}>Edit</Button>
                    <Button onClick={() => props.onDelete()} variant={"outline-danger"}>Delete</Button>
                </div>
            }
        </div>
    </Fragment>)
}

const HelperMapBlock = (props) => {
    const isAdmin = useContext(AdminContext);

    const mapRef = useRef(undefined)
    const [accordionItems, setAccordionItems] = useState(null)
    const [mapItems, setMapItems] = useState(null)
    const [currentItem, setCurrentItem] = useState(0)

    useEffect(() => {
        let accordionItems = []
        let mapLocations = []

        props.locations.map((item, i) => {
            accordionItems.push(
                <Fragment key={i}>
                    <Accordion.Item onClick={() => {
                        setCurrentItem(i)
                    }} eventKey={i}>
                        <Accordion.Header>{item.title}</Accordion.Header>
                        <Accordion.Body>{item.description}</Accordion.Body>
                    </Accordion.Item>
                </Fragment>
            )

            mapLocations.push(<Marker key={i} visible={item.visible} position={item.position}/>)
        })

        setAccordionItems(accordionItems)
        setMapItems(mapLocations)
    }, [props])

    useEffect(() => {
        mapRef.current?.panTo(props.locations[currentItem].position)
    }, [currentItem])

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined
    }, [])

    return (<Fragment>
        <div className="article-block map-block helper" style={{height: `${props.height}vh`}}>
            <div className={"helper"}>
                <Accordion style={{height: '100%'}} flush defaultActiveKey={0}>
                    {accordionItems}
                </Accordion>
            </div>
            <GoogleMap
                mapContainerStyle={{
                    width: '100%', height: '100%'
                }}
                center={props.locations[0].position}
                zoom={props.zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                {mapItems?.map((item, i) => {
                    return item
                })}
            </GoogleMap>
            {isAdmin &&
                <div className={"block-tooltip"}>
                    <Button onClick={() => props.onEdit()} variant={"outline-light"}>Edit</Button>
                    <Button onClick={() => props.onDelete()} variant={"outline-danger"}>Delete</Button>
                </div>
            }
        </div>
    </Fragment>)
}

const LinkButtonBlock = (props) => {
    const isAdmin = useContext(AdminContext);

    return (
        <Fragment>
            <div className={"article-block article-block-link"}>
                <img className="article-block-link__image" src={process.env.PUBLIC_URL + props.image}/>
                <div className="article-block-link__text">
                    <h1>{props.title}</h1>
                    <h5>
                        <hr/>
                        {props.description}
                    </h5>
                </div>
            </div>
            {isAdmin &&
                <div className={"block-tooltip"}>
                    <Button onClick={() => props.onEdit()} variant={"outline-light"}>Edit</Button>
                    <Button onClick={() => props.onDelete()} variant={"outline-danger"}>Delete</Button>
                </div>
            }
        </Fragment>
    )
}

const AdventureEditor = (props) => {
    const [originalData, setOriginalData] = useState({})
    const [show, setShow] = useState(false);

    // holds target block data
    const [blockData, setBlockData] = useState({})

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        if (name === "lat") {
            setBlockData(values => ({
                ...values, center: {
                    lat: value,
                    lng: values.center.lng
                }
            }))
        } else if (name === "lng") {
            setBlockData(values => ({
                ...values, center: {
                    lat: values.center.lat,
                    lng: value
                }
            }))
        } else {
            setBlockData(values => ({...values, [name]: value}))
        }
    }

    const handleSubmit = (evt) => {
        if (props.editIndex !== null) {
            let blocksArray = [...props.adventureData.articleBlocks]

            blocksArray[props.editIndex] = {
                type: blocksArray[props.editIndex].type,
                content: blockData
            }

            props.setData(values => ({
                ...values,
                articleBlocks: blocksArray
            }))
        } else {
            props.setData(values => ({
                ...values,
                articleBlocks: [
                    ...values.articleBlocks,
                    {
                        type: props.addBlock.type,
                        content: blockData
                    }
                ]
            }))
        }

        handleClose()
        evt.preventDefault()
    }

    const handleReset = () => {
        setBlockData(originalData)
    }

    useEffect(() => {
        if (props.addBlock !== null || props.editIndex !== null) {
            if (props.addBlock) {
                setBlockData(props.addBlock.content)
                setOriginalData(props.addBlock.content)
            } else if (props.editIndex !== null) {
                setBlockData(props.adventureData.articleBlocks[props.editIndex].content)
                setOriginalData(props.adventureData.articleBlocks[props.editIndex].content)
            }
            setShow(true)
        } else {
            setShow(false)
        }
    }, [props.addBlock, props.editIndex])

    const handleClose = () => {
        props.editSetter(null)
        setShow(false);
    }

    const [showMarkerEditor, setShowMarkerEditor] = useState(false);
    const addMarker = () => {
        setShowMarkerEditor(true)
    }

    const removeMarker = () => {
        setBlockData(values => ({
            ...values,
            markers: [...values.markers.slice(0, -1)]
        }))
    }

    const [showAccordionEditor, setShowAccordionEditor] = useState(false);
    const addAccordionItem = () => {
        setShowAccordionEditor(true)
    }

    const removeAccordionItem = () => {
        setBlockData(values => ({
            ...values,
            accordionItems: [...values.accordionItems.slice(0, -1)]
        }))
    }

    return (
        <Fragment>
            <Offcanvas show={show} onHide={handleClose}>
                {blockData?.markers &&
                    <MarkerEditor setBlockData={setBlockData} show={showMarkerEditor}
                                  onShow={setShowMarkerEditor}/>
                }

                {blockData?.accordionItems &&
                    <AccordionEditor setBlockData={setBlockData} show={showAccordionEditor}
                                     onShow={setShowAccordionEditor}/>
                }

                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Редактировать</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={(evt) => handleSubmit(evt)} onReset={handleReset} className={'admin editor'}>
                        {blockData?.title &&
                            <Form.Group className={"form-group"}>
                                <Form.Label>Заголовок</Form.Label>
                                <Form.Control onChange={handleChange} type="text" value={blockData.title}/>
                            </Form.Group>
                        }

                        {blockData?.description &&
                            <Form.Group className={"form-group"}>
                                <Form.Label>Основной текст</Form.Label>
                                <Form.Control onChange={handleChange} name={"description"} rows={3} as="textarea"
                                              value={blockData.description}/>
                                <Form.Text className="text-muted">
                                    Основной текст блока (рекомендуется не более 250 символов).
                                </Form.Text>
                            </Form.Group>
                        }

                        {(blockData?.center || (blockData.zoom || blockData.zoom?.length === 0)) &&
                            <Card>
                                <Card.Header>Настройки карты</Card.Header>
                                <Card.Body>
                                    {blockData.center &&
                                        <Form.Group className={"form-group"}>
                                            <Form.Label>Широта & Долгота</Form.Label>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                <Form.Control onChange={handleChange} name={"lat"} type="number"
                                                              value={blockData.center.lat}/>
                                                <Form.Control onChange={handleChange} name={"lng"} type="number"
                                                              value={blockData.center.lng}
                                                              style={{marginLeft: '5px'}}/>
                                            </div>
                                        </Form.Group>
                                    }

                                    {(blockData.zoom || blockData.zoom.length === 0) &&
                                        <Form.Group className={"form-group"}>
                                            <Form.Label>Приближение</Form.Label>
                                            <Form.Control onChange={handleChange} name={"zoom"} type="number"
                                                          value={blockData.zoom}/>
                                            <Form.Text className="text-muted">
                                                Рекомендуются значения от 2 до 12.
                                            </Form.Text>
                                        </Form.Group>
                                    }
                                </Card.Body>
                            </Card>
                        }

                        {blockData?.markers &&
                            <Card style={{width: '100%', marginTop: '2vh'}}>
                                <Card.Header>Маркеры на карте</Card.Header>
                                {blockData.markers.length > 0 ?
                                    <ListGroup variant="flush">
                                        {blockData.markers.map((marker, i) => {
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
                        }


                        {blockData?.link &&
                            <Form.Group className={"form-group"}>
                                <Form.Label>Ссылка</Form.Label>
                                <Form.Control onChange={handleChange} name={"link"} type="text" value={blockData.link}/>
                            </Form.Group>
                        }

                        {blockData?.accordionItems &&
                            <Card style={{width: '100%', marginTop: '2vh'}}>
                                <Card.Header>Компоненты аккордиона</Card.Header>
                                {blockData.accordionItems.length > 0 ?
                                    <ListGroup variant="flush">
                                        {blockData.accordionItems.map((marker, i) => {
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
                        }
                        <div className="add-block-buttons__wrapper">
                            <Button type={"submit"} variant={"success"} className={"add-block-button"}>
                                Сохранить компонент
                            </Button>
                            <Button type={"reset"} variant={"danger"} className={"add-block-button"}>
                                Очистить
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
            );
        </Fragment>
    )
}

const MarkerEditor = (props) => {
    const [inputValues, setInputValues] = useState({
        title: "New Title",
        description: "New Description",
        visible: true,
        position: {
            lat: 45.52476,
            lng: 23.09212
        }
    })

    const handleSubmit = (evt) => {
        props.setBlockData(values => ({
            ...values,
            markers: [
                ...values.markers,
                {
                    ...inputValues,
                    position: {
                        lat: parseFloat((inputValues.position.lat).toFixed(5)),
                        lng: parseFloat((inputValues.position.lng).toFixed(5))
                    }
                }
            ]
        }))

        props.onShow(false)
        evt.preventDefault()
    }

    const changeSwitch = () => {
        setInputValues(values => ({
            ...values,
            visible: !values.visible
        }))
    }

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        if (name === "lat") {
            setInputValues(values => ({
                ...values, position: {
                    lat: value,
                    lng: parseFloat(values.position.lng).toFixed(5)
                }
            }))
        } else if (name === "lng") {
            setInputValues(values => ({
                ...values, position: {
                    lat: parseFloat(values.position.lat).toFixed(5),
                    lng: value
                }
            }))
        } else {
            setInputValues(values => ({...values, [name]: value}))
        }
    }

    return (
        <Modal show={props.show} onHide={() => props.onShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление метки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'admin editor-modal'} onSubmit={(evt) => handleSubmit(evt)}>
                    <Form.Group className={"form-group"}>
                        <Form.Label>Заголовок</Form.Label>
                        <Form.Control name={"title"} onChange={handleChange} type="text"
                                      value={inputValues.title}/>
                    </Form.Group>

                    <Form.Group className={"form-group"}>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control name={"description"} onChange={handleChange} type="text"
                                      value={inputValues.description}/>
                    </Form.Group>

                    <Form.Group className={"form-group"}>
                        <Form.Label>Широта</Form.Label>
                        <Form.Control name={"lat"} onChange={handleChange} type="number"
                                      value={inputValues.position.lat}/>
                    </Form.Group>

                    <Form.Group className={"form-group"}>
                        <Form.Label>Долгота</Form.Label>
                        <Form.Control name={"lng"} onChange={handleChange} type="number"
                                      value={inputValues.position.lng}/>
                    </Form.Group>

                    <Form.Group className={"form-group"}>
                        <Form.Label>Видимость</Form.Label>
                        <Form.Check name={"visible"} type="switch" onChange={changeSwitch}
                                    checked={inputValues.visible}/>
                    </Form.Group>

                    <div className="add-block-buttons__wrapper">
                        <Button variant="danger" type={"reset"}>
                            Очистить
                        </Button>
                        <Button variant="success" type={"submit"}>
                            Сохранить метку
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
}

const AccordionEditor = (props) => {
    const [inputValues, setInputValues] = useState({
        title: "New Title",
        description: "New Description"
    })

    const handleSubmit = (evt) => {
        props.setBlockData(values => ({
            ...values,
            accordionItems: [
                ...values.accordionItems,
                {
                    ...inputValues
                }
            ]
        }))

        props.onShow(false)
        evt.preventDefault()
    }

    const handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        setInputValues(values => ({...values, [name]: value}))
    }

    return (
        <Modal show={props.show} onHide={() => props.onShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление метки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'admin editor-modal'} onSubmit={(evt) => handleSubmit(evt)}>
                    <Form.Group className={"form-group"}>
                        <Form.Label>Заголовок</Form.Label>
                        <Form.Control name={"title"} onChange={handleChange} type="text"
                                      value={inputValues.title}/>
                    </Form.Group>

                    <Form.Group className={"form-group"}>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control name={"description"} onChange={handleChange} as="textarea" rows={5}
                                      value={inputValues.description}/>
                    </Form.Group>

                    <div className="add-block-buttons__wrapper">
                        <Button variant="danger" type={"reset"}>
                            Очистить
                        </Button>
                        <Button variant="success" type={"submit"}>
                            Сохранить метку
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

const MapEditor = (props) => {
    const [inputValues, setInputValues] = useState(null)
    const [editIndex, setEditIndex] = useState(null)

    const sortMarkers = () => {
        let copy = props.adventureData.map

        for (let i = 0; i < copy.positions.length - 1; i++) {
            for (let j = 0; j < copy.positions.length - i - 1; j++) {
                if (copy.offsets[j] > copy.offsets[j + 1]) {
                    let temp = copy.offsets[j];
                    copy.offsets[j] = copy.offsets[j + 1];
                    copy.offsets[j + 1] = temp;

                    temp = copy.positions[j];
                    copy.positions[j] = copy.positions[j + 1];
                    copy.positions[j + 1] = temp;
                }
            }
        }

        props.onEdit(values => ({
            ...values,
            map: copy
        }))
    }

    const handleSubmit = (evt) => {
        sortMarkers()
        props.onShow(false)

        evt.preventDefault()
    }

    const deleteMarker = (index) => {
        let copy = props.adventureData.map
        copy.positions.splice(index, 1)
        copy.offsets.splice(index, 1)

        props.onEdit(values => ({
            ...values,
            map: copy
        }))
    }

    const addMarker = () => {
        props.onEdit(values => ({
            ...values,
            map: {
                positions: [
                    ...values.map.positions,
                    {
                        lat: 45.51803,
                        lng: 23.09406
                    }
                ],
                offsets: [
                    ...values.map.offsets,
                    0.5
                ]
            }
        }))
    }

    const handleChange = (evt) => {
        let value = evt.target.value

        if (value !== '') {
            value = parseFloat(value)
        } else {
            value = 0
        }

        let name = evt.target.name


        if (name === "offset") {
            let copy = props.adventureData.map.offsets
            copy[editIndex] = value

            props.onEdit(values => ({
                ...values,
                map: {
                    ...values.map,
                    offsets: copy
                }
            }))
        } else {
            let copy = props.adventureData.map.positions
            copy[editIndex][name] = value

            props.onEdit(values => ({
                ...values,
                map: {
                    ...values.map,
                    positions: copy
                }
            }))
        }
    }

    return (
        <Modal show={props.show} onHide={() => props.onShow(false)} className={"admin map-editor"}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header>
                    <h3>Редактировать карту</h3>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {props.adventureData.map.positions.length > 0 ?
                            <Fragment>
                                {props.adventureData.article.map.positions.map((position, i) => {
                                    if (editIndex !== i) {
                                        return (
                                            <Fragment key={i}>
                                                <ListGroup.Item className={"marker-item"}>
                                                    <div className={"marker-item__data"}>
                                                        <Row>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    latitude
                                                                </Form.Text>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    longitude
                                                                </Form.Text>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    offset
                                                                </Form.Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={4}>
                                                                {position.lat}
                                                            </Col>
                                                            <Col md={4}>
                                                                {position.lng}
                                                            </Col>
                                                            <Col md={4}>
                                                                {props.adventureData.map.offsets[i]}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className={"marker-item__actions"}>
                                                        <Button onClick={() => setEditIndex(i)}
                                                                variant={"outline-primary"}>
                                                            Edit
                                                        </Button>
                                                        <Button onClick={() => deleteMarker(i)}
                                                                variant={"outline-danger"}>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </ListGroup.Item>
                                            </Fragment>
                                        )
                                    } else {
                                        return (
                                            <Fragment key={i}>
                                                <ListGroup.Item className={"marker-item"}>
                                                    <div className={"marker-item__data"}>
                                                        <Row>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    latitude
                                                                </Form.Text>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    longitude
                                                                </Form.Text>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Text className="text-muted">
                                                                    offset
                                                                </Form.Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={4}>
                                                                <Form.Control onChange={(evt) => handleChange(evt)}
                                                                              name={"lat"}
                                                                              value={props.adventureData.map.positions[i].lat}
                                                                              type={"text"}/>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Control onChange={(evt) => handleChange(evt)}
                                                                              name={"lng"}
                                                                              value={props.adventureData.map.positions[i].lng}
                                                                              type={"text"}/>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Control onChange={(evt) => handleChange(evt)}
                                                                              name={"offset"}
                                                                              value={props.adventureData.map.offsets[i]}
                                                                              type={"text"}/>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className={"marker-item__actions"}>
                                                        <Button onClick={() => {
                                                            setEditIndex(null)
                                                            sortMarkers()
                                                        }}
                                                                variant={"outline-success"}>
                                                            Save
                                                        </Button>
                                                    </div>
                                                </ListGroup.Item>
                                            </Fragment>
                                        )
                                    }
                                })
                                }
                            </Fragment>
                            :
                            <Fragment>
                                <ListGroup.Item className={"marker-item"}>
                                    Пусто
                                </ListGroup.Item>
                            </Fragment>
                        }
                        <Button onClick={addMarker} variant={"outline-success"} style={{marginTop: '1em'}}>
                            Добавить
                        </Button>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>

                    <Button type={"reset"} variant={"danger"}>
                        Отменить
                    </Button>
                    <Button type={"submit"} variant={"success"}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}