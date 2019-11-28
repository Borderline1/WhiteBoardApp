import React from 'react'

export const picker = {
  name: 'picker',
  handleDragging: (
    selectedLayer,
    SLIPX,
    SLIPY,
    prevX,
    prevY,
    clientX,
    clientY,
    socket
  ) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY

    socket.emit('change', {
      ...selectedLayer,
      x: SLIPX + movementX,
      y: SLIPY + movementY,
      props: selectedLayer.props
    })
  },
  handleLasso: () => {}
}
