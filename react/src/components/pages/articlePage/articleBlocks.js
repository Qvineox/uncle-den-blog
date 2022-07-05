import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Accordion, Button, Carousel} from "react-bootstrap";
import {CustomMarker} from "../globe";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import TextPostEditor from "./admin/editors/textPostEditor";
import AccordionPostEditor from "./admin/editors/accordionPostEditor";
import CarouselPostEditor from "./admin/editors/carouselPostEditor";
import {MapPostEditor} from "./admin/editors/mapPostEditor";
import LinkPostEditor from "./admin/editors/linkPostEditor";
import MapHelperPostEditor from "./admin/editors/mapHelperPostEditor";
import ImagePostEditor from "./admin/editors/imageBlockEditor";
import {deletePost} from "../../../scripts/dataHandlers";
import ImagesPostEditor from "./admin/editors/imagesBlockEditor";

// styles
import '../../styles/articles/post-blocks.scss'

export const ACTIONS = {
    ADD_TEXT_BLOCK: 'text', // text
    ADD_IMAGE_BLOCK: 'image', // image, text
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

export function ArticleBlock({post, requestRefresh}) {
    const [block, setBlock] = useState(null)

    useEffect(() => {
        createBlock()
    }, [])

    function createBlock() {
        switch (post.type) {
            case ACTIONS.ADD_TEXT_BLOCK:
                setBlock(<SimpleTextBlock post={post}/>)
                break
            case ACTIONS.ADD_IMAGE_BLOCK:
                setBlock(<SimpleImageBlock post={post}/>)
                break
            case ACTIONS.ADD_IMAGES_BLOCK:
                setBlock(<ImagesBlock post={post}/>)
                break
            case ACTIONS.ADD_LINK_BLOCK:
                setBlock(<LinkButtonBlock post={post}/>)
                break
            case ACTIONS.ADD_MAP_BLOCK:
                setBlock(<SimpleMapBlock post={post}/>)
                break
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
                setBlock(<HelperMapBlock post={post}/>)
                break
            case ACTIONS.ADD_ACCORDION_BLOCK:
                setBlock(<AccordionBlock post={post}/>)
                break
            case ACTIONS.ADD_CAROUSEL_BLOCK:
                setBlock(<CarouselBlock post={post}/>)
                break
            default:
                return null
        }

        console.info('ADDING NEW BLOCK: ' + post.type)
    }

    function deleteBlock(id) {
        deletePost(id)
        requestRefresh()
    }

    const SimpleTextBlock = ({post}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block"}>
                    <div className="article-block__simple-text">
                        <p>
                            {post.content.text}
                        </p>
                    </div>
                    {isAdmin &&
                        <Fragment>
                            <div className={"block-tooltip"}>
                                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                                <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                            </div>
                            <TextPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                            setShow={setShowEdit}/>
                        </Fragment>
                    }
                </div>
            </Fragment>
        )
    }

    const SimpleImageBlock = ({post}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block"}>
                    <div className={post.content.inverted ? "article-block__image_inverted" : "article-block__image"}>
                        <p>
                            {post.content.text}
                        </p>
                        <img src={`${process.env.REACT_APP_BACKEND_HOST}/static${post.content.image_path}`} alt={post.content.image_alt}/>
                    </div>
                    {isAdmin &&
                        <Fragment>
                            <div className={"block-tooltip"}>
                                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                                <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                            </div>
                            <ImagePostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                             setShow={setShowEdit}/>
                        </Fragment>
                    }
                </div>
            </Fragment>
        )
    }

    const ImagesBlock = ({post}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block"}>
                    <div className={"article-block__multiple-images"}>
                        {post.content.images.map((image, index) => {
                            return (<img key={index}
                                         src={`${process.env.REACT_APP_BACKEND_HOST}/static${image}`}
                                         alt={image.image_alt}/>)
                        })}
                    </div>
                    <p className={'article-block__multiple-images__text'}>
                        {post.content.text}
                    </p>
                    {isAdmin &&
                        <Fragment>
                            <div className={"block-tooltip"}>
                                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                                <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                            </div>
                            <ImagesPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                              setShow={setShowEdit}/>
                        </Fragment>
                    }
                </div>
            </Fragment>
        )
    }

    const CarouselBlock = ({post}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <div className={"article-block"}>
                <Carousel className={"article-block__carousel"}>
                    {post.content.map((item, i) => {
                        return (
                            <Carousel.Item key={i} interval={item.interval}>
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_HOST}/static${item.image_path}`}
                                    alt={item.image_alt}
                                />
                                <Carousel.Caption>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
                {isAdmin && <Fragment>
                    <div className={"block-tooltip"}>
                        <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                        <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <CarouselPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                        setShow={setShowEdit}/>
                </Fragment>}
            </div>
        )
    }

    const AccordionBlock = ({post}) => {
        const [showEdit, setShowEdit] = useState(false)

        return (
            <Accordion className={"article-block"} defaultActiveKey="0">
                {post.content.map((item, i) => {
                    return (
                        <Fragment key={i}>
                            <Accordion.Item eventKey={i}>
                                <Accordion.Header>{item.title}</Accordion.Header>
                                <Accordion.Body>{item.text}</Accordion.Body>
                            </Accordion.Item>
                        </Fragment>
                    )
                })}
                {isAdmin && <Fragment>
                    <div className={"block-tooltip"}>
                        <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                        <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <AccordionPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                         setShow={setShowEdit}/>
                </Fragment>}
            </Accordion>
        )
    }

    const SimpleMapBlock = ({post}) => {
        const mapRef = useRef(undefined)

        const [mapItems, setMapItems] = useState([])
        const [showEdit, setShowEdit] = useState(false)

        useEffect(() => {
            let mapLocations = []

            post.content.map((item, i) => {
                let position = {
                    lat: parseFloat(item.position.lat),
                    lng: parseFloat(item.position.lng)
                }

                mapLocations.push(<CustomMarker key={i} position={position} info={{
                    title: item.title,
                    description: item.text
                }}/>)
            })

            setMapItems(mapLocations)
        }, [post.content.markers])

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
                <div className="article-block article-block__simple-map" style={{height: `40vh`}}>
                    {isLoaded ?
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%', height: '100%'
                            }}
                            center={{
                                lat: parseFloat(post.content[0].position.lat),
                                lng: parseFloat(post.content[0].position.lng)
                            }}
                            zoom={post.content[0].zoom}
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
                            <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                        </div>
                        <MapPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                       setShow={setShowEdit}/>
                    </Fragment>}
                </div>
            </Fragment>
        )
    }

    const HelperMapBlock = ({post}) => {
        const mapRef = useRef(undefined)
        const [accordionItems, setAccordionItems] = useState(null)
        const [mapItems, setMapItems] = useState(null)
        const [currentItem, setCurrentItem] = useState(0)

        const [showEdit, setShowEdit] = useState(false)

        useEffect(() => {
            let accordionItems = []
            let mapLocations = []

            post.content.map((item, i) => {
                accordionItems.push(
                    <Fragment key={i}>
                        <Accordion.Item onClick={() => {
                            setCurrentItem(i)
                        }} eventKey={i}>
                            <Accordion.Header>{item.title}</Accordion.Header>
                            <Accordion.Body>{item.text}</Accordion.Body>
                        </Accordion.Item>
                    </Fragment>
                )

                mapLocations.push(<Marker key={i} visible={item.visible} position={item.position}/>)
            })

            setAccordionItems(accordionItems)
            setMapItems(mapLocations)
        }, [post.content])

        useEffect(() => {
            mapRef.current?.panTo(post.content[currentItem].position)
        }, [post.content, currentItem])

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
            <div className="article-block map-block helper" style={{height: `${post.content.height}vh`}}>
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
                        center={post.content.markers[0].position}
                        zoom={post.content.zoom}
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
                        <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                    </div>
                    <MapHelperPostEditor refreshData={requestRefresh} post={post}
                                         show={showEdit}
                                         setShow={setShowEdit}/>
                </Fragment>}
            </div>
        </Fragment>)
    }

    const LinkButtonBlock = ({post}) => {

        const [showEdit, setShowEdit] = useState(false)

        return (
            <Fragment>
                <div className={"article-block article-block__link"}>
                    <img className="article-block__link__image"
                         src={`${process.env.REACT_APP_BACKEND_HOST}/static${post.content.image_path}`}
                         alt={post.content.image_alt}/>
                    <div className="article-block-link__text">
                        <h1>{post.content.title}</h1>
                        <h5>
                            <hr/>
                            {post.content.text}
                        </h5>
                        {isAdmin && <Fragment>
                            <div className={"block-tooltip"}>
                                <Button onClick={() => setShowEdit(true)} variant={"outline-light"}>Edit</Button>
                                <Button onClick={() => deleteBlock(post.id)} variant={"outline-danger"}>Delete</Button>
                            </div>
                            <LinkPostEditor refreshData={requestRefresh} post={post} show={showEdit}
                                            setShow={setShowEdit}/>
                        </Fragment>}
                    </div>

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


