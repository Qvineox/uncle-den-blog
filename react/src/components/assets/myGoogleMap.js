import {Fragment, useRef, useCallback} from "react";
import {DirectionsRenderer, GoogleMap, Polyline} from "@react-google-maps/api";


export default function MyGoogleMap(props) {
    const mapRef = useRef(undefined)

    // const path = props.polyline?.map((item) => {
    //     return {lat: item[0], lng: item[1]}
    // })

    const polylineOptions = {
        strokeColor: '#FF0E0E',
        strokeOpacity: 0.85,
        strokeWeight: 3,
        fillColor: '#FF0E0E',
        fillOpacity: 1,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    };

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined
    }, [])

    return (
        <Fragment>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={props.center}
                zoom={props.zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Polyline path={props.polyline} options={polylineOptions}/>
            </GoogleMap>
        </Fragment>
    )
}