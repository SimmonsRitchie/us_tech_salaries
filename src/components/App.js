import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";
import Preloader from "./Preloader";
import { loadAllData } from "../DataHandling";
import CountyMap from "./CountyMap";
import Histogram from "./Histogram";

class App extends Component {
  state = {
    techSalaries: [],
    medianIncomes: [],
    countyNames: [],
  };

  componentDidMount() {
    loadAllData((data) => this.setState(data));
  }

  countyValue(county, techSalariesMap) {
    const medianHousehold = this.state.medianIncomes[county.id],
      salaries = techSalariesMap[county.name];

    if (!medianHousehold || !salaries) {
      return null;
    }

    const median = d3.median(salaries, (d) => d.base_salary);

    return {
      countyID: county.id,
      value: median - medianHousehold.medianIncome,
    };
  }

  render() {
    const { techSalaries, countyNames, usTopoJson, USstateNames } = this.state;
    if (techSalaries.length < 1) {
      return <Preloader />;
    }

    const filteredSalaries = techSalaries,
      filteredSalariesMap = _.groupBy(filteredSalaries, "countyID"),
      countyValues = countyNames
        .map((county) => this.countyValue(county, filteredSalariesMap))
        .filter((d) => !_.isNull(d));

    let zoom = null;

    return (
      <div className="App container">
        <svg width="1100" height="500">
          <CountyMap
            usTopoJson={usTopoJson}
            USstateNames={USstateNames}
            values={countyValues}
            x={0}
            y={0}
            width={500}
            height={500}
            zoom={zoom}
          />
          <Histogram
            bins={10}
            width={500}
            height={500}
            x={500}
            y={10}
            data={filteredSalaries}
            axisMargin={83}
            bottomMargin={5}
            // we use a func because easier to reuse component
            value={(d) => d.base_salary}
          />
        </svg>
      </div>
    );
  }
}

export default App;
