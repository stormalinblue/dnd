import type React from 'react';

type Vertex = [x: number, y: number];
type Edge = [start: number, stop: number];
type Triangle = [a: number, b: number, c: number];
type Pentagon = [a: number, b: number, c: number, d: number, e: number];

function d2s(v: Vertex, svgSide: number, edgeLength: number): Vertex {
  return [svgSide / 2 + edgeLength * v[0], svgSide / 2 - edgeLength * v[1]];
}

function VertexSet(props: {
  vertexBuffer: Array<Vertex>;
  svgSide: number;
  edgeLength: number;
}) {
  return props.vertexBuffer.map((vertex, index) => {
    const [cx, cy] = d2s(vertex, props.svgSide, props.edgeLength);
    return (
      <>
        <text x={cx} y={cy}>
          {index.toString()}
        </text>
        <circle r={3} cx={cx} cy={cy} fill="white" />
      </>
    );
  });
}

function DieFace(props: {
  vertices: Array<number>;
  vertexBuffer: Array<Vertex>;
  faceColor: string;
  strokeColor: string;
  svgSide: number;
  edgeLength: number;
}): React.ReactNode {
  const polygonPointString = props.vertices
    .map((vertexIndex) =>
      d2s(props.vertexBuffer[vertexIndex], props.svgSide, props.edgeLength)
        .map((x) => x.toString())
        .join(' ')
    )
    .join(' ');

  return (
    <polygon
      fill={props.faceColor}
      stroke={props.strokeColor}
      strokeWidth="10"
      strokeLinejoin="round"
      points={polygonPointString}
    />
  );
}

export function D20Die(): React.ReactNode {
  const svgSide = 500;

  const apparentSide = 250;

  const vertexBuffer: Array<Vertex> = [
    [5.0e-1, -2.88675135e-1],
    [8.09016994e-1, 4.67086179e-1],
    [-8.09016994e-1, -4.67086179e-1],
    [1.11022302e-16, 5.77350269e-1],
    [-8.09016994e-1, 4.67086179e-1],
    [8.09016994e-1, -4.67086179e-1],
    [-5.0e-1, -2.88675135e-1],
    [-1.58542639e-16, -9.34172359e-1],
    [1.58542639e-16, 9.34172359e-1],
  ];

  const primaryFace: Triangle = [0, 3, 6];

  const secondaryFaces: Array<Triangle> = [
    [6, 0, 7],
    [0, 3, 1],
    [3, 6, 4],
  ];

  const tertiaryFaces: Array<Triangle> = [
    [7, 0, 5],
    [0, 1, 5],
    [1, 3, 8],
    [3, 4, 8],
    [4, 6, 2],
    [6, 7, 2],
  ];

  const faceColor = '#a62615';
  const strokeColor = '#b94134';

  function FacePolygon(props: { vertices: Triangle }): React.ReactNode {
    return (
      <DieFace
        edgeLength={apparentSide}
        svgSide={svgSide}
        faceColor={faceColor}
        strokeColor={strokeColor}
        vertexBuffer={vertexBuffer}
        vertices={props.vertices}
      />
    );
  }

  return (
    <svg
      width={svgSide}
      height={svgSide}
      style={{ height: svgSide, width: svgSide }}
    >
      <FacePolygon vertices={primaryFace} />
      {secondaryFaces.map((triangle) => (
        <FacePolygon vertices={triangle} />
      ))}
      {tertiaryFaces.map((triangle) => (
        <FacePolygon vertices={triangle} />
      ))}
    </svg>
  );
}

export function D12Die(): React.ReactNode {
  const svgSide = 500;
  const apparentSide = 100;

  const vertexBuffer: Array<Vertex> = [
    [0.80901698, 0.26286556],
    [0, 0.85065079],
    [0.49999999, -0.68819093],
    [1.30901697, 0.42532539],
    [0.80901698, 1.11351633],
    [0, 1.37638188],
    [0.80901698, -1.11351633],
    [0, -1.37638188],
    [1.30901697, -0.42532539],
    [-0.80901698, 0.26286556],
    [-0.49999999, -0.68819093],
    [-1.30901697, 0.42532539],
    [-0.80901698, 1.11351633],
    [-0.80901698, -1.11351633],
    [-1.30901697, -0.42532539],
  ];

  const primaryFace: Pentagon = [0, 1, 9, 10, 2];

  const secondaryFaces: Array<Pentagon> = [
    [0, 2, 6, 8, 3],
    [1, 0, 3, 4, 5],
    [9, 1, 5, 12, 11],
    [10, 9, 11, 14, 13],
    [2, 10, 13, 7, 6],
  ];

  const faceColor = '#a62615';
  const strokeColor = '#b94134';

  function FacePolygon(props: { vertices: Pentagon }): React.ReactNode {
    return (
      <DieFace
        edgeLength={apparentSide}
        svgSide={svgSide}
        faceColor={faceColor}
        strokeColor={strokeColor}
        vertexBuffer={vertexBuffer}
        vertices={props.vertices}
      />
    );
  }

  return (
    <svg
      width={svgSide}
      height={svgSide}
      style={{ height: svgSide, width: svgSide }}
    >
      <FacePolygon vertices={primaryFace} />
      {secondaryFaces.map((triangle) => (
        <FacePolygon vertices={triangle} />
      ))}
      {/* {vertexBuffer.map((vertex, index) => {
        const [cx, cy] = d2s(vertex);
        return (
          <>
            <text x={cx} y={cy}>
              {index.toString()}
            </text>
            <circle r={3} cx={cx} cy={cy} fill="white" />
          </>
        );
      })} */}
    </svg>
  );
}

export function D8Die(): React.ReactNode {
  const svgSide = 500;
  const apparentSide = 250;

  const vertexBuffer: Array<Vertex> = [
    [0.5, -0.28867948],
    [0.5, 0.28867948],
    [0, 0.57734592],
    [-0.5, 0.28867948],
    [-0.5, -0.28867948],
    [0, -0.57734592],
  ];

  /*   const edges: Array<Edge> = [
    [0, 1],
    [0, 2],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 5],
    [2, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 5],
  ]; */

  const primaryFace: Triangle = [0, 2, 4];

  const secondaryFaces: Array<Triangle> = [
    [0, 2, 1],
    [2, 4, 3],
    [0, 4, 5],
  ];
  const faceColor = '#a62615';
  const strokeColor = '#b94134';

  function FacePolygon(props: { vertices: Triangle }): React.ReactNode {
    return (
      <DieFace
        edgeLength={apparentSide}
        svgSide={svgSide}
        faceColor={faceColor}
        strokeColor={strokeColor}
        vertexBuffer={vertexBuffer}
        vertices={props.vertices}
      />
    );
  }

  return (
    <svg
      width={svgSide}
      height={svgSide}
      style={{ height: svgSide, width: svgSide }}
    >
      <FacePolygon vertices={primaryFace} />
      {secondaryFaces.map((triangle) => (
        <FacePolygon vertices={triangle} />
      ))}
      {}
    </svg>
  );
}

export function AllDie(): React.ReactNode {
  return (
    <>
      <D8Die />
      <D12Die />
      <D20Die />
    </>
  );
}
