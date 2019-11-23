import React, {useEffect, useState} from 'react'
import SideBar from './components/SideBar'

import io from 'socket.io-client'
// import "./App.css";

const serverAddress = window.location.origin
console.log(serverAddress)

const App = () => {
  const canvas = document.querySelector('#canvas')
  const [socket, setSocket] = useState(null)
  const [color, setColor] = useState({r: 0, g: 0, b: 0, a: 255})
  const [toolId, setToolId] = useState('picker')
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [prevX, setprevX] = useState(0)
  const [prevY, setprevY] = useState(0)
  const [cursors, setCursors] = useState([])
  const [name, setName] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [cursorIsStale, setCursorIsStale] = useState(false)
  useInterval(() => setCursorIsStale(true), 3000)

  console.log(cursors)
  //this is componentDidMount
  //useEffect calls callback conditionally. Second arg: empty array, ensures componentDidMount behavior
  useEffect(() => {
    //useInterval hook
    //cursorisstale = usestate()false
    //useInterval(() => setCursorisstale(true), 3000) sends cursor data over socket
    //socket set-up
    const socket = io(serverAddress)
    setSocket(socket)
    //socket when we receive cursor data
    socket.on('cursor', data => {
      if (loaded) {
        setCursors(data)
      }
    })
    //updating cursor position if you didn't move. (important for resetting timer)
    //we need scrollX and Y because of 'infinite' whiteboard
    setInterval(() => {
      console.log('being set')
      if (loaded) {
        console.log(
          name,
          mouseX,
          mouseY,
          window.localStorage.getItem('sessionKey')
        )
        socket.emit('cursor', {
          name: name,
          x: mouseX + window.scrollX,
          y: mouseY + window.scrollY,
          sessionKey: window.localStorage.getItem('sessionKey')
        })
      }
    }, 3000)
  }, [])
  const handleNameInput = e => {
    const name = e.target.value
    setName(name)
  }
  const handleJoin = e => {
    fetch(serverAddress + '/create_user', {
      body: JSON.stringify({
        name
      }),
      method: 'post',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          localStorage.sessionKey = json.sessionKey
          setLoaded(true)
        }
      })
  }
  const handleToolClick = toolId => {
    setToolId(toolId)
  }
  const handleColorChange = color => {
    setColor(color)
  }
  const handleDisplayMouseMove = e => {
    if (socket) {
      const [clientX, clientY] = [e.clientX, e.clientY]
      setMouseX(clientX)
      setMouseY(clientY)

      socket.emit('cursor', {
        x: mouseX + window.scrollX,
        y: mouseY + window.scrollY,
        sessionKey: window.localStorage.getItem('sessionKey')
      })
    }
  }

  return (
    <div className="App">
      {loaded ? (
        <div>
          <SideBar
            brushColor={color}
            toolId={toolId}
            handleToolClick={handleToolClick}
            handleColorChange={handleColorChange}
          />
          <div
            id="canvas"
            style={{position: 'absolute', width: 1500, height: 1000}}
            onMouseMove={handleDisplayMouseMove}
            //   onMouseDown={this.handleDisplayMouseDown.bind(this)}
            //   onMouseUp={this.handleDisplayMouseUp.bind(this)}
          >
            {cursors.map(cursor => (
              <div
                key={cursor.sessionKey}
                className="cursor"
                style={{
                  position: 'absolute',
                  left: cursor.x + 8 + 'px',
                  top: cursor.y + 8 + 'px'
                }}
              >
                <div
                  style={{
                    borderRadius: '50px',
                    position: 'relative',
                    background: 'silver',
                    width: '4px',
                    height: '4px'
                  }}
                />{' '}
                {cursor.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="join-container">
          <input
            type="text"
            value={name}
            onChange={handleNameInput}
            className="join-input"
            placeholder="Enter a name to use ..."
          />
          <br />
          <button className="join-button" onClick={handleJoin}>
            Join
          </button>
        </div>
      )}
    </div>
  )
}
// class App extends Component {
//   // let radiusArr = [];
//   // for (let i = 0; i < 30; i++) {
//   //   radiusArr.push(5 * i);
//   // }
//   constructor(props) {
//     super(props)
//     this.display = React.createRef()
//     this.socket = null
//     this.state = {
//       brushColor: {r: 0, g: 0, b: 0, a: 255},
//       brushSize: 3,
//       toolId: 'pen',
//       isPenDown: false,
//       mouseX: 0,
//       mouseY: 0,
//       prevX: 0,
//       prevY: 0,
//       cursors: [],
//       name: '',
//       loaded: false
//     }
//   }
//   componentDidMount() {
//     this.socket = io(serverAddress)
//     this.socket.on('line', data => {
//       if (this.state.loaded) {
//         const [x1, y1, x2, y2] = data.lineCoordinates
//         const displayCtx = this.display.current.getContext('2d')
//         displayCtx.lineWidth = data.lineWidth
//         displayCtx.strokeStyle = `rgba(${data.lineColor.r},${data.lineColor.g},${data.lineColor.b},${data.lineColor.a})`
//         displayCtx.beginPath()
//         displayCtx.moveTo(x1, y1)
//         displayCtx.lineTo(x2, y2)
//         displayCtx.stroke()
//       }
//     })
//     this.socket.on('cursor', data => {
//       if (this.state.loaded) {
//         // console.log(data) // reflect this data as positions of cursors yet to be designed
//         //exclude yourself
//         // map data to svgs, and update their positions

//         this.setState({cursors: data})
//       }
//     })
//     setInterval(() => {
//       if (this.state.loaded) {
//         this.socket.emit('cursor', {
//           name: this.state.name,
//           x: this.state.mouseX + window.scrollX,
//           y: this.state.mouseY + window.scrollY,
//           sessionKey: window.localStorage.getItem('sessionKey')
//         })
//       }
//     }, 3000)
//   }
//   handleNameInput(e) {
//     this.setState({name: e.target.value})
//   }
//   handleJoin(e) {
//     fetch(serverAddress + '/create_user', {
//       body: JSON.stringify({
//         name: this.state.name
//       }),
//       method: 'post',
//       cache: 'no-cache',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => response.json())
//       .then(json => {
//         if (json.success) {
//           localStorage.sessionKey = json.sessionKey
//           this.setState({loaded: true})
//         }
//       })
//   }
//   handleToolClick(toolId) {
//     this.setState({toolId})
//   }
//   handleColorChange(color) {
//     this.setState({brushColor: color.rgb})
//   }
//   handleDisplayMouseMove(e) {
//     this.setState({
//       mouseX: e.clientX,
//       mouseY: e.clientY
//     })
//     if (this.state.isPenDown) {
//       this.display.current.getContext('2d').lineCap = 'round'
//       const {top, left} = this.display.current.getBoundingClientRect()
//       switch (this.state.toolId) {
//         case 'pen':
//           this.socket.emit('line', {
//             lineWidth: this.state.brushSize,
//             lineColor: this.state.brushColor,
//             lineCoordinates: [
//               this.state.prevX - left,
//               this.state.prevY - top,
//               this.state.mouseX - left,
//               this.state.mouseY - top
//             ],
//             sessionKey: window.localStorage.getItem('sessionKey')
//           })
//           break
//         case 'eraser':
//           this.socket.emit('line', {
//             lineWidth: this.state.brushSize,
//             lineColor: {r: 255, g: 255, b: 255, a: this.state.brushColor.a},
//             lineCoordinates: [
//               this.state.prevX,
//               this.state.prevY,
//               this.state.mouseX,
//               this.state.mouseY
//             ],
//             sessionKey: window.localStorage.getItem('sessionKey')
//           })
//           break
//       }
//     }
//     this.setState({
//       prevX: this.state.mouseX,
//       prevY: this.state.mouseY
//     })
//     if (!this.state.isPenDown) {
//       this.setState({
//         prevX: e.clientX,
//         prevY: e.clientY
//       })
//     }
//     this.socket.emit('cursor', {
//       x: this.state.mouseX + window.scrollX,
//       y: this.state.mouseY + window.scrollY,
//       sessionKey: window.localStorage.getItem('sessionKey')
//     })
//   }
//   handleDisplayMouseDown(e) {
//     this.setState({isPenDown: true})
//   }
//   handleDisplayMouseUp(e) {
//     this.setState({isPenDown: false})
//   }
//   handleBrushResize(e) {
//     this.setState({brushSize: e.target.value})
//   }

//   render() {
//     return (
//       <div className="App">
//         {this.state.loaded ? (
//           <div>
//             <SideBar
//               brushSize={this.state.brushSize}
//               brushColor={this.state.brushColor}
//               toolId={this.state.toolId}
//               handleToolClick={this.handleToolClick.bind(this)}
//               handleColorChange={this.handleColorChange.bind(this)}
//               handleBrushResize={this.handleBrushResize.bind(this)}
//             />
//             <div
//               id="canvas"
//               width={`${Number(window.screen.width) * 5}`}
//               height={`${Number(window.screen.availHeight) * 5}`}
//               ref={this.display}
//               onMouseMove={this.handleDisplayMouseMove.bind(this)}
//               onMouseDown={this.handleDisplayMouseDown.bind(this)}
//               onMouseUp={this.handleDisplayMouseUp.bind(this)}
//             />

//             {this.state.cursors.map(cursor => (
//               <div
//                 key={cursor.sessionKey}
//                 className="cursor"
//                 style={{
//                   position: 'absolute',
//                   left: cursor.x + 8 + 'px',
//                   top: cursor.y + 8 + 'px'
//                 }}
//               >
//                 <div
//                   style={{
//                     borderRadius: '50px',
//                     position: 'relative',
//                     background: 'silver',
//                     width: '4px',
//                     height: '4px'
//                   }}
//                 />{' '}
//                 {cursor.name}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="join-container">
//             <input
//               type="text"
//               value={this.state.name}
//               onChange={this.handleNameInput.bind(this)}
//               className="join-input"
//               placeholder="Enter a name to use ..."
//             />
//             <br />
//             <button
//               className="join-button"
//               onClick={this.handleJoin.bind(this)}
//             >
//               Join
//             </button>
//           </div>
//         )}
//       </div>
//     )
//   }
// }

export default App
