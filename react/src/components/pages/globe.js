import {Component, Fragment, useCallback, useRef, useState} from "react";
import {GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader} from "@react-google-maps/api";
import './../styles/globe.css'
import {Card, Spinner} from "react-bootstrap";


export function Globe(props) {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })

    return (
        <Fragment>
            <div className={"globe-map"}>
                {isLoaded ? <Map/> :
                    <Spinner className={"loading-map"} animation="border" role="status"/>}}
            </div>
        </Fragment>
    )
}

function Map() {
    const [hint, setHint] = useState(false)

    const mapRef = useRef(undefined)
    const center = {lat: 48.510994, lng: 4.301739};

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
                center={center}
                zoom={4}
                onLoad={onLoad}
                onUnmount={onUnmount}>

                <CustomMarker
                    info={
                        {
                            title: 'Ирландия',
                            description: 'Описание отсутствует',
                            distance: null,
                            image: '/assets/images/600x200-placeholder.png',
                            date: '24.01.2016'
                        }}
                    position={{lat: 52.971134, lng: -9.428664}}/>

                <CustomMarker
                    info={
                        {
                            title: 'Англия',
                            description: 'Описание отсутствует',
                            distance: null,
                            image: '/assets/images/600x200-placeholder.png',
                            date: '24.01.2016'
                        }}
                    position={{"lat": 51.52992, "lng": -0.12296}}/>

                <Polyline options={polylineOptions} path={[
                    {
                        "lat": 52.971134,
                        "lng": -9.428664
                    },
                    {
                        "lat": 52.665515,
                        "lng": -8.625551
                    },
                    {
                        "lat": 51.899986,
                        "lng": -8.475596
                    },
                    {
                        "lat": 52.253248,
                        "lng": -6.33446
                    },
                    {
                        "lat": 51.994901,
                        "lng": -4.96939
                    },
                    {
                        "lat": 51.591199,
                        "lng": -2.701989
                    },
                    {
                        "lat": 51.460473,
                        "lng": -0.973226
                    },
                    {
                        "lat": 51.432019,
                        "lng": -0.460593
                    },
                    {
                        "lat": 51.129292,
                        "lng": 1.309573
                    },
                    {
                        "lat": 50.954849,
                        "lng": 1.875619
                    },
                    {
                        "lat": 50.430092,
                        "lng": 2.824151
                    },
                    {
                        "lat": 50.300141,
                        "lng": 3.06904
                    },
                    {
                        "lat": 50.452271,
                        "lng": 3.685913
                    },
                    {
                        "lat": 50.467972,
                        "lng": 4.873262
                    },
                    {
                        "lat": 50.724672,
                        "lng": 6.146049
                    },
                    {
                        "lat": 50.436381,
                        "lng": 7.826814
                    },
                    {
                        "lat": 50.110395,
                        "lng": 8.682109
                    },
                    {
                        "lat": 49.671472,
                        "lng": 12.5579
                    },
                    {
                        "lat": 49.309492,
                        "lng": 14.151026
                    },
                    {
                        "lat": 48.978368,
                        "lng": 14.474392
                    },
                    {
                        "lat": 48.657803,
                        "lng": 14.453102
                    },
                    {
                        "lat": 48.640612,
                        "lng": 14.453623
                    },
                    {
                        "lat": 48.349917,
                        "lng": 14.525102
                    },
                    {
                        "lat": 48.24066,
                        "lng": 14.514817
                    },
                    {
                        "lat": 48.206487,
                        "lng": 16.36346
                    },
                    {
                        "lat": 48.756533,
                        "lng": 16.646456
                    },
                    {
                        "lat": 48.807902,
                        "lng": 16.638802
                    },
                    {
                        "lat": 49.192469,
                        "lng": 16.605124
                    },
                    {
                        "lat": 48.763238,
                        "lng": 16.885013
                    },
                    {
                        "lat": 48.688401,
                        "lng": 17.008297
                    },
                    {
                        "lat": 48.143488,
                        "lng": 17.10837
                    },
                    {
                        "lat": 48.030335,
                        "lng": 17.199117
                    },
                    {
                        "lat": 47.99002,
                        "lng": 17.195973
                    },
                    {
                        "lat": 47.672202,
                        "lng": 17.629599
                    },
                    {
                        "lat": 46.261599,
                        "lng": 20.150901
                    },
                    {
                        "lat": 46.13655,
                        "lng": 20.58706
                    },
                    {
                        "lat": 46.151768,
                        "lng": 20.475195
                    },
                    {
                        "lat": 45.750697,
                        "lng": 21.241707
                    },
                    {
                        "lat": 44.859396,
                        "lng": 22.386737
                    },
                    {
                        "lat": 45.040999,
                        "lng": 22.823901
                    },
                    {
                        "lat": 45.514882,
                        "lng": 23.09265
                    },
                    {
                        "lat": 45.796637,
                        "lng": 24.151772
                    },
                    {
                        "lat": 45.825026,
                        "lng": 24.977126
                    },
                    {
                        "lat": 44.428089,
                        "lng": 26.102437
                    },
                    {
                        "lat": 43.895768,
                        "lng": 25.966055
                    },
                    {
                        "lat": 43.845995,
                        "lng": 25.960602
                    },
                    {
                        "lat": 42.869177,
                        "lng": 25.314291
                    },
                    {
                        "lat": 42.748424,
                        "lng": 25.321047
                    },
                    {
                        "lat": 42.426029,
                        "lng": 25.63446
                    },
                    {
                        "lat": 41.720433,
                        "lng": 26.319021
                    },
                    {
                        "lat": 41.011218,
                        "lng": 28.978178
                    },
                    {
                        "lat": 40.611333,
                        "lng": 29.309207
                    },
                    {
                        "lat": 40.651144,
                        "lng": 35.828982
                    },
                    {
                        "lat": 41.290313,
                        "lng": 36.333772
                    },
                    {
                        "lat": 41.003488,
                        "lng": 39.724167
                    },
                    {
                        "lat": 41.517303,
                        "lng": 41.547693
                    },
                    {
                        "lat": 41.522123,
                        "lng": 41.551735
                    },
                    {
                        "lat": 41.651108,
                        "lng": 41.636267
                    },
                    {
                        "lat": 42.376964,
                        "lng": 42.600702
                    },
                    {
                        "lat": 41.843148,
                        "lng": 43.384047
                    },
                    {
                        "lat": 41.845116,
                        "lng": 44.720408
                    },
                    {
                        "lat": 41.693083,
                        "lng": 44.801561
                    }
                ]}/>
            </GoogleMap>
        </Fragment>
    )
}

export class CustomMarker extends Component {
    state = {
        showInfoWindow: false
    };

    handleMouseOver = e => {
        this.setState({
            showInfoWindow: true
        });
    };

    handleMouseExit = e => {
        this.setState({
            showInfoWindow: false
        });
    };

    render() {
        const {showInfoWindow} = this.state;

        return (
            <Marker position={this.props.position} onMouseOver=
                {this.handleMouseOver} onMouseOut={this.handleMouseExit}>
                {showInfoWindow && (
                    <InfoWindow>
                        <Card>
                            <Card.Img variant="top"
                                      src={process.env.PUBLIC_URL + this.props.info.image}/>
                            <Card.Body>
                                <Card.Title>{this.props.info.title}</Card.Title>
                                <Card.Text>{this.props.info.description}</Card.Text>
                            </Card.Body>
                            {this.props.info.distance && this.props.info.date &&
                                <Card.Footer>{this.props.info.distance}км от старта
                                    | {this.props.info.date}</Card.Footer>
                            }
                        </Card>
                    </InfoWindow>
                )}
            </Marker>
        );
    }
}