import {Fragment} from "react";
import {Link} from "react-router-dom";

export default function JourneyCard({journeyData}) {
    return (
        <Fragment>
            <div className="journey-item">
                <div className="journey-item__card">
                    {journeyData.image &&
                        <div className="journey-item__card__map-image">
                            <img src={`${process.env.REACT_APP_BACKEND_HOST}${journeyData.image}`}/>
                        </div>
                    }
                    <div className="journey-item__card__info">
                        <div className="journey-item__card__info_id">
                            <h1>{journeyData.title}</h1>
                            <h2>{journeyData.description}</h2>
                        </div>
                        <hr/>
                        <div className="journey-item__card__info_stats">
                            <h2><b>Расстояние</b><br/>{journeyData.distance} км</h2>
                            <h2><b>Стран пройдено</b><br/>{journeyData.countries.length}</h2>
                            <h2><b>Статей написано</b><br/>{journeyData.article_set.length}</h2>
                        </div>
                        <hr/>
                        <div className="journey-item__card__article-list">
                            {journeyData.article_set.length === 0 ? (<h2>Статей пока нет...</h2>)
                                : (
                                    <Fragment>
                                        <h2><b>Статьи</b></h2>
                                        <ul>
                                            {journeyData.article_set.slice(0, 3).map(article => {
                                                return (
                                                    <li key={article.id}>
                                                        <div>
                                                            <Link to={`/articles/${article.id}`}
                                                                  style={{textDecoration: 'none'}}>
                                                                <h3>{article.title}...</h3>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </Fragment>
                                )
                            }
                        </div>
                    </div>
                    <div className={"journey-item__card__flags"}>
                        {journeyData.countries.map(country => {
                            return (
                                <div key={country.id} className={`fib fi-${country.code}`}/>
                            )
                        })}
                    </div>
                </div>
                {journeyData.article_set.length > 0 &&
                    <div className="journey-item__footer">
                        <Link to={`/journeys/${journeyData.id}`} style={{textDecoration: 'none'}}>
                            <h2><b>Начать просмотр</b></h2>
                        </Link>
                    </div>
                }
            </div>
        </Fragment>
    )
}