/* eslint-disable react/display-name */
// DO NO EDIT THIS FILE. Copy and paste this structure to create an individual tool
import React from 'react'

let _id = 0

const TOOL_NAME = {
  tool_name: {
      name: 'Tool Name',
      mongoObj: {_id, name: 'Tool Name', dimensionsLocation: 'WILL VARY'},
      DimensionsComponent: props => {
          return (
              <div>
                  <label>{/* Dimension Name */}</label>
                  <input
                    type="number"
                    value={props.layer.props.dimensionNameHere}
                    onChange={event => {
                        props.onChange('dimension name', event.target.value);
                    }}
                    />
              </div>
              // Depending on the tool, you may need multiple input fields
          )
      },
      ElementComponent: props => {
          return (
              <svg width={props.relevantDimension} height={props.relevantDimension}>
                  {/* WHAT GOES HERE WILL DEPEND ON YOUR TOOL <circle/> FOR CIRCLE OR <img/> FOR IMAGE, ETC.
                      SEE DOCUMENTATION FOR WHAT PROPS WOULD BE REQUIRED */}
              </svg>
          )
      },
      handleDoubleClick: function(layers, layersRef, x, y, color) {
        layersRef.push(this.create(x, y, 'NUMBER FOR DIMENSION(S)', color));
      },
      create: (x, y, DIMENSION = 'NUMBER FOR DIMENSION(S)', fill = "black") => {
        return {
          type: "Tool Name",
          x,
          y,
          props: {
            DIMENSION,
            fill
          }
        };
      }
  }
}

export default TOOL_NAME
