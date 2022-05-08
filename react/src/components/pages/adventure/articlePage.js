import {Fragment, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {ArticleBlock} from "./blocks";

import AdventureMap from "./adventureMap";
import EditorPanel from "./admin/articleEditor";

// styles
import '../../styles/articles/article-page.scss'

const isAdmin = localStorage.getItem('isAdmin') === 'true'

export default function Article(props) {

    // adventure state managing
    const [adventureData, setAdventureData] = useState({
        isLoaded: false,
        title: null,
        description: null,
        posts: [],
        map: {},
    })
    const requestRefresh = () => {
        console.debug('> refreshing...')

        setAdventureData(values => ({
            ...values,
            isLoaded: false
        }))
    }
    useEffect(() => {
        if (adventureData.isLoaded === false) {
            console.debug('> data refresh required!')
            loadData()
        }
    }, [adventureData.isLoaded])


    // data fetching
    const {id} = useParams()
    const loadData = () => {
        console.debug('> receiving data...')

        fetch(`${process.env.REACT_APP_BACKEND_HOST}/adventures/${id}`).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)

            setAdventureData({
                isLoaded: true,
                title: data.result.title,
                description: data.result.description,
                posts: data.result.posts,
                map: data.result.map,
            })
        })

    }

    // scrolling map support
    const [scrollPosition, setScrollPosition] = useState(0)
    const articleContent = useRef()
    const scrollEffect = () => {
        setScrollPosition((articleContent.current?.scrollTop + articleContent.current?.offsetTop) / articleContent.current?.scrollHeight)
    }

    return (
        <Fragment>
            {adventureData.isLoaded ?
                <Fragment>
                    <div className={'article-header'}>
                        <h2>{adventureData.title}</h2>
                        <h3>{adventureData.description}</h3>
                    </div>
                    <div className={"article-body"}>
                        <div className={"article-body__map"}>
                            <AdventureMap mapData={adventureData.map} scrollPosition={scrollPosition}/>
                        </div>
                        <div onScroll={() => scrollEffect(scrollPosition)} ref={articleContent}
                             className={"article-body__posts"}>
                            {adventureData.posts.map((item) => {
                                return (
                                    <ArticleBlock post={item}
                                                  key={item.id}
                                                  requestRefresh={requestRefresh}/>
                                )
                            })}
                        </div>
                    </div>
                </Fragment>
                :
                <Fragment>
                    <div>Loading...</div>
                </Fragment>
            }
            {isAdmin && <EditorPanel adventureId={id} requestRefresh={requestRefresh}/>}
        </Fragment>
    )

}