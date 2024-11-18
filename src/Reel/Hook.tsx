import {interpolate, Sequence, useCurrentFrame} from "remotion";

export const Hook = () => {
  const frame = useCurrentFrame();

  // Bits appearing sequentially
  const bitOpacity = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: "clamp"});

  // Byte explanation animation
  const byteOpacity = interpolate(frame, [60, 90], [0, 1], {extrapolateRight: "clamp"});

  return (
    <>
      {/* Introduction to Bits */}
      <Sequence durationInFrames={54}>
        <div style={{textAlign: "center", fontSize: 40, color: "black"}}>
          {Array.from({length: 8}).map((_, i) => (
            <span key={i} style={{opacity: bitOpacity, margin: "0 5px"}}>
              1
            </span>
          ))}
        </div>
        <div style={{textAlign: "center", fontSize: 20, color: "lightgray", marginTop: "10px"}}>Cada bit conta...</div>
      </Sequence>

      {/* Byte Explanation */}
      <Sequence from={54} durationInFrames={54}>
        <div style={{fontSize: 50, color: "lightblue", textAlign: "center", opacity: byteOpacity}}>1 Byte = 8 Bits</div>
        <div style={{fontSize: 20, color: "black", textAlign: "center", marginTop: "10px"}}>
          A base da computação digital
        </div>
      </Sequence>
    </>
  );
};
