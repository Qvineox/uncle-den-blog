import {Fragment, useEffect, useState} from "react";
import './styles/adventures.css'
import 'flag-icons/css/flag-icons.css'
import {useJsApiLoader} from "@react-google-maps/api";
import {Spinner} from "react-bootstrap";
import JourneyCard from "./components/journeyCard";

export default function Journey() {
    const [journeys, setJourneys] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/journeys/`).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            setJourneys(data)
        })
    }, [])

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })

    return (
        <Fragment>
            <div className={"page-header"}>
                <h1>Приключения</h1>
            </div>
            <div className={"adventures__wrapper"}>

                {isLoaded && journeys ? journeys.map(journey => {
                        return (
                            <JourneyCard key={journey.id} journey={journey} />
                        )
                    })
                    :
                    <Spinner className={"loading-map"} animation="border" role="status"/>
                }
            </div>
        </Fragment>
    )
}