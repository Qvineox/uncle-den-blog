import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";

export default function ArticleMap({currentCenter, currentZoom}) {
    const [mapLocation, setMapLocation] = useState({lat: 0, lng: 0})
    const [mapZoom, setMapZoom] = useState(4)

    const mapRef = useRef(undefined)

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined
    }, [])

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script', googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })

    useEffect(() => {
        mapRef.current?.panTo(currentCenter)
    }, [currentCenter])

    useEffect(() => {
        mapRef.current?.setZoom(currentZoom)
    }, [currentZoom])

    useEffect(() => {
        setMapLocation(currentCenter)
        setMapZoom(currentZoom)
    }, [])

    // useEffect(() => {
    //     mapRef.current?.zoom = currentZoom
    // }, [currentZoom])

    return (
        <Fragment>
            {isLoaded ?
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%', height: '100%'
                    }}
                    center={mapLocation}
                    zoom={currentZoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                />
                :
                <div>
                    Loading...
                </div>
            }
        </Fragment>
    )
}