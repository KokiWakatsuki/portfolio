'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // デバイスの性能に応じてスケーリングファクターを設定
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.6 : 1;
    const starCount = isMobile ? 2500 : 5000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 75 : 60,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile // モバイルではアンチエイリアスを無効化してパフォーマンス向上
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 太陽と惑星の色を定義
    const planetColors = [
      0xffe0b3, // 太陽：暖かみのある白色
      0xc0c0c0, // 水星：シルバーグレー
      0xf2e6d9, // 金星：ソフトクリーム
      0x9dc3c2, // 地球：淡い青緑
      0xb97a57, // 火星：くすんだ赤茶
      0xd4a76a, // 木星：アンバー
      0xdac17c, // 土星：シャンパンゴールド
      0xb3d9d9, // 天王星：ペールブルー
      0x394d6e  // 海王星：ディープブルー
    ];

    const sunGeometry = new THREE.IcosahedronGeometry(60 * scaleFactor, isMobile ? 2 : 3);
    const sunWireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(sunGeometry),
      new THREE.LineBasicMaterial({ color: planetColors[0] })
    );
    scene.add(sunWireframe);

    const basePlanets = [
      { radius: 8, distance: 120, speed: 0.025, detail: 2 },    // 水星
      { radius: 18, distance: 180, speed: 0.018, detail: 2 },   // 金星
      { radius: 20, distance: 240, speed: 0.015, detail: 2 },   // 地球
      { radius: 15, distance: 300, speed: 0.012, detail: 2 },   // 火星
      { radius: 45, distance: 380, speed: 0.008, detail: 3 },   // 木星
      { radius: 35, distance: 460, speed: 0.006, detail: 3 },   // 土星
      { radius: 25, distance: 540, speed: 0.004, detail: 2 },   // 天王星
      { radius: 24, distance: 620, speed: 0.003, detail: 2 }    // 海王星
    ];

    const planets = basePlanets.map(planet => ({
      ...planet,
      radius: planet.radius * scaleFactor,
      distance: planet.distance * scaleFactor,
      detail: isMobile ? Math.min(planet.detail, 2) : planet.detail
    }));

    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < starCount; i++) {
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
      const planetColor = planetColors[planets.indexOf(planet) + 1]; // +1 because index 0 is sun
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: planetColor })
      );

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      const segments = 128;
      // 惑星ごとの離心率を設定
      const eccentricities = [0.15, 0.12, 0.08, 0.14, 0.05, 0.1, 0.09, 0.07];
      const eccentricity = eccentricities[planets.indexOf(planet)];

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
        // 惑星ごとの特徴的な傾きと自転速度を設定
        verticalOffset: [0.1, 0.15, 0.2, 0.25, 0.15, 0.4, 0.8, 0.3][planets.indexOf(planet)],
        rotationSpeed: [-0.01, -0.008, 0.015, 0.012, 0.025, 0.02, 0.018, 0.016][planets.indexOf(planet)]
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

      const time = Date.now() * (isMobile ? 0.00003 : 0.00005);
      const radius = isMobile ? 500 : 700;
      const yOffset = isMobile ? 100 : 200;
      const yAmplitude = isMobile ? 50 : 100;
      
      camera.position.x = Math.cos(time) * radius;
      camera.position.z = Math.sin(time) * radius;
      camera.position.y = yOffset + Math.sin(time * 0.5) * yAmplitude;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      camera.fov = newIsMobile ? 75 : 60;
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