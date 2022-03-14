import React, {Fragment, Suspense, useEffect, useState} from "react";
import WorldMap from "./WorldMap";
import {Col, Container, Row} from "react-bootstrap";
import TravellerCard from "./traveller-card";
import JourneyCarousel from "./journey-carousel";
import '../../styles/home.css'
import {Link} from "react-router-dom";

export default function Home() {
    const [mapVisibility, setMapVisibility] = useState(true)

    function scrollControl() {
        if (window.scrollY > 200) {
            setMapVisibility(false)
        } else {
            setMapVisibility(true)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollControl)
    })


    return (
        <Fragment>
            <Suspense fallback={<div>Loading... </div>}>
                <WorldMap visibility={mapVisibility}/>
            </Suspense>

            <div className={"content__block__wrapper"}>
                <Container className={"content__block"}>
                    <Row>
                        <Col md={8} className={"content__block__text"}>
                            <h1>Suum cuique* (Лат)</h1>
                            <h2>*Каждому свое.</h2>
                            <p>С Платоном сложно не согласиться. Каждый из нас волен выбирать свою дорогу. Ты сам
                                определяешь,
                                как работать и как отдыхать. Ты сам определяешь сколько, когда и с кем. Мы всегда хотим
                                ярких
                                впечатлений и всегда ворчим, что нет времени и нет денег.

                                Мы всегда мечтаем о чем-то, что можно вспоминать всю жизнь.
                                ​
                                Это мой выбор. В один прекрасный день я решил, что сделаю это, сколько бы времени и
                                усилий это
                                не заняло. Я еду кругосветку… не отрываясь от работы. Вокруг света в Отпусках.</p>
                        </Col>
                        <Col md={{span: 3, offset: 1}}>
                            <img alt={'me'} className={'image__welcome'}
                                 src={process.env.PUBLIC_URL + '/assets/images/500x500-placeholder.png'}/>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className={"content__block__wrapper"}>
                <Container className={"content__block"}>
                    <Row>
                        <Col md={12} className={"content__block__text"}>
                            <h1>Почему мы, а не Я?</h1>
                            <p>Прежде всего - потому что большую часть пути я еду не один. Мы – это я + моя семья + мои
                                друзья.
                                Впервые сел на тяжелый мотоцикл в 2007. С 2008 езжу на Harley Davidson Softail Heritage
                                FLSTC. В 2009 сделал свой первый дальнобой с другом до Атлантики (Порту, Португалия), и
                                после этого проехал Европу вдоль и поперек, не покрытыми остались лишь островные
                                государства типа Исландии и Мальты.
                                В 2012 проехал с другом from coast to coast от Нью-Йорка до Лос-Анджелеса через Route
                                66.
                                25.06.2013 вполне можно считать отправной точкой. В этот день мы дошли до Скал Мохер в
                                Ирландии (Cliff of Moher) и наверное именно в этот день возникла идея ехать
                                кругосветку.</p>
                        </Col>
                    </Row>
                    <Row style={{paddingBottom: '2em'}}>
                        <Container className={"traveller__cards__wrapper"}>
                            <TravellerCard traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/300x500-placeholder.png`
                            }}/>
                            <TravellerCard traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/300x500-placeholder.png`
                            }}/>
                            <TravellerCard size={2} traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/600x500-placeholder.png`
                            }}/>
                            <TravellerCard traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/300x500-placeholder.png`
                            }}/>
                            <TravellerCard size={2} traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/600x500-placeholder.png`
                            }}/>
                            <TravellerCard traveller={{
                                name: 'Placeholder Name',
                                bio: 'Placeholder profile data',
                                image: `/assets/images/300x500-placeholder.png`
                            }}/>
                        </Container>
                    </Row>
                </Container>
            </div>

            <div className={"content__block__wrapper"}>
                <Row>
                    <Container className={"journey__carousel__wrapper"}>
                        <JourneyCarousel
                            article={
                                {
                                    title: 'Placeholder Title',
                                    distance: 1000,
                                    posts: 25,
                                    image: `/assets/images/1600x600-placeholder.png`
                                }
                            }/>
                    </Container>
                </Row>

            </div>

            <div className="content__block__wrapper buttons">
                <Container>
                    <Row>
                        <Col md={4}>
                            <div className={'link-button'}>
                                Все публикации
                            </div>
                        </Col>
                        <Col md={4}>
                            <Link to={'/globe'} style={{ textDecoration: 'none' }}>
                                <div className={'link-button'}>
                                    Карта мира
                                </div>
                            </Link>
                        </Col>
                        <Col md={4}>
                            <div className={'link-button'}>
                                Путешествия
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    )
}