import {Fragment, useEffect, useState} from "react";
import '../../styles/journeys/journey-page.scss'
import 'flag-icons/css/flag-icons.css'
import {useParams} from "react-router-dom";
import ArticleContainer from "../articles/articleContainer";

export default function JourneyPage() {
    const [pageHeader, setPageHeader] = useState({
        journey: null,
        article: null
    })
    const [journeyData, setJourneyData] = useState(null)

    const {journey_id} = useParams()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/journeys/${journey_id}/`).then(response => {
            return response.json()
        }).then((data) => {
            console.debug(data)
            setJourneyData(data)
            setPageHeader({journey: data.title, article: data.article_set[0].title})
        })
    }, [])

    return (
        <Fragment>
            <div className={"page-header"}>
                {journeyData ? (<Fragment>
                    <h1>{pageHeader.journey}</h1>
                    <h2>{pageHeader.article}</h2>
                </Fragment>) : (
                    <h1>Загрузка приключения...</h1>)}
            </div>
            {journeyData ? (
                <div className="journey-data">
                    <div className={"journey-data__info"}>
                        <h1>{journeyData.title}</h1>
                        <h2>{journeyData.description}</h2>
                    </div>
                    <div className={"journey-data__stats"}>
                        <h2><b>Пройдена дистанция</b><br/>{journeyData.distance} km</h2>
                        <h2><b>Пройдено границ</b><br/>{journeyData.countries.length}</h2>
                        <h2><b>Дата старта</b><br/>{journeyData.start_date.replaceAll('-', ' / ')}</h2>
                        <h2><b>Дата финиша</b><br/>{journeyData.finish_date.replaceAll('-', ' / ')}</h2>
                        <h2><b>Статей</b><br/>{journeyData.article_set.length}</h2>
                    </div>
                    <ArticleContainer articleId={journeyData.article_set[0].id}/>
                </div>

            ) : (
                <div>Загрузка...</div>
            )
            }
        </Fragment>
    )
}