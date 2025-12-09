"use client"

import { useRef, useState, useCallback, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Grid, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { type CableConfig, environmentPresets, colorOptions, getModelType } from "@/lib/cable-config"
import { Button } from "@/components/ui/button"
import { Loader2, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

interface ThreeViewerProps {
  config: CableConfig
  environment: string
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

function GLBModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return <primitive ref={ref} object={scene} scale={1} />
}

function Cable({ config }: { config: CableConfig }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Convert length string to numeric value for 3D scaling
  const getLengthValue = (length: string): number => {
    if (length.includes("in")) {
      const inches = Number.parseFloat(length.replace("in", ""))
      return inches / 12 // Convert to feet for scaling
    }
    return Number.parseFloat(length.replace("ft", "").replace("'", ""))
  }

  const cableLength = getLengthValue(config.length)
  const modelType = getModelType(config.series, config.model)
  const isAdapter = modelType === "adapter"

  // Get color hex from config
  const colorHex = colorOptions.find((c) => c.id === config.color)?.hex || "#1a1a1a"

  // Create curve for the cable
  const curve = useMemo(() => {
    const curvePoints = isAdapter
      ? [
          new THREE.Vector3(-cableLength / 4, 0, 0),
          new THREE.Vector3(0, -0.1, 0.05),
          new THREE.Vector3(cableLength / 4, 0, 0),
        ]
      : [
          new THREE.Vector3(-cableLength / 2, 0, 0),
          new THREE.Vector3(-cableLength / 4, -0.3, 0.2),
          new THREE.Vector3(0, -0.5, 0),
          new THREE.Vector3(cableLength / 4, -0.3, -0.2),
          new THREE.Vector3(cableLength / 2, 0, 0),
        ]
    return new THREE.CatmullRomCurve3(curvePoints)
  }, [cableLength, isAdapter])

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, isAdapter ? 0.05 : 0.08, 16, false)
  }, [curve, isAdapter])

  // Sleeve geometry (slightly larger)
  const sleeveGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, isAdapter ? 0.055 : 0.09, 16, false)
  }, [curve, isAdapter])

  const hasSleeve = config.sleeve !== "none"

  return (
    <group ref={groupRef}>
      {/* Main cable */}
      <mesh geometry={tubeGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={colorHex} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Sleeve overlay */}
      {hasSleeve && (
        <mesh geometry={sleeveGeometry}>
          <meshStandardMaterial
            color={config.sleeve === "techflex" ? "#333333" : "#444444"}
            metalness={config.sleeve === "techflex" ? 0.3 : 0.1}
            roughness={config.sleeve === "techflex" ? 0.5 : 0.9}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Connector A (left) */}
      <group
        position={[isAdapter ? -cableLength / 4 - 0.15 : -cableLength / 2 - 0.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[isAdapter ? 0.1 : 0.15, isAdapter ? 0.08 : 0.12, isAdapter ? 0.3 : 0.4, 32]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Connector B (right) */}
      <group
        position={[isAdapter ? cableLength / 4 + 0.15 : cableLength / 2 + 0.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[isAdapter ? 0.1 : 0.15, isAdapter ? 0.08 : 0.12, isAdapter ? 0.3 : 0.4, 32]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

// Camera controls component
function CameraController({
  resetTrigger,
  zoomInTrigger,
  zoomOutTrigger,
}: {
  resetTrigger: number
  zoomInTrigger: number
  zoomOutTrigger: number
}) {
  const { camera } = useThree()
  const prevReset = useRef(resetTrigger)
  const prevZoomIn = useRef(zoomInTrigger)
  const prevZoomOut = useRef(zoomOutTrigger)

  useFrame(() => {
    if (resetTrigger !== prevReset.current) {
      camera.position.set(0, 2, 5)
      prevReset.current = resetTrigger
    }
    if (zoomInTrigger !== prevZoomIn.current) {
      camera.position.multiplyScalar(0.8)
      prevZoomIn.current = zoomInTrigger
    }
    if (zoomOutTrigger !== prevZoomOut.current) {
      camera.position.multiplyScalar(1.2)
      prevZoomOut.current = zoomOutTrigger
    }
  })

  return null
}

function ModelOrCable({ config }: { config: CableConfig }) {
  if (config.modelFile) {
    return <GLBModel path={`/models/${config.modelFile}`} />
  }
  return <Cable config={config} />
}

// Scene content component
function SceneContent({
  config,
  environment,
  resetTrigger,
  zoomInTrigger,
  zoomOutTrigger,
  onLoaded,
}: {
  config: CableConfig
  environment: string
  resetTrigger: number
  zoomInTrigger: number
  zoomOutTrigger: number
  onLoaded: () => void
}) {
  const preset = environmentPresets.find((e) => e.id === environment)
  const bgColor = preset?.bg || "#1a1a1a"

  const hasLoadedRef = useRef(false)
  useFrame(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      setTimeout(onLoaded, 500)
    }
  })

  return (
    <>
      <color attach="background" args={[bgColor]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight args={["#ffffff", "#444444", 0.5]} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      {/* Grid */}
      <Grid
        position={[0, -1, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#333333"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#222222"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
      />

      <Suspense fallback={null}>
        <ModelOrCable config={config} />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 1.5}
      />

      <CameraController resetTrigger={resetTrigger} zoomInTrigger={zoomInTrigger} zoomOutTrigger={zoomOutTrigger} />
    </>
  )
}

export function ThreeViewer({ config, environment, isLoading, setIsLoading }: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [zoomInTrigger, setZoomInTrigger] = useState(0)
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0)

  const handleLoaded = useCallback(() => {
    setIsLoading(false)
  }, [setIsLoading])

  const resetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1)
  }, [])

  const zoomIn = useCallback(() => {
    setZoomInTrigger((prev) => prev + 1)
  }, [])

  const zoomOut = useCallback(() => {
    setZoomOutTrigger((prev) => prev + 1)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <SceneContent
          config={config}
          environment={environment}
          resetTrigger={resetTrigger}
          zoomInTrigger={zoomInTrigger}
          zoomOutTrigger={zoomOutTrigger}
          onLoaded={handleLoaded}
        />
      </Canvas>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading 3D Viewer...</span>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={resetCamera}
          className="bg-card/80 backdrop-blur-sm hover:bg-card"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={zoomIn} className="bg-card/80 backdrop-blur-sm hover:bg-card">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={zoomOut} className="bg-card/80 backdrop-blur-sm hover:bg-card">
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-card/80 backdrop-blur-sm hover:bg-card"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
