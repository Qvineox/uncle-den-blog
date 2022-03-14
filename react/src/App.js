import React, {useState} from "react";
import './App.css';
import MenuBubble from "./components/navigation/menuBubble";
import {FpsView} from "react-fps";
import Home from "./components/pages/home/home";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Regions from "./components/pages/countries/countries";
import Adventures from "./components/pages/adventures/adventures";
import {Globe} from "./components/pages/globe";
import Adventure from "./components/pages/adventure/adventure";
import Adventure2 from "./components/pages/adventure/adventure_v2";

function App() {
    // TODO: Authorization handling component
    const [token, setToken] = useState();

    localStorage.setItem('isAdmin', true);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" exact element={<Home/>}/>
                    <Route path="/regions" exact element={<Regions/>}/>
                    <Route path="/adventure/:id" element={<Adventure/>}/>
                    <Route path="/adventure_v2/:id" element={<Adventure2/>}/>
                    <Route path="/adventures" exact element={<Adventures/>}/>
                    <Route path="/globe" exact element={<Globe/>}/>
                </Routes>

                <MenuBubble isAdmin={false}/>
                <FpsView width={120} height={50}/>
            </div>
        </Router>
    );
}

export default App;
