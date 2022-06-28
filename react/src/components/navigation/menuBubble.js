import React, {Fragment, useEffect, useRef, useState} from "react";
import menuIcon from "../../icons/menu.png";
import bookIcon from "../../icons/book.png";
import mapIcon from "../../icons/pin.png";
import userIcon from "../../icons/account.png";
import gearIcon from "../../icons/setting.png";
import {gsap} from "gsap";
import '../styles/menuBubble.css'
import {Link} from "react-router-dom";

function MenuBubble(props) {
    const menuTop = useRef();
    const menuPosts = useRef();
    const menuMap = useRef();
    const menuAccount = useRef();
    const menuAdmin = useRef();

    let duration = 0.1
    let shift = 110

    let menuTimeline = gsap.timeline({paused: true});

    useEffect(() => {
        menuTimeline.to(menuPosts.current, {
            y: -shift,
            duration: duration
        }).to(menuMap.current, {
            y: -2 * shift,
            duration: duration
        }).to(menuAccount.current, {
            y: -3 * shift,
            duration: duration
        }).to(menuAdmin.current, {
            y: -4 * shift,
            duration: duration
        })
    })


    function activateMenu() {
        menuTimeline.play()
    }

    function deactivateMenu() {
        menuTimeline.reverse()
    }

    return (
        <Fragment>
            <div className={"menu"} onMouseEnter={activateMenu} onMouseLeave={deactivateMenu}>

                <Link to={"/"}>
                    <div ref={menuTop} className={"menu-bubble menu-bubble-top"}>
                        <img src={menuIcon} alt={"menu icon"}/>
                    </div>
                </Link>

                <Link to={'/journeys'}>
                    <div ref={menuPosts} className={"menu-bubble menu-bubble-posts"}>
                        <img src={bookIcon} alt={"book icon"}/>
                    </div>
                </Link>

                <Link to={"/regions"}>
                    <div ref={menuMap} className={"menu-bubble menu-bubble-map"}>
                        <img src={mapIcon} alt={"map icon"}/>
                    </div>
                </Link>

                <div ref={menuAccount} className={"menu-bubble menu-bubble-account"}>
                    <img src={userIcon} alt={"user icon"}/>
                </div>

                {props.isAdmin &&
                    <div ref={menuAdmin} className={"menu-bubble menu-bubble-admin"}>
                        <img src={gearIcon} alt={"user icon"}/>
                    </div>
                }
            </div>
        </Fragment>
    )
}

export default MenuBubble