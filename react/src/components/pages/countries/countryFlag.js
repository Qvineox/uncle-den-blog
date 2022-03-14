import 'flag-icons/css/flag-icons.css'
import {Component, Fragment, useEffect, useRef, useState} from "react";
import '../../styles/countryFlag.css'
import {gsap} from "gsap";
//https://flagicons.lipis.dev/

export default function CountryFlag(props) {
    return (
        <Fragment>
            <div className={'country__flag__wrapper'}>
                <div className={`country__flag fib fi-${props.countryCode}`}/>
                <h2 className={"country__name"}>{props.countryName}</h2>
            </div>
        </Fragment>

    )
}