import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Accordion, Button, Carousel} from "react-bootstrap";
import {CustomMarker} from "../globe";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import TextPostEditor from "./admin/editors/textPostEditor";
import {deletePost} from "./admin/scripts/postHandlers";
import AccordionPostEditor from "./admin/editors/accordionPostEditor";
import CarouselPostEditor from "./admin/editors/carouselPostEditor";
import {MapPostEditor} from "./admin/editors/mapPostEditor";
import LinkPostEditor from "./admin/editors/linkPostEditor";
import MapHelperPostEditor from "./admin/editors/mapHelperPostEditor";

export const ACTIONS = {
    ADD_TEXT_BLOCK: 'text', // content
    ADD_IMAGE_BLOCK: 'image', // image, content
    ADD_IMAGES_BLOCK: 'images', // [image]
    ADD_IMAGES_BLOCK__ADD_IMAGE: 'images_add', // [image]
    ADD_CAROUSEL_BLOCK: 'carousel', // [images, title]
    ADD_ACCORDION_BLOCK: 'accordion', // accordionItems
    ADD_ACCORDION_BLOCK__ADD_ITEM: 'accordion_add', // adds new item to the accordion
    ADD_MAP_BLOCK: 'map', // center, zoom, markers
    ADD_MAP_BLOCK__ADD_MARKER: 'map_add', // adds new marker to the map
    ADD_MAP_HELPER_BLOCK: 'map-helper', // zoom, [title, description, position]
    ADD_MAP_HELPER_BLOCK__ADD_MARKER: 'map-helper_add', // adds new marker to the map with helper
    ADD_LINK_BLOCK: 'link', // image, title, content, link
    CLEAR: 'clear' // all the above
}

const isAdmin = localStorage.getItem('isAdmin') === 'true'

export function ArticleBlock({type, content, id, requestRefresh}) {
    const [block, setBlock] = useState(null)

    useEffect(() => {
        createBlock(type, content)
    }, [])

    function createBlock(type, content) {
        switch (type) {
            case ACTIONS.ADD_TEXT_BLOCK:
                setBlock(<SimpleTextBlock id={id} content={content}/>)
                break
            case ACTIONS.ADD_LINK_BLOCK:
                setBlock(<LinkButtonBlock id={id} content={content}/>)
                break
            case ACTIONS.ADD_MAP_BLOCK:
                setBlock(<SimpleMapBlock id={id} content={content}/>)
                break
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
                setBlock(<HelperMapBlock id={id} content={content}/>)
                break
            case ACTIONS.ADD_ACCORDION_BLOCK:
                setBlock(<AccordionBlock id={id} content={content}/>)
                break
            case ACTIONS.ADD_CAROUSEL_BLOCK:
                setBlock(<CarouselBlock id={id} content={content}/>)
                break
            default:
                return null
        }

        console.info('ADDING NEW BLOCK: ' + type)
    }

    function deleteBlock(id) {
        deletePost(id)
        requestRefresh()
    }

    const AdminPanel = ({id, setShowEdit}) => {
        return (
            <div className={"block-tooltip"}>
                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
            </div>
        )
    }

    const SimpleTextBlock = ({id, content}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block text"}>
                    <p>
                        {content.description}
                    </p>
                    {isAdmin &&
                        <Fragment>
                            <div className={"block-tooltip"}>
                                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                                <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                            </div>
                            <TextPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                            setShow={setShowEdit}/>
                        </Fragment>
                    }
                </div>
            </Fragment>
        )
    }

    const CarouselBlock = ({id, content}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <div className={"article-block"}>
                <Carousel className={"article-block"}>
                    {content.carouselItems.map((item, i) => {
                        return (
                            <Carousel.Item key={i} interval={item.interval}>
                                <img
                                    className="d-block w-100"
                                    src={process.env.PUBLIC_URL + item.image}
                                    alt={item.title}
                                />
                                <Carousel.Caption>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
                {isAdmin && <Fragment>
                    <div className={"block-tooltip"}>
                        <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                        <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <CarouselPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                        setShow={setShowEdit}/>
                </Fragment>}
            </div>
        )
    }

    const AccordionBlock = ({id, content}) => {
        const [showEdit, setShowEdit] = useState(false)

        return (
            <Accordion className={"article-block"} defaultActiveKey="0">
                {content.accordionItems.map((item, i) => {
                    return (
                        <Fragment key={i}>
                            <Accordion.Item eventKey={i}>
                                <Accordion.Header>{item.title}</Accordion.Header>
                                <Accordion.Body>{item.description}</Accordion.Body>
                            </Accordion.Item>
                        </Fragment>
                    )
                })}
                {isAdmin && <Fragment>
                    <div className={"block-tooltip"}>
                        <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                        <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <AccordionPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                         setShow={setShowEdit}/>
                </Fragment>}
            </Accordion>
        )
    }

    const SimpleMapBlock = ({id, content}) => {
        const mapRef = useRef(undefined)

        const [mapItems, setMapItems] = useState([])
        const [showEdit, setShowEdit] = useState(false)

        useEffect(() => {
            let mapLocations = []

            content.markers.map((item, i) => {
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
        }, [content.markers])

        const onLoad = useCallback(function callback(map) {
            mapRef.current = map
        }, [])

        const onUnmount = useCallback(function callback(map) {
            mapRef.current = undefined
        }, [])

        const {isLoaded} = useJsApiLoader({
            id: 'google-map-script', googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
        })

        return (
            <Fragment>
                <div className="article-block map-block simple" style={{height: `${content.height}vh`}}>
                    {isLoaded ?
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%', height: '100%'
                            }}
                            center={{lat: parseFloat(content.center.lat), lng: parseFloat(content.center.lng)}}
                            zoom={content.zoom}
                            onLoad={onLoad}
                            onUnmount={onUnmount}>
                            {mapItems}
                        </GoogleMap>
                        :
                        <div>
                            Loading...
                        </div>
                    }
                    {isAdmin && <Fragment>
                        <div className={"block-tooltip"}>
                            <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                            <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                        </div>
                        <MapPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                       setShow={setShowEdit}/>
                    </Fragment>}
                </div>
            </Fragment>
        )
    }

    const HelperMapBlock = ({id, content}) => {
        const mapRef = useRef(undefined)
        const [accordionItems, setAccordionItems] = useState(null)
        const [mapItems, setMapItems] = useState(null)
        const [currentItem, setCurrentItem] = useState(0)

        const [showEdit, setShowEdit] = useState(false)

        useEffect(() => {
            let accordionItems = []
            let mapLocations = []

            content.markers.map((item, i) => {
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
        }, [content.markers])

        useEffect(() => {
            mapRef.current?.panTo(content.markers[currentItem].position)
        }, [content.markers, currentItem])

        const onLoad = useCallback(function callback(map) {
            mapRef.current = map
        }, [])

        const onUnmount = useCallback(function callback(map) {
            mapRef.current = undefined
        }, [])

        const {isLoaded} = useJsApiLoader({
            id: 'google-map-script', googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
        })

        return (<Fragment>
            <div className="article-block map-block helper" style={{height: `${content.height}vh`}}>
                <div className={"helper"}>
                    <Accordion style={{height: '100%'}} flush defaultActiveKey={0}>
                        {accordionItems}
                    </Accordion>
                </div>
                {isLoaded ?
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%', height: '100%'
                        }}
                        center={content.markers[0].position}
                        zoom={content.zoom}
                        onLoad={onLoad}
                        onUnmount={onUnmount}>
                        {mapItems?.map((item, i) => {
                            return item
                        })}
                    </GoogleMap>
                    :
                    <div>
                        Loading...
                    </div>
                }
                {isAdmin && <Fragment>
                    <div className={"block-tooltip"}>
                        <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                        <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <MapHelperPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                         setShow={setShowEdit}/>
                </Fragment>}
            </div>
        </Fragment>)
    }

    const LinkButtonBlock = ({id, content}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block article-block-link"}>
                    <img className="article-block-link__image" src={process.env.PUBLIC_URL + content.image}/>
                    <div className="article-block-link__text">
                        <h1>{content.title}</h1>
                        <h5>
                            <hr/>
                            {content.description}
                        </h5>
                    </div>
                    {isAdmin && <Fragment>
                        <div className={"block-tooltip"}>
                            <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                            <Button onClick={() => deleteBlock(id)} variant={"outline-danger"}>Delete</Button>
                        </div>
                        <LinkPostEditor refreshData={requestRefresh} id={id} content={content} show={showEdit}
                                        setShow={setShowEdit}/>
                    </Fragment>}
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            {block}
        </Fragment>
    )
}


