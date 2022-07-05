import {Fragment, useEffect, useState} from "react";
import '../../styles/journeys/journeys-list-page.scss'
import 'flag-icons/css/flag-icons.css'
import {Spinner} from "react-bootstrap";
import JourneyCard from "./components/journeyCard";

export default function JourneyList() {
    const [journeys, setJourneys] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/journeys/`).then(response => {
            return response.json()
        }).then((data) => {
            console.debug(data)
            setJourneys(data)
        })
    }, [])

    return (
        <Fragment>
            <div className={"page-header"}>
                <h1>Приключения</h1>
            </div>
            <div className={"journeys-list"}>
                {journeys ? journeys.map(journey => {
                        return (
                            <JourneyCard key={journey.id} journeyData={journey}/>
                        )
                    })
                    :
                    <Spinner className={"loading-map"} animation="border" role="status"/>
                }
            </div>
        </Fragment>
    )
}