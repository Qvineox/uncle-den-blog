import {Fragment, useEffect, useState} from "react";
import './styles/adventures.css'
import 'flag-icons/css/flag-icons.css'
import MyGoogleMap from "../../assets/myGoogleMap";
import {useJsApiLoader} from "@react-google-maps/api";
import {Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import AdventureCard from "./components/adventureCard";

export default function Adventures() {
    const [adventures, setAdventures] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3002/adventures").then(response => {
            return response.json()
        }).then((data) => {
            setAdventures(data.result)
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

                {isLoaded && adventures ? adventures.map(adventure => {
                        return (
                            <AdventureCard adventure={adventure} />
                        )
                    })
                    :
                    <Spinner className={"loading-map"} animation="border" role="status"/>
                }
            </div>
        </Fragment>
    )
}