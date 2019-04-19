import React, { Component } from 'react';
import './App.css';

import Map from './components/map/Map';
import PinsList from './components/pins-list/PinsList';

class App extends Component {
  constructor() {
    super();
    this.state = {
      locations: []
    }
  }

  fetchLocations() {
    fetch('https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json')
      .then(response => response.json())
      .then(data => this.setState({locations: data}))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.fetchLocations();
  }

  render() {
    return (
      <div className="App">
        <PinsList locations={this.state.locations} />
        <Map locations={this.state.locations} />
      </div>
    );
  }
}

export default App;
