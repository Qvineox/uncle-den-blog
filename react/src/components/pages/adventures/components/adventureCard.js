import {Fragment} from "react";
import MyGoogleMap from "../../../assets/myGoogleMap";
import {Link} from "react-router-dom";

export default function AdventureCard(props) {
    return (
        <Fragment>
            <div className="adventure-card">
                <div className={"adventure-card__map"}>
                    <div className="google-map">
                        <MyGoogleMap
                            center={props.adventure.path[props.adventure.path.length/2]}
                            zoom={4}
                            polyline={props.adventure.path}/>
                    </div>
                </div>
                <div className="adventure-card__description">
                    <div className="adventure-card__text">
                        <h1>{props.adventure.title}</h1>
                        <h2>{props.adventure.description}</h2>
                        <hr/>
                        <h2>{props.adventure.countries.map(country => {
                            return `${country.name}    `
                        })}</h2>
                        <hr/>
                    </div>
                    <div className={"adventure-card__stats"}>
                        <div className="adventure-card__stat">
                            <h2>{props.adventure.countries.length}</h2>
                            <h3>Countries</h3>
                        </div>
                        <div className="adventure-card__stat">
                            <h2>???</h2>
                            <h3>Posts</h3>
                        </div>
                        <div className="adventure-card__stat">
                            <h2>{props.adventure.distance} km</h2>
                            <h3>Distance</h3>
                        </div>
                    </div>
                    <div className="adventure-card__button-wrapper">
                        <Link to={`/adventure/${props.adventure.id}`} className={"adventure-card__button"}
                              style={{textDecoration: 'none'}}>
                            Смотреть
                        </Link>
                    </div>
                </div>
                <div className={"adventure-card__flags"}>
                    {props.adventure.countries.sort((a, b) => (a.latestVisit > b.latestVisit) ? 1 : -1).map(country => {
                        return (
                            <div className={`fib fi-${country.code}`}/>
                        )
                    })}
                </div>
            </div>
        </Fragment>
    )
}