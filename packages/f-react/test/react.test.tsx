// @ts-nocheck
/* @jsx React.createElement */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCanvas from '../src';

const container = document.createElement('div');
document.body.appendChild(container);

const App = () => {
  return (
    <ReactCanvas width={100} height={100} className="newClass">
      <sector
        style={{
          fill: 'red',
          fillOpacity: 0.5,
          // lineWidth: 8,
          r: 59,
          r0: 30,
          startAngle: 0,
          endAngle: 90,
          stroke: '#fff',
          cx: 10,
          cy: 10,
          radius: [0, 8, 2, 0],
        }}
      />
    </ReactCanvas>
  );
};

ReactDOM.render(<App />, container);

describe('<Canvas >', () => {
  it('Canvas', () => {
    expect(true).toBe(true);
  });
});
