import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FoodsList from "./components/food.component";

class App extends Component {
  render() {
    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <div>

        <div className="container mt-3">
          
            <FoodsList></FoodsList>
          
        </div>
      </div>
      </header>
    </div>
   );
  }
}

export default App;
