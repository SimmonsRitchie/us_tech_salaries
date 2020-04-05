import React from "react";
import * as d3 from "d3";

import HistogramBar from "./HistogramBar";

class Histogram extends React.Component {
  state = {
    histogram: d3.histogram(),
    widthScale: d3.scaleLinear(),
    yScale: d3.scaleLinear(),
  };

  static getDerivedStateFromProps(props, state) {
    /*
     * We use getDerivedStateFromProps to update the range and domain of our
     * scales (which are stored in state).
     */

    let { histogram, widthScale, yScale } = state;

    histogram.thresholds(props.bins).value(props.value);

    /*
     * GET BARS
     * thresholds() specifies how many bins we want
     * value() specifies the value accessor func
     * in this case we get both values from props
     */
    histogram.thresholds(props.bins).value(props.value);
    /*
     * we feed our data in to get our bars. The returned val
     * is an array containing:
     * 1) the associated elements from the input data
     * 2) x0 - the lower bound of the bin (inclusive).
     * 3) x1 - the upper bound of the bin (exclusive, except for the last bin).
     */
    const bars = histogram(props.data),
      counts = bars.map((d) => d.length);
    /*
     * SET BAR WIDTH
     * We get the number of items in each bar and then feed that to
     * widthScale to calculate their width.
     * Usually a histogram sets bars vertically but ours is set horizontally
     */
    widthScale
      .domain([d3.min(counts), d3.max(counts)])
      .range([0, props.width - props.axisMargin]);
    /*
     * SET BAR HEIGHT
     * We set our domain based on the biggest x1 (upper bound) in
     * our bars. We set height based on our height and margin props.
     * This is a little confusing for two reasons:
     * 1) d3 expects us to set up bars vertically, so the values it returns
     * from histogram() are x0 and x1, referring to the x axis - but we're
     * using them on the y axis.
     * 2) SVG coordinates refer to 0,0 as the top left. So we set our range as the full
     * height and then subtract.
     */
    yScale
      .domain([0, d3.max(bars, (d) => d.x1)])
      .range([props.height - props.y - props.bottomMargin, 0]);

    return {
      ...state,
      histogram,
      widthScale,
      yScale,
    };
  }

  makeBar = (bar, N) => {
    const { yScale, widthScale } = this.state;

    // We create a percentage label by dividing the number of items in our bar
    // by the number of items in our full dataset
    let percent = (bar.length / this.props.data.length) * 100;

    let props = {
      percent,
      x: this.props.axisMargin,
      y: yScale(bar.x1),
      width: widthScale(bar.length),
      height: yScale(bar.x0) - yScale(bar.x1),
      key: `histogram-bar-${bar.x0}`,
    };

    return <HistogramBar {...props} />;
  };

  render() {
    const { histogram, yScale } = this.state,
      { x, y, data, axisMargin } = this.props;

    const bars = histogram(data);

    return (
      <g className="histogram" transform={`translate(${x}, ${y})`}>
        <g className="bars">{bars.map(this.makeBar)}</g>
      </g>
    );
  }
}

export default Histogram;
