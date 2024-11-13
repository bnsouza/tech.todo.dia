import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {motion} from "framer-motion";

const NetworkAnimation = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 60, 90], [0, 1, 0]); // Animação de entrada e saída

  const nodes = [
    {id: 1, x: 300, y: 200},
    {id: 2, x: 600, y: 400},
    {id: 3, x: 400, y: 700},
    {id: 4, x: 200, y: 600},
    {id: 5, x: 700, y: 300},
    // Adicione mais nós se precisar
  ];

  const connections = [
    {from: 1, to: 2},
    {from: 2, to: 3},
    {from: 3, to: 4},
    {from: 4, to: 5},
    {from: 5, to: 1},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
      <svg width="1000" height="1000" style={{opacity}}>
        {connections.map((conn, index) => {
          const startNode = nodes.find((n) => n.id === conn.from);
          const endNode = nodes.find((n) => n.id === conn.to);
          return (
            <motion.line
              key={index}
              x1={startNode.x}
              y1={startNode.y}
              x2={endNode.x}
              y2={endNode.y}
              stroke="black"
              strokeWidth="2"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5, delay: index * 0.1}}
            />
          );
        })}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="10"
            fill="blue"
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{duration: 0.5, delay: node.id * 0.1}}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export default NetworkAnimation;
