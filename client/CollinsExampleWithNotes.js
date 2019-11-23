// Usual Imports here
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import RedBox from 'redbox-react'
import './styles.css'

// Utilizing Firebase as his database. Not too different from Mongo
// In this exercise his Database is his stateful component of the program
// Meaning that each client is listening to changes on the database
// to update their view/ canvas
import * as firebase from 'firebase'

// Firebase hooks. They are realtime listeners of the database
import {useList, useObject} from 'react-firebase-hooks/database'

// Initializing Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    projectName: 'shapez-996a2',
    apiKey: 'VERY SECRET',
    databaseURL: 'https://shapez-996a2.firebaseio.com'
  })
}

// Defining Database location so we can access it later
const database = firebase.database()

// Dirty way to make uuids, I believe this is not used since he made Firebase a part of the thing
let _id = 0
const makeId = () => _id++

// Types Object/ Tools object. Contains a lot of functionality that is independent for each tool type
const types = {
  circle: {
    name: 'Circle', // Name, comments included for circle only
    FormComponent: props => {
      // Form render component. For a circle the relevant props are radius
      return (
        <div>
          <label>Radius</label>
          <input
            type="number"
            value={props.layer.props.radius}
            //
            onChange={event => {
              props.onChange('radius', event.target.value)
            }}
          />
        </div>
      )
    },
    CanvasComponent: props => {
      // Canvas render component. can be any element
      return (
        <svg width={props.radius * 2} height={props.radius * 2}>
          <circle
            cx={props.radius}
            cy={props.radius}
            r={props.radius}
            fill={props.fill}
          />
        </svg>
      )
    },
    // handle double click. Since double click is unique from all the other click listeners,
    // its a little easier to not have colliding listeners
    // we can also implement other ways to create objects, like shortcut keys, etc
    handleDoubleClick: function(layers, layersRef, x, y, color) {
      // layersRef is a reference to the firebase database defined on line
      layersRef.push(this.create(x, y, 10, color))
    },

    //create function that takes inputs and returns a formatted object to store on the DB
    create: (x, y, radius = 10, fill = 'black') => {
      return {
        type: 'circle',
        x,
        y,
        props: {
          radius,
          fill
        }
      }
    }
  },
  rect: {
    // same thing but for rectangles
    name: 'Rect',
    FormComponent: props => {
      return (
        <>
          <div>
            <label>Width</label>
            <input
              type="number"
              value={props.layer.props.width}
              onChange={event => {
                props.onChange('width', event.target.value)
              }}
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="number"
              value={props.layer.props.height}
              onChange={event => {
                props.onChange('height', event.target.value)
              }}
            />
          </div>
        </>
      )
    },
    CanvasComponent: props => {
      return (
        <svg width={props.width} height={props.height}>
          <rect width={props.width} height={props.height} fill={props.fill} />
        </svg>
      )
    },
    handleDoubleClick: function(layers, layersRef, x, y, color) {
      layersRef.push(this.create(x, y, 50, 25, color))
    },
    create: (x, y, width = 50, height = 25, fill = 'black') => {
      return {
        type: 'rect',
        x,
        y,
        props: {
          width,
          height,
          fill
        }
      }
    }
  }
}

// types of tools array
const typeEntries = Object.entries(types)

function App() {
  //Firebase references
  const docId = 'example-doc'
  const doc = database.ref(docId)
  // relevant states: which tool, indicated layer, selected layer
  const [selectedTool, setSelectedTool] = useState(types.circle)
  const [indicatedLayerId, setIndicatedLayerId] = useState(null)
  const [selectedLayerId, setSelectedLayerId] = useState(null)

  // referencing all chidren of the "example-doc" above
  const layersRef = doc.child('layers')

  // firebase hook that takes all snapshots of all layers
  const [snapshots, loading, error] = useList(layersRef)

  // very important step. mapping the firebase references to a layers array
  // these new layers are in the format of:
  /*
   *{
   *    type: "string that identifies object",
   *    id: key - probably a string maybe a number,
   *    x,
   *    y,
   *    props:{unique props for this type of object}
   *}
   */

  const layers = snapshots.map(s => {
    return {...s.val(), type: types[s.val().type], id: s.key}
  })

  // using state to find and define which layer is selected or indicated (hovered)
  const selectedLayer = layers.find(layer => layer.id === selectedLayerId)
  const indicatedLayer = layers.find(layer => layer.id === indicatedLayerId)

  // state that tracks dragging
  const [dragging, setDragging] = useState(false)

  // simple useEffect that adds event listeners to the canvas and window
  useEffect(() => {
    const mouseDown = () => setDragging(true)
    const mouseUp = () => setDragging(false)
    const canvas = document.querySelector('#canvas')
    if (!canvas) return
    canvas.addEventListener('mousedown', mouseDown)
    window.addEventListener('mouseup', mouseUp)
    return () => {
      canvas.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mouseup', mouseUp)
    }
  })

  // state that controls color
  const [color, setColor] = useState('#105376')

  // loading and error states( determined by firebase Hook )
  if (loading) return 'Loading...'
  if (error) return 'Error...'

  // render section
  return (
    <>
      <header id="instructions">
        <p>Double click in canvas to add shapes</p>
        <p>Select shape/color in tool palette</p>
        <p>Click or drag on shape to edit</p>
      </header>

      {/* Left side toolbar, has color picker, and list of tools */}
      <div id="tools">
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />

        {/* map of buttons */}
        {typeEntries.map(([key, type]) => {
          const selected = selectedTool === type
          return (
            <button
              onClick={() => setSelectedTool(type)}
              className={selected ? 'selected' : ''}
              key={key}
            >
              {type.name}
            </button>
          )
        })}
      </div>

      {/* div representing canvas. fills between sidebars */}
      <div
        id="canvas"
        // dragging events, we could also do our emit cursor position in this action
        onMouseMove={event => {
          if (dragging) {
            const canvas = event.target.closest('#canvas')
            const y = event.pageY - canvas.offsetTop
            const x = event.pageX - canvas.offsetLeft
            if (indicatedLayer && !selectedLayer) {
              setSelectedLayerId(indicatedLayerId)
            }
            if (selectedLayer) {
              // so instead of updating the database every move, we might set a field
              // to changed == true and start a set timeout on the server
              // if other changes come in it resets the timeout, up to a limit of 5 changes
              // our server will handle the state of layers. we push updates to this, and then it
              // emits the new array to everyone, updating their dom
              layersRef.child(selectedLayer.id).update({x, y})
            }
          }
        }}
        // Double click to create
        onDoubleClick={event => {
          // closest may be useful in some situations
          const canvas = event.target.closest('#canvas')
          const y = event.pageY - canvas.offsetTop
          const x = event.pageX - canvas.offsetLeft

          // uses type handleDoubleClick
          selectedTool.handleDoubleClick(layers, layersRef, x, y, color)
        }}
      >
        {/* Map out all of our layers from the DB */}
        {layers.map(layer => {
          return (
            <div
              key={layer.id}
              onMouseEnter={() => setIndicatedLayerId(layer.id)}
              onMouseLeave={() => setIndicatedLayerId(null)}
              onMouseDown={() => {
                setSelectedLayerId(layer.id)
              }}
              onMouseUp={() => {
                if (dragging) return
                if (layer === selectedLayer) setSelectedLayerId(null)
                else setSelectedLayerId(layer.id)
              }}
              className={className('layer', {
                indicated: layer === indicatedLayer,
                selected: layer === selectedLayer
              })}
              style={{position: 'absolute', top: layer.y, left: layer.x}}
            >
              {/* this layers canvas component */}
              <layer.type.CanvasComponent {...layer.props} />
            </div>
          )
        })}
      </div>
      <div id="form" key={selectedLayerId}>
        {selectedLayer && (
          <>
            <p>Selected layer {selectedLayer.id}</p>
            <div>
              <label>Fill Color</label>
              <input
                type="color"
                value={selectedLayer.props.fill}
                onChange={event => {
                  layersRef
                    .child(selectedLayer.id)
                    .child('props')
                    .child('fill')
                    .set(event.target.value)
                }}
              />
            </div>
            <div>
              <label>X Pos</label>
              <input
                type="number"
                value={selectedLayer.x}
                onChange={event => {
                  layersRef
                    .child(selectedLayer.id)
                    .child('x')
                    .set(Number(event.target.value))
                }}
              />
            </div>
            <div>
              <label>Y Pos</label>
              <input
                type="number"
                value={selectedLayer.y}
                onChange={event => {
                  layersRef
                    .child(selectedLayer.id)
                    .child('y')
                    .set(Number(event.target.value))
                }}
              />
            </div>
            <selectedLayer.type.FormComponent
              layer={selectedLayer}
              layersRef={layersRef}
              onChange={(propName, value) => {
                layersRef
                  .child(selectedLayer.id)
                  .child('props')
                  .child(propName)
                  .set(value)
              }}
            />
          </>
        )}
      </div>
      <div id="layers">
        {layers.map(layer => {
          return (
            <div
              key={layer.id}
              onMouseEnter={() => setIndicatedLayerId(layer.id)}
              onMouseLeave={() => setIndicatedLayerId(null)}
              onClick={() => {
                if (layer === selectedLayer) setSelectedLayerId(null)
                else setSelectedLayerId(layer.id)
              }}
              className={className('layer', {
                indicated: layer === indicatedLayer,
                selected: layer === selectedLayer
              })}
            >
              <div>A {layer.type.name}</div>
              <button
                onClick={() => {
                  layersRef.child(layer.id).remove()
                }}
              >
                Delete
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {hasError: false}
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return {hasError: true, error}
//   }

//   componentDidCatch(error, errorInfo) {
//     // You can also log the error to an error reporting service
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       //return <RedBox error={this.state.error} />;
//     }

//     return this.props.children
//   }
// }
const rootElement = document.getElementById('root')
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
)
