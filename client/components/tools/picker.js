import React from 'react'

export const picker = {
  name: 'picker',
  handleDragging: (
    selectedLayers,
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

    selectedLayers.forEach(selectedLayer => {
      socket.emit('change', {
        ...selectedLayer,
        x: SLIPX + movementX,
        y: SLIPY + movementY,
        props: selectedLayer.props
      })
    })
  },
  handleLasso: (
    clientX,
    clientY,
    prevX,
    prevY,
    setLasso,
    setIndicatedLayerIds,
    clientLayers
  ) => {
    const x = Math.min(clientX, prevX)
    const y = Math.min(clientY, prevY)
    const width = Math.abs(prevX - clientX)
    const height = Math.abs(prevY - clientY)
    setLasso({x, y, width, height})
    const layersToIndicateIds = clientLayers.reduce((acc, layer) => {
      if (layer.x < x + width && layer.x > x) {
        if (layer.y < y + height && layer.y > y) {
          acc.push(layer.id)
        }
      }
      return acc
    }, [])
    setIndicatedLayerIds(layersToIndicateIds)
  }
}
