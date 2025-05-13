"use client"
import { useEffect, useRef, useState } from "react"
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three"
import ThreeGlobe from "three-globe"
import { useThree, type Object3DNode, Canvas, extend } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import countries from "../../app/data/globe.json"
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>
  }
}

extend({ ThreeGlobe })

// Add this function at the top of the file, after the imports
function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

const RING_PROPAGATION_SPEED = 3
const aspect = 1.2
const cameraZ = 300

type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
}

interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
}

let numbersOfRings = [0]

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number
        order: number
        color: (t: number) => string
        lat: number
        lng: number
      }[]
    | null
  >(null)

  const globeRef = useRef<ThreeGlobe | null>(null)

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }

  useEffect(() => {
    if (globeRef.current) {
      _buildData()
      _buildMaterial()
    }
  }, [globeRef.current])

  const _buildMaterial = () => {
    if (!globeRef.current) return

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color
      emissive: Color
      emissiveIntensity: number
      shininess: number
    }
    globeMaterial.color = new Color(globeConfig.globeColor)
    globeMaterial.emissive = new Color(globeConfig.emissive)
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1
    globeMaterial.shininess = globeConfig.shininess || 0.9
  }

  // Modify the _buildData function to validate coordinates
  const _buildData = () => {
    const arcs = data
    const points = []
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i]
      // Validate coordinates before adding them
      if (
        !isValidNumber(arc.startLat) ||
        !isValidNumber(arc.startLng) ||
        !isValidNumber(arc.endLat) ||
        !isValidNumber(arc.endLng) ||
        !isValidNumber(arc.arcAlt)
      ) {
        console.warn("Invalid coordinates detected in arc data:", arc)
        continue // Skip this arc
      }

      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number }
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      })
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      })
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) => ["lat", "lng"].every((k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"])) === i,
    )

    setGlobeData(filteredPoints)
  }

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor((e) => {
          return defaultProps.polygonColor
        })
      startAnimation()
    }
  }, [globeData])

  // Modify the startAnimation function to add error handling
  const startAnimation = () => {
    if (!globeRef.current || !globeData) return

    try {
      globeRef.current
        .arcsData(data)
        .arcStartLat((d) => {
          const val = (d as { startLat: number }).startLat * 1
          return isValidNumber(val) ? val : 0
        })
        .arcStartLng((d) => {
          const val = (d as { startLng: number }).startLng * 1
          return isValidNumber(val) ? val : 0
        })
        .arcEndLat((d) => {
          const val = (d as { endLat: number }).endLat * 1
          return isValidNumber(val) ? val : 0
        })
        .arcEndLng((d) => {
          const val = (d as { endLng: number }).endLng * 1
          return isValidNumber(val) ? val : 0
        })
        .arcColor((e: any) => (e as { color: string }).color)
        .arcAltitude((e) => {
          const val = (e as { arcAlt: number }).arcAlt * 1
          return isValidNumber(val) ? val : 0.1
        })
        .arcStroke((e) => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)]
        })
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e) => {
          const val = (e as { order: number }).order * 1
          return isValidNumber(val) ? val : 0
        })
        .arcDashGap(15)
        .arcDashAnimateTime((e) => defaultProps.arcTime)

      globeRef.current
        .pointsData(data)
        .pointColor((e) => (e as { color: string }).color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2)

      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => e.color(t))
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings)
    } catch (error) {
      console.error("Error in globe animation:", error)
    }
  }

  useEffect(() => {
    if (!globeRef.current || !globeData) return

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return
      numbersOfRings = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5))

      globeRef.current.ringsData(globeData.filter((d, i) => numbersOfRings.includes(i)))
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [globeRef.current, globeData])

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  )
}

// Modify the WebGLRendererConfig component to handle resize more robustly
export function WebGLRendererConfig() {
  const { gl, size } = useThree()

  useEffect(() => {
    const handleResize = () => {
      try {
        if (gl && size.width > 0 && size.height > 0) {
          gl.setSize(size.width, size.height)
        }
      } catch (error) {
        console.error("Error resizing WebGL renderer:", error)
      }
    }

    // Set initial properties
    if (gl) {
      gl.setPixelRatio(window.devicePixelRatio)
      gl.setSize(size.width, size.height)
      gl.setClearColor(0xffaaff, 0)
    }

    // Add resize handler
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [gl, size])

  return null
}

// Modify the World component to add error boundaries
export function World(props: WorldProps) {
  const { globeConfig } = props
  const scene = new Scene()
  scene.fog = new Fog(0xffffff, 400, 2000)

  // Add error handling state
  const [hasError, setHasError] = useState(false)

  // Reset error state on props change
  useEffect(() => {
    setHasError(false)
  }, [props])

  // Error fallback
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <p>Globe visualization error. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, aspect, 180, 1800)}
      resize={{ scroll: false }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
      onError={() => setHasError(true)}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  )
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = []
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min
    if (arr.indexOf(r) === -1) arr.push(r)
  }

  return arr
}
