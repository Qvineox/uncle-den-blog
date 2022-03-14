import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";

export default function AdventureMap({scrollPosition, mapData}) {
    const [mapState, setMapState] = useState({
        center: mapData.positions[0],
        zoom: 5
    })
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

    // change location on article scroll
    useEffect(() => {
        const closest = mapData.offsets.reduce((a, b) => {
            return Math.abs(b - scrollPosition) < Math.abs(a - scrollPosition) ? b : a;
        });

        setMapState(values => (
            {
                center: mapData.positions[mapData.offsets.indexOf(closest)],
                zoom: values.zoom
            }
        ))
    }, [mapData.offsets, mapData.positions, scrollPosition])

    useEffect(() => {
        mapRef.current?.panTo(mapState.center)
    }, [mapState.center])

    return (
        <Fragment>
            {isLoaded ?
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%', height: '100%'
                    }}
                    center={mapState.center}
                    zoom={mapState.zoom}
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