import {Fragment} from "react";
import MyGoogleMap from "../../../assets/myGoogleMap";
import {Link} from "react-router-dom";

export default function JourneyCard(props) {
    return (
        <Fragment>
            <div className="adventure-card">
                <div className={"adventure-card__map"}>
                    <div className="google-map">
                        <MyGoogleMap
                            center={props.journey.path[props.journey.path.length%2]}
                            zoom={4}
                            polyline={props.journey.path}/>
                    </div>
                </div>
                <div className="adventure-card__description">
                    <div className="adventure-card__text">
                        <h1>{props.journey.title}</h1>
                        <h2>{props.journey.description}</h2>
                        <hr/>
                        <h2>{props.journey.countries.map(country => {
                            return `${country.name}    `
                        })}</h2>
                        <hr/>
                    </div>
                    <div className={"adventure-card__stats"}>
                        <div className="adventure-card__stat">
                            <h2>{props.journey.countries.length}</h2>
                            <h3>Countries</h3>
                        </div>
                        <div className="adventure-card__stat">
                            <h2>{props.journey.article_set.length}</h2>
                            <h3>Articles</h3>
                        </div>
                        <div className="adventure-card__stat">
                            <h2>{props.journey.distance} km</h2>
                            <h3>Distance</h3>
                        </div>
                    </div>
                    <div className="adventure-card__button-wrapper">
                        <Link to={`/adventure/${props.journey.id}`} className={"adventure-card__button"}
                              style={{textDecoration: 'none'}}>
                            Смотреть
                        </Link>
                    </div>
                </div>
                <div className={"adventure-card__flags"}>
                    {props.journey.countries.map(country => {
                        return (
                            <div key={country.id} className={`fib fi-${country.code}`}/>
                        )
                    })}
                </div>
            </div>
        </Fragment>
    )
}