import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3Geo from 'd3-geo';
import { worldCountriesGeoJSON, worldLandGeoJSON } from '../data/worldGeo';
import { ISO_NUMERIC_MAP } from '../data/countryIsoMap';
import { WORLD_COUNTRIES, getCountryTelemetry, CountryTelemetry } from '../data/countriesData';
import { COUNTRY_BOUNDARIES } from '../data/countryBoundaries';
import { hudAudio } from './AudioSynth';

interface ThreeGlobeProps {
  isRotating?: boolean;
  selectedTarget?: string | null;
  onSelectCountry?: (country: CountryTelemetry) => void;
  showWireframe?: boolean;
}

export const ThreeGlobe: React.FC<ThreeGlobeProps> = ({
  isRotating = true,
  selectedTarget = 'USA',
  onSelectCountry,
  showWireframe = true
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const satellitesGroupRef = useRef<THREE.Group | null>(null);

  const [hoveredCountry, setHoveredCountry] = useState<CountryTelemetry | null>(null);
  const [activeCountry, setActiveCountry] = useState<CountryTelemetry>(
    getCountryTelemetry(selectedTarget || 'USA')
  );

  // Sync prop changes for selectedTarget
  useEffect(() => {
    if (selectedTarget) {
      const country = getCountryTelemetry(selectedTarget);
      setActiveCountry(country);
      focusOnCoordinates(country.lat, country.lng);
    }
  }, [selectedTarget]);

  // Smooth camera rotation to target lat/lng
  const focusOnCoordinates = (lat: number, lng: number) => {
    if (!earthMeshRef.current) return;

    // Convert lat/lng to Euler rotation target on the earth sphere
    const targetY = -((lng + 90) * Math.PI) / 180;
    const targetX = (lat * Math.PI) / 180;

    const startY = earthMeshRef.current.rotation.y;
    const startX = earthMeshRef.current.rotation.x;

    let progress = 0;
    const step = () => {
      progress += 0.08;
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y = THREE.MathUtils.lerp(startY, targetY, Math.min(progress, 1));
        earthMeshRef.current.rotation.x = THREE.MathUtils.lerp(startX, targetX, Math.min(progress, 1));
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    step();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Interactive OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.minDistance = 2.2;
    controls.maxDistance = 7.0;
    controls.rotateSpeed = 0.8;
    controlsRef.current = controls;

    // 3. High-Definition World Map Texture Canvas (2048 x 1024)
    const W = 2048;
    const H = 1024;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = W;
    texCanvas.height = H;
    const ctx = texCanvas.getContext('2d');

    if (ctx) {
      // Dark space background
      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, W, H);

      // Setup D3 Equirectangular projection for 1:1 texture wrapping
      const projection = d3Geo.geoEquirectangular()
        .scale(W / (2 * Math.PI))
        .translate([W / 2, H / 2]);

      const pathGenerator = d3Geo.geoPath().projection(projection).context(ctx as any);

      // A. Degree Grid Lines (Every 15 degrees lat/long)
      ctx.strokeStyle = 'rgba(0, 220, 255, 0.07)';
      ctx.lineWidth = 1;

      for (let lon = -180; lon <= 180; lon += 15) {
        const p = projection([lon, 0]);
        if (p) {
          ctx.beginPath();
          ctx.moveTo(p[0], 0);
          ctx.lineTo(p[0], H);
          ctx.stroke();
        }
      }
      for (let lat = -90; lat <= 90; lat += 15) {
        const p = projection([0, lat]);
        if (p) {
          ctx.beginPath();
          ctx.moveTo(0, p[1]);
          ctx.lineTo(W, p[1]);
          ctx.stroke();
        }
      }

      // B. Render All World Landmasses Fill
      if (worldLandGeoJSON && worldLandGeoJSON.features) {
        ctx.fillStyle = 'rgba(25, 45, 75, 0.45)';
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        worldLandGeoJSON.features.forEach((feat: any) => pathGenerator(feat));
        ctx.fill();
        ctx.stroke();
      }

      // C. Render All Individual Country Polygon Boundaries (180+ Countries!)
      if (worldCountriesGeoJSON && worldCountriesGeoJSON.features) {
        worldCountriesGeoJSON.features.forEach((feat: any) => {
          const isoId = String(feat.id || '');
          const meta = ISO_NUMERIC_MAP[isoId];
          const isSelected = meta
            ? (activeCountry.id === meta.id || activeCountry.code === meta.code)
            : false;

          ctx.beginPath();
          pathGenerator(feat);

          if (isSelected) {
            ctx.fillStyle = 'rgba(255, 42, 75, 0.60)';
            ctx.strokeStyle = '#ff2a4b';
            ctx.lineWidth = 2.8;
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(40, 70, 110, 0.35)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.lineWidth = 1.2;
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // D. Draw Extra High-Precision Vector Boundaries from COUNTRY_BOUNDARIES
      Object.entries(COUNTRY_BOUNDARIES).forEach(([cId, polyRings]) => {
        const isSelected = activeCountry.id === cId;
        ctx.strokeStyle = isSelected ? '#ff2a4b' : 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = isSelected ? 3.0 : 1.5;

        polyRings.forEach(ring => {
          ctx.beginPath();
          ring.forEach(([lng, lat], idx) => {
            const pt = projection([lng, lat]);
            if (pt) {
              if (idx === 0) ctx.moveTo(pt[0], pt[1]);
              else ctx.lineTo(pt[0], pt[1]);
            }
          });
          ctx.closePath();
          ctx.stroke();
        });
      });

      // E. Render Country Labels and Capital Markers on Texture
      WORLD_COUNTRIES.forEach(country => {
        const pt = projection([country.lng, country.lat]);
        if (pt) {
          const isSelected = country.id === activeCountry.id;

          // Dot
          ctx.fillStyle = isSelected ? '#ff2a4b' : '#00f0ff';
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], isSelected ? 6 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Text Label
          ctx.font = isSelected ? 'bold 14px "Orbitron", sans-serif' : '10px "Share Tech Mono", monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(210, 230, 255, 0.9)';
          ctx.fillText(`${country.name} [${country.code}]`, pt[0] + 8, pt[1] + 4);
        }
      });
    }

    const earthTexture = new THREE.CanvasTexture(texCanvas);

    // 4. Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(1.35, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.35,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Tactical Wireframe Overlay
    const wireGeo = new THREE.SphereGeometry(1.353, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: showWireframe ? 0.14 : 0.04
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    earthMesh.add(wireMesh);

    // 5. Volumetric Red Atmosphere Rim Shader
    const atmosGeo = new THREE.SphereGeometry(1.42, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(1.0 - abs(dot(viewDir, vNormal)), 2.6);
          float leftWeight = smoothstep(0.3, -0.8, vNormal.x);
          vec3 redColor = vec3(1.0, 0.15, 0.28);
          gl_FragColor = vec4(redColor, intensity * leftWeight * 0.9);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const redLight = new THREE.DirectionalLight(0xff2a4b, 2.8);
    redLight.position.set(-6, 0, 2);
    scene.add(redLight);

    // 7. Interactive 3D Beacon Pins for Countries
    const markersGroup = new THREE.Group();
    earthMesh.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Lat/Lng to 3D Sphere Point
    const latLngToVector3 = (lat: number, lng: number, radius = 1.365) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    WORLD_COUNTRIES.forEach((country) => {
      const pos = latLngToVector3(country.lat, country.lng);
      const marker = new THREE.Group();
      marker.position.copy(pos);
      marker.userData = { country };

      const isSelected = country.id === activeCountry.id;

      // Outer Glowing Ring
      const ringGeo = new THREE.RingGeometry(0.038, 0.055, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xff2a4b : 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.65
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      marker.add(ringMesh);

      // Inner Dot
      const dotGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xff2a4b : 0xffffff
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      marker.add(dotMesh);

      markersGroup.add(marker);
    });

    // 8. Orbiting Satellite Rings
    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);
    satellitesGroupRef.current = satellitesGroup;

    const satRing1 = new THREE.Mesh(
      new THREE.RingGeometry(1.72, 1.735, 96),
      new THREE.MeshBasicMaterial({ color: 0xff3b3b, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    satRing1.rotation.x = Math.PI / 3;
    satRing1.rotation.y = Math.PI / 6;
    satellitesGroup.add(satRing1);

    const satRing2 = new THREE.Mesh(
      new THREE.RingGeometry(1.88, 1.895, 96),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
    );
    satRing2.rotation.x = -Math.PI / 4;
    satRing2.rotation.y = -Math.PI / 8;
    satellitesGroup.add(satRing2);

    for (let i = 0; i < 6; i++) {
      const satMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, 0.04),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff2a4b : 0xffffff })
      );
      const angle = (i * Math.PI) / 3;
      satMesh.position.set(1.73 * Math.cos(angle), 1.73 * Math.sin(angle), 0);
      satRing1.add(satMesh);
    }

    // 9. Advanced Raycasting & Surface Intersection for ALL Countries
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check pin markers first
      if (markersGroupRef.current) {
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
        if (intersects.length > 0) {
          let target = intersects[0].object;
          while (target.parent && !target.userData.country) {
            target = target.parent as THREE.Object3D;
          }

          if (target && target.userData.country) {
            const country = target.userData.country as CountryTelemetry;
            hudAudio.playTargetLock();
            setActiveCountry(country);
            if (onSelectCountry) onSelectCountry(country);
            focusOnCoordinates(country.lat, country.lng);
            return;
          }
        }
      }

      // Check 3D Earth Mesh intersection to pick ANY country on earth surface
      if (earthMeshRef.current) {
        const intersects = raycaster.intersectObject(earthMeshRef.current);
        if (intersects.length > 0 && intersects[0].uv) {
          const uv = intersects[0].uv;
          // UV to Lat / Lng
          const lng = (uv.x * 360) - 180;
          const lat = (uv.y * 180) - 90;

          // Find matching country in worldCountriesGeoJSON using d3Geo.geoContains
          if (worldCountriesGeoJSON && worldCountriesGeoJSON.features) {
            for (const feat of worldCountriesGeoJSON.features) {
              if (d3Geo.geoContains(feat as any, [lng, lat])) {
                const isoId = String((feat as any).id || '');
                const meta = ISO_NUMERIC_MAP[isoId];
                const countryName = meta ? meta.name : `Sector (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`;
                const resolvedCountry = getCountryTelemetry(meta ? meta.id : countryName);

                hudAudio.playTargetLock();
                setActiveCountry(resolvedCountry);
                if (onSelectCountry) onSelectCountry(resolvedCountry);
                focusOnCoordinates(resolvedCountry.lat || lat, resolvedCountry.lng || lng);
                return;
              }
            }
          }
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check marker hover
      if (markersGroupRef.current) {
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
        if (intersects.length > 0) {
          let target = intersects[0].object;
          while (target.parent && !target.userData.country) {
            target = target.parent as THREE.Object3D;
          }
          if (target && target.userData.country) {
            setHoveredCountry(target.userData.country as CountryTelemetry);
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
        }
      }

      // Check surface hover
      if (earthMeshRef.current) {
        const intersects = raycaster.intersectObject(earthMeshRef.current);
        if (intersects.length > 0 && intersects[0].uv) {
          const uv = intersects[0].uv;
          const lng = (uv.x * 360) - 180;
          const lat = (uv.y * 180) - 90;

          if (worldCountriesGeoJSON && worldCountriesGeoJSON.features) {
            for (const feat of worldCountriesGeoJSON.features) {
              if (d3Geo.geoContains(feat as any, [lng, lat])) {
                const isoId = String((feat as any).id || '');
                const meta = ISO_NUMERIC_MAP[isoId];
                const countryName = meta ? meta.name : `Region (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`;
                const hoverData = getCountryTelemetry(meta ? meta.id : countryName);

                setHoveredCountry(hoverData);
                renderer.domElement.style.cursor = 'pointer';
                return;
              }
            }
          }
        }
      }

      setHoveredCountry(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);

    // 10. Animation Loop
    let animId: number;
    const animate = () => {
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (isRotating && earthMeshRef.current && !controlsRef.current?.state) {
        earthMeshRef.current.rotation.y += 0.002;
      }

      if (satellitesGroupRef.current) {
        satellitesGroupRef.current.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('click', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, showWireframe, activeCountry.id]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none group">
      {/* Interactive WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] cursor-grab active:cursor-grabbing"
      />

      {/* Hovered Country Floating Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 bg-[#080b12]/95 border border-cyan-400 px-3 py-1.5 rounded shadow-xl pointer-events-none z-30 font-mono-tech text-[10px] text-cyan-300 animate-bounce flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>HOVER:</span>
          <span className="font-bold text-white uppercase">{hoveredCountry.name}</span>
          <span className="text-slate-400">[{hoveredCountry.code}]</span>
          <span>— CLICK TO LOCK</span>
        </div>
      )}

      {/* Selected Active Country HUD Callout Badge */}
      {activeCountry && (
        <div className="absolute bottom-16 left-2 sm:left-6 bg-[#080b12]/95 border border-red-500/90 p-2.5 rounded shadow-2xl z-20 font-mono-tech text-[10px] text-slate-200 glow-red-sm space-y-1 max-w-[200px]">
          <div className="flex items-center justify-between border-b border-red-500/50 pb-1">
            <span className="text-red-400 font-bold uppercase">{activeCountry.name}</span>
            <span className="text-[9px] text-slate-400">[{activeCountry.code}]</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">CAPITAL:</span>
            <span className="text-white font-bold">{activeCountry.capital}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">CONTINENT:</span>
            <span>{activeCountry.continent}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">POPULATION:</span>
            <span>{activeCountry.population}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">GRID:</span>
            <span className="text-red-300 font-mono">{activeCountry.gridRef}</span>
          </div>
        </div>
      )}

      {/* HUD Instruction Hint */}
      <div className="absolute bottom-2 font-mono-tech text-[9px] text-slate-400 bg-black/70 px-2.5 py-1 rounded border border-slate-800 pointer-events-none">
        🖱️ DRAG TO ROTATE GLOBE | SCROLL TO ZOOM | CLICK ANY COUNTRY OR PIN TO LOCK
      </div>
    </div>
  );
};
