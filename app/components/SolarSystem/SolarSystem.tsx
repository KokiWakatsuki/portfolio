'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const wireMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
    const accentWireMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });

    const sunGeometry = new THREE.IcosahedronGeometry(15, 3);
    const sunWireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(sunGeometry),
      accentWireMaterial
    );
    scene.add(sunWireframe);

    const planets = [
      { radius: 3, distance: 40, speed: 0.02, detail: 1 },
      { radius: 5, distance: 70, speed: 0.015, detail: 1 },
      { radius: 4, distance: 100, speed: 0.01, detail: 1 },
      { radius: 6, distance: 140, speed: 0.008, detail: 1 },
      { radius: 8, distance: 190, speed: 0.006, detail: 1 },
      { radius: 7, distance: 240, speed: 0.004, detail: 1 },
      { radius: 4, distance: 280, speed: 0.003, detail: 1 },
      { radius: 3.5, distance: 320, speed: 0.002, detail: 1 }
    ];

    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const radius = Math.random() * 1000 + 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      starsVertices.push(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: false
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    const planetObjects = planets.map(planet => {
      const geometry = new THREE.IcosahedronGeometry(planet.radius, 2);
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        wireMaterial
      );

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      const segments = 128;
      const eccentricity = Math.random() * 0.1;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const radiusVariation = planet.distance * (1 + eccentricity * Math.sin(angle));
        orbitPoints.push(
          Math.cos(angle) * radiusVariation,
          Math.sin(angle) * 0.3 * planet.distance,
          Math.sin(angle) * radiusVariation
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbit = new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.3
      }));
      scene.add(orbit);

      return {
        mesh: wireframe,
        distance: planet.distance,
        speed: planet.speed * 0.5,
        angle: Math.random() * Math.PI * 2,
        verticalOffset: Math.random() * 0.3,
        rotationSpeed: planet.speed * 3
      };
    });

    planetObjects.forEach(planet => {
      scene.add(planet.mesh);
    });

    camera.position.set(200, 150, 400);
    camera.lookAt(0, 0, 0);

    let frame = 0;
    function animate() {
      frame = requestAnimationFrame(animate);

      planetObjects.forEach(planet => {
        planet.angle += planet.speed;
        const radiusVariation = planet.distance * (1 + 0.1 * Math.sin(planet.angle));
        planet.mesh.position.x = Math.cos(planet.angle) * radiusVariation;
        planet.mesh.position.y = Math.sin(planet.angle) * planet.verticalOffset * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * radiusVariation;

        planet.mesh.rotation.y += planet.rotationSpeed;
        planet.mesh.rotation.x += planet.rotationSpeed * 0.3;
      });

      sunWireframe.rotation.y += 0.002;
      sunWireframe.rotation.x += 0.001;

      const time = Date.now() * 0.00005;
      const radius = 500;
      camera.position.x = Math.cos(time) * radius;
      camera.position.z = Math.sin(time) * radius;
      camera.position.y = 200 + Math.sin(time * 0.5) * 100;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default SolarSystem;