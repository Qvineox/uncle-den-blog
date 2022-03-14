import {Fragment, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {ArticleBlock} from "./blocks";

import './styles/adventure.css'
import AdventureMap from "./adventureMap";
import EditorPanel from "./admin/articleEditor";

const isAdmin = localStorage.getItem('isAdmin') === 'true'

export default function Adventure2(props) {

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

        fetch(`http://localhost:3002/adventures/${id}`).then(response => {
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
                    <div className={'adventure-header'}>
                        <h2>{adventureData.title}</h2>
                        <h3>{adventureData.description}</h3>
                    </div>
                    <div className={"adventure-body"}>
                        <div className={"adventure-body__map"}>
                            <AdventureMap mapData={adventureData.map} scrollPosition={scrollPosition}/>
                        </div>
                        <div onScroll={() => scrollEffect(scrollPosition)} ref={articleContent}
                             className={"adventure-body__content"}>
                            {adventureData.posts.map((item) => {
                                return (
                                    <ArticleBlock type={item.type}
                                                  key={item.id}
                                                  id={item.id}
                                                  content={item.content}
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
            {isAdmin && <EditorPanel articleId={id} requestRefresh={requestRefresh}/>}
        </Fragment>
    )

}