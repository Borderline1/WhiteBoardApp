export const picker = {
  name: 'picker',
  handleDragging: (
    selectedLayers,
    SLIPX, // Selected layer initial Position X
    SLIPY, // Selected layer intial Position Y
    prevX,
    prevY,
    clientX,
    clientY,
    socket
  ) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    const movedLayers = []
    selectedLayers.forEach((selectedLayer, idx) => {
      movedLayers.push({
        ...selectedLayer,
        x: SLIPX[idx] + movementX,
        y: SLIPY[idx] + movementY,
        props: selectedLayer.props
      })
    })
    socket.emit('massChange', movedLayers)
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
