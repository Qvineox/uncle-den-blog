import '../../styles/articles/article-container.scss'
import {useEffect, useState} from "react";
import ArticleMap from "./components/articleMap";

export default function ArticleContainer({articleId}) {
    const [articleData, setArticleData] = useState(null)
    const [mapState, setMapState] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/articles/${articleId}/`).then(response => {
            return response.json()
        }).then((data) => {
            let posts = []

            data.basictextpost_set.forEach(post => {
                posts.push(<BasicTextPost text={post.text} order={post.order}
                                          mapCenterController={() => changeMapCenter({
                                              lat: parseFloat(post.map_latitude),
                                              lng: parseFloat(post.map_longitude)
                                          }, parseInt(post.map_zoom))}
                />)
            })

            data.imagetextpost_set.forEach(post => {
                posts.push(<ImageTextPost text={post.text} imageSource={post.image.path} alignment={post.alignment}/>)
            })

            setArticleData({
                title: data.title,
                description: data.description,
                distance: data.distance,
                start_date: data.start_date,
                finish_date: data.finish_date,
                country: data.country,
                posts: posts
            })

            changeMapCenter({
                lat: parseFloat(data.map_latitude),
                lng: parseFloat(data.map_longitude)
            }, parseInt(data.map_zoom))
        })
    }, [])

    const changeMapCenter = (newCenter, newZoom) => {
        setMapState(values => ({
            zoom: newZoom,
            center: newCenter
        }))
    }

    return (
        <div className="article-container">
            <div className="article-container__map">
                {mapState ? (
                    <ArticleMap currentCenter={mapState.center} currentZoom={mapState.zoom}/>
                ) : (
                    <div>Загрузка карты...</div>
                )}
            </div>
            <div className="article-container__posts-list">
                {articleData ? (
                    articleData.posts.map((post, index) => <li key={index}>{post}</li>)
                ) : (
                    <div>Загрузка постов...</div>
                )}
            </div>
        </div>
    )


}

function BasicTextPost({text, mapCenterController}) {
    return (
        <div onPointerEnter={() => mapCenterController()} className={"post post__basic-text"}>
            <p>{text}</p>
        </div>
    )
}

function ImageTextPost({text, imageSource, alignment}) {
    return (
        <div className={`post post__image-text_${alignment}`}>
            <img src={`${process.env.REACT_APP_BACKEND_HOST}${imageSource}`}/>
            <p>{text}</p>
        </div>
    )
}