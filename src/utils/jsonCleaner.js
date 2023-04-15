const cleanNode = (node) => {
    const {
      position,
      width,
      height,
      positionAbsolute,
      dragging,
      selected,
      ...cleanedNode
    } = node;
    return cleanedNode;
  };
  
  export const cleanJson = (json) => {
    const cleanedNodes = json.nodes.map(cleanNode);
    const cleanedEdges = json.edges; // Assuming you don't want to clean edges.
    return { nodes: cleanedNodes, edges: cleanedEdges };
  };