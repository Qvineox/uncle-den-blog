import {Fragment} from "react";
import '../../styles/countries.css'
import CountryFlag from "./countryFlag";

export default function Countries() {
    return (
        <Fragment>
            <div className={"page-header"}>
                <h1 className={"countries__block__header"}>Все Регионы</h1>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    Europe
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'at'} countryName={"Austria"}/>
                    <CountryFlag countryCode={'be'} countryName={"Belgium"}/>
                    <CountryFlag countryCode={'ro'} countryName={"Romania"}/>
                    <CountryFlag countryCode={'hu'} countryName={"Hungary"}/>
                    <CountryFlag countryCode={'bg'} countryName={"Bulgaria"}/>
                    <CountryFlag countryCode={'sk'} countryName={"Slovakia"}/>
                    <CountryFlag countryCode={'de'} countryName={"Germany"}/>
                    <CountryFlag countryCode={'fr'} countryName={"France"}/>
                    <CountryFlag countryCode={'cz'} countryName={"Czech Republic"}/>
                </div>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    Great<br/>Britain
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'ie'} countryName={"Ireland"}/>
                    <CountryFlag countryCode={'gb-eng'} countryName={"England"}/>
                </div>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    Near<br/>East
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'am'} countryName={"Armenia"}/>
                    <CountryFlag countryCode={'tr'} countryName={"Turkey"}/>
                    <CountryFlag countryCode={'ae'} countryName={"United Arab Emirates"}/>
                </div>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    South<br/>East
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'pk'} countryName={"Pakistan"}/>
                    <CountryFlag countryCode={'in'} countryName={"India"}/>
                    <CountryFlag countryCode={'bt'} countryName={"Bhutan"}/>
                    <CountryFlag countryCode={'np'} countryName={"Nepal"}/>
                </div>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    South<br/>Asia
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'id'} countryName={"Indonesia"}/>
                    <CountryFlag countryCode={'mm'} countryName={"Myanmar"}/>
                    <CountryFlag countryCode={'my'} countryName={"Malaysia"}/>
                    <CountryFlag countryCode={'th'} countryName={"Thailand"}/>
                </div>
            </div>


            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    South<br/>America
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'cl'} countryName={"Chile"}/>
                </div>
            </div>

            <div className={"region__wrapper"}>
                <h2 className={"region__title"}>
                    <hr/>
                    Australia
                </h2>

                <div className={"region__flags__wrapper"}>
                    <CountryFlag countryCode={'au'} countryName={"Australia"}/>
                </div>
            </div>
        </Fragment>
    )
}