import React, {Component} from 'react';
import Container from "./Container"
import Svg from "./Svg"
import Preloader from "./Preloader"

class App extends Component {
  state = {
    techSalaries: []
  }

  render() {
    const { techSalaries} = this.state
    if (techSalaries.length < 1) {
      return <Preloader />
    }
    return (
      <div className="App"></div>
    );

  }

}

export default App;
