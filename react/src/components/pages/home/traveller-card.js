import React, {useEffect, useRef, useState} from "react";
import '../../styles/traveller-card.css'
import {gsap} from "gsap";

export default function TravellerCard(props) {
    const [size, setSize] = useState('traveller__card__single')

    let cardInfo = useRef()
    let cardImage = useRef()

    let cardInfoAnimation = gsap.fromTo(cardInfo.current, {opacity: 0}, {opacity: 1}).pause()
    let cardImageAnimation = gsap.fromTo(cardImage.current, {opacity: 1}, {opacity: 0}).pause()

    useEffect(() => {
        if (props.size === 2) {
            setSize('traveller__card__double')
        }
    }, [props.size])

    function showInfo() {
        cardInfoAnimation.play()
        cardImageAnimation.play()
    }

    function hideInfo() {
        cardInfoAnimation.reverse()
        cardImageAnimation.reverse()
    }

    return (
        <div className={size} onPointerEnter={showInfo} onPointerLeave={hideInfo}>
            <div ref={cardInfo} className={"traveller__card__info"}>
                <span className={"traveller__card__info__name"}>
                    {props.traveller.name}
                </span>
                <span className={"traveller__card__info__profile"}>
                    {props.traveller.bio}
                </span>
            </div>
            <img ref={cardImage} src={process.env.PUBLIC_URL + props.traveller.image}
                 className="traveller__card__image" alt={props.traveller.name}/>
        </div>
    )
}