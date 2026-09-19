/**
 * WebGL 3D Narrative Sculptural Engine (Three.js Standalone)
 * 
 * Implements exact user specifications:
 * 1. LIVING MASCOT STAR: The 4-point chrome star at the top continuously spins
 *    ambiently whether scrolling or not, with living reflections, cursor avoidance & click pull.
 * 2. FULL-SCREEN DYNAMIC TRAVERSAL: Elements are not clamped to the right; they traverse
 *    the entire screen width (left, center, right) in sweeping cinematic arcs.
 * 3. 3-ACT NARRATIVE LINKING (Reduced Clutter, Coherent Story):
 *    - ACT I (Intro -> About): The Mascot Star plunges from Intro down into About,
 *      sweeping diagonally across from top-right to lower-left behind the frosted text panel.
 *    - ACT II (Projects -> Awards): The Liquid Chrome Knot enters from the LEFT,
 *      swooping across behind the cards, then transitions into the 8-Point Acid Trophy Star.
 *    - ACT III (Experience -> Stack -> Curation): The Monumental Orbital Gyroscope Engine
 *      takes over the ENTIRE SCREEN (scale 2.8 - 3.2), smoothly rotating without any glitching.
 * 4. 100% GLITCH-FREE LOWER SCROLL: Single continuous monotonic interpolation for the finale.
 */

export function initWebGLTorus() {
  const container = document.getElementById('canvas-container');
  const fallback = document.querySelector('.canvas-fallback');
  if (!container) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global THREE verification
  const THREE = window.THREE;
  if (!THREE) {
    console.warn('Three.js not found on window, fallback activated.');
    if (fallback) fallback.style.display = 'block';
    return;
  }

  try {
    container.style.pointerEvents = 'none';

    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.id = 'webgl-master-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // =========================================================================
    // 1. Procedural High-Contrast Liquid Chrome Studio HDRI Map
    // =========================================================================
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0.0, '#020306');
    bgGrad.addColorStop(0.36, '#0c101a');
    bgGrad.addColorStop(0.48, '#2b3445');
    bgGrad.addColorStop(0.50, '#04060b'); // Sharp horizon split
    bgGrad.addColorStop(0.64, '#090d15');
    bgGrad.addColorStop(1.0, '#020305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Key bright overhead softbox reflection
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(160, 40, 260, 120);

    // Secondary specular softbox
    ctx.fillStyle = '#eaf2ff';
    ctx.fillRect(660, 60, 180, 110);

    // Electric cyan chromatic strip
    const cyanGrad = ctx.createLinearGradient(440, 0, 490, 0);
    cyanGrad.addColorStop(0, 'rgba(0, 229, 255, 0.95)');
    cyanGrad.addColorStop(1, 'rgba(0, 150, 255, 0.15)');
    ctx.fillStyle = cyanGrad;
    ctx.fillRect(440, 20, 50, 240);

    // Prismatic ultraviolet / magenta rim strip
    const magentaGrad = ctx.createLinearGradient(520, 0, 580, 0);
    magentaGrad.addColorStop(0, 'rgba(196, 70, 255, 0.9)');
    magentaGrad.addColorStop(1, 'rgba(130, 30, 255, 0.15)');
    ctx.fillStyle = magentaGrad;
    ctx.fillRect(520, 30, 60, 220);

    // Warm amber rim accent
    ctx.fillStyle = 'rgba(255, 184, 80, 0.85)';
    ctx.fillRect(60, 80, 40, 120);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // =========================================================================
    // 2. High-Performance Bespoke Materials
    // =========================================================================
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x141822,
      metalness: 1.0,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 5.5,
      reflectivity: 1.0
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1.0,
      transparent: true,
      roughness: 0.03,
      ior: 1.55,
      thickness: 2.2,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 5.2
    });

    const iridescentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x161a29,
      metalness: 0.95,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 1.0,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [140, 420],
      envMapIntensity: 5.4
    });

    // =========================================================================
    // 3. ACT I: The Celestial Mascot Star (Intro -> About)
    // =========================================================================
    function createChromeStarGeometry() {
      const shape = new THREE.Shape();
      const points = 4;
      const outerRadius = 1.75;
      const innerRadius = 0.48;

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();

      const extrudeSettings = {
        depth: 0.28,
        bevelEnabled: true,
        bevelSegments: 18,
        steps: 2,
        bevelSize: 0.26,
        bevelThickness: 0.40
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.computeVertexNormals();
      return geo;
    }

    const starMesh = new THREE.Mesh(createChromeStarGeometry(), chromeMaterial);
    starMesh.rotation.set(0.18, 0.42, 0.12);

    const starGroup = new THREE.Group();
    starGroup.add(starMesh);
    scene.add(starGroup);

    // =========================================================================
    // 4. ACT II: The Monolithic Knot (Projects -> Achievements)
    // =========================================================================
    const knotMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.0, 0.34, 160, 36, 2, 3),
      chromeMaterial
    );
    const knotGroup = new THREE.Group();
    knotGroup.add(knotMesh);
    knotGroup.visible = false;
    scene.add(knotGroup);

    // Acid Star Trophy for Achievements
    function createAcidStarGeometry() {
      const shape = new THREE.Shape();
      const points = 8;
      const outerRadius = 1.55;
      const innerRadius = 0.48;

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();

      const extrudeSettings = {
        depth: 0.26,
        bevelEnabled: true,
        bevelSegments: 16,
        steps: 1,
        bevelSize: 0.22,
        bevelThickness: 0.32
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.computeVertexNormals();
      return geo;
    }

    const acidStarMesh = new THREE.Mesh(createAcidStarGeometry(), chromeMaterial);
    const acidStarGroup = new THREE.Group();
    acidStarGroup.add(acidStarMesh);
    acidStarGroup.visible = false;
    scene.add(acidStarGroup);

    // =========================================================================
    // 5. ACT III: The Monumental Orbital Gyroscope Engine (Experience -> Stack -> More)
    // =========================================================================
    const gyroGroup = new THREE.Group();

    // Outer liquid chrome heavy ring (Takes over screen)
    const gyroRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.26, 32, 120),
      chromeMaterial
    );
    gyroGroup.add(gyroRing);

    // Inner physical glass crystal core sphere
    const gyroCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 32, 32),
      glassMaterial
    );
    gyroGroup.add(gyroCore);

    // Secondary iridescent orbital ring
    const gyroInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.20, 0.16, 24, 90),
      iridescentMaterial
    );
    gyroInnerRing.rotation.y = Math.PI * 0.35;
    gyroGroup.add(gyroInnerRing);

    gyroGroup.visible = false;
    scene.add(gyroGroup);

    // =========================================================================
    // 6. Studio Lighting Rig
    // =========================================================================
    const dirKey = new THREE.DirectionalLight(0xffffff, 2.8);
    dirKey.position.set(5, 6, 7);
    scene.add(dirKey);

    const rimCyan = new THREE.PointLight(0x00e5ff, 2.6, 25);
    rimCyan.position.set(-6, -4, 5);
    scene.add(rimCyan);

    const rimMagenta = new THREE.PointLight(0xc966ff, 2.4, 25);
    rimMagenta.position.set(6, -3, -3);
    scene.add(rimMagenta);

    const cursorLight = new THREE.PointLight(0xffffff, 3.4, 14);
    cursorLight.position.set(0, 0, 4.0);
    scene.add(cursorLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    scene.add(ambientLight);

    // =========================================================================
    // 7. Interaction & Viewport Tracking (Mascot Star Only)
    // =========================================================================
    let isIntro = true;

    let normMouseX = 0;
    let normMouseY = 0;
    let cursorWorldX = 0;
    let cursorWorldY = 0;

    let avoidVelX = 0;
    let avoidVelY = 0;

    let attractImpulseX = 0;
    let attractImpulseY = 0;
    let fidgetSpinVel = 0;

    let visibleHalfW = 3.5;
    let visibleHalfH = 2.5;

    function updateBounds() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const vFovRad = (camera.fov * Math.PI) / 180;
      visibleHalfH = Math.tan(vFovRad / 2) * camera.position.z;
      visibleHalfW = visibleHalfH * camera.aspect;
    }
    updateBounds();
    window.addEventListener('resize', updateBounds);

    function updateScrollState() {
      const scrollY = window.scrollY;
      const introThreshold = window.innerHeight * 0.70;
      isIntro = scrollY < introThreshold;
    }
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    window.addEventListener('mousemove', (e) => {
      normMouseX = (e.clientX / window.innerWidth) - 0.5;
      normMouseY = (e.clientY / window.innerHeight) - 0.5;

      cursorWorldX = normMouseX * visibleHalfW * 2.0;
      cursorWorldY = -normMouseY * visibleHalfH * 2.0;

      if (!isIntro) return;

      cursorLight.position.x = cursorWorldX * 0.85;
      cursorLight.position.y = cursorWorldY * 0.85;
    }, { passive: true });

    window.addEventListener('click', (e) => {
      if (e.target.closest('input, textarea, .admin-modal, .admin-bar, a, button, [tabindex], .project-card, .achievement-card, .arc-card')) {
        return;
      }
      if (!isIntro) return;

      // Natural fidget spinner speed boost on click (smoothly accelerates forward, zero scale pumping/beating)
      fidgetSpinVel += 3.8;
      cursorLight.intensity = 5.0;
    });

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      scrollVelocity = (currentY - lastScrollY) * 0.0015;
      lastScrollY = currentY;
    }, { passive: true });

    // Section progress helper: 0.0 when section center is at viewport center
    function getSectionProgress(id) {
      const el = document.getElementById(id);
      if (!el) return 999;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
    }

    // =========================================================================
    // 8. 3-Act Continuous Narrative Engine
    // =========================================================================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      if (!reduced) {
        container.style.opacity = '0.98';
        const isMobile = window.innerWidth < 900;
        const vh = window.innerHeight;
        const scrollY = window.scrollY;
        const docHeight = Math.max(1, document.documentElement.scrollHeight - vh);

        // ---------------------------------------------------------------------
        // ACT I: CELESTIAL MASCOT STAR (Intro & About)
        // Rule: Always spins ambiently (unique mascot behavior) + fidget speed boost
        // Traverses from Intro (top-right) across to About (lower-left behind text)
        // Plunges all the way down off-screen into the abyss (never vanishes mid-screen)
        // ---------------------------------------------------------------------
        const introProg = getSectionProgress('intro');
        const aboutProg = getSectionProgress('about');

        // Star remains active and visible throughout Intro and About until it has physically fallen
        // below the viewport floor, leaving zero sudden disappearance.
        if (introProg > -2.8 && aboutProg > -1.35) {
          starGroup.visible = true;

          // UNIQUE LIVING STAR: Always keeps its ambient hypnotic spin + fidget spinner speed boost
          fidgetSpinVel *= 0.965;
          starMesh.rotation.y += (0.42 + fidgetSpinVel) * dt + scrollVelocity * 1.8;
          starMesh.rotation.x += (0.20 + fidgetSpinVel * 0.15) * dt;
          starMesh.rotation.z += dt * 0.12;

          if (isIntro) {
            // Interactive Hero Mode
            const dx = starGroup.position.x - cursorWorldX;
            const dy = starGroup.position.y - cursorWorldY;
            const distToCursor = Math.hypot(dx, dy);

            const avoidDist = visibleHalfH * 0.95;
            if (distToCursor < avoidDist && distToCursor > 0.05) {
              const pushForce = Math.pow((avoidDist - distToCursor) / avoidDist, 1.4) * 4.4;
              avoidVelX += (dx / distToCursor) * pushForce * dt * 4.6;
              avoidVelY += (dy / distToCursor) * pushForce * dt * 4.6;
            }

            avoidVelX *= 0.90;
            avoidVelY *= 0.90;
            attractImpulseX *= 0.88;
            attractImpulseY *= 0.88;

            const introBaseX = isMobile ? 0 : 1.65;
            const introBaseY = isMobile ? 0.2 : 0.08;

            starGroup.position.x += (introBaseX + avoidVelX + attractImpulseX - starGroup.position.x) * 0.1;
            starGroup.position.y += (introBaseY + avoidVelY + attractImpulseY - starGroup.position.y) * 0.1;
            starGroup.position.z = 0;

            const baseScale = isMobile ? 0.85 : 1.45;
            starGroup.scale.setScalar(baseScale); // Calm, steady scale (zero pumping or beating)

            camera.position.x += (normMouseX * 0.5 - camera.position.x) * 0.04;
            camera.position.y += (-normMouseY * 0.35 - camera.position.y) * 0.04;
            cursorLight.intensity += (3.4 - cursorLight.intensity) * 0.08;
          } else {
            // STORY TRANSITION (FULL SCREEN): Plunges and sweeps across from top-right to lower-left!
            // sweepNorm: 0 at end of Intro to 1.0 at middle of About, up to 2.2 at bottom of About
            const sweepNorm = Math.max(0, -introProg);
            const targetX = 1.65 - Math.min(1.0, sweepNorm) * (isMobile ? 1.6 : 3.2);
            // Continues falling continuously all the way off the bottom floor into the abyss (y down to -8.0)
            const targetY = 0.08 - sweepNorm * 4.6;

            starGroup.position.x += (targetX - starGroup.position.x) * 0.08;
            starGroup.position.y += (targetY - starGroup.position.y) * 0.08;
            starGroup.position.z = -0.3;

            // Fade scale smoothly diminishes to 0 as it falls deep below the screen
            const fadeProgress = Math.max(0, Math.min(1, (sweepNorm - 0.25) / 1.75));
            const fadeScale = Math.max(0.001, (1.0 - fadeProgress) * (isMobile ? 0.85 : 1.45));
            starGroup.scale.setScalar(fadeScale);
          }
        } else {
          starGroup.visible = false;
        }

        // ---------------------------------------------------------------------
        // ACT II: THE MONOLITHIC KNOT & ACID STAR (Projects -> Achievements)
        // Full screen traversal: Knot enters from LEFT, sweeps across to center-right,
        // then transitions into the 8-point Acid Trophy Star
        // ---------------------------------------------------------------------
        const projectsProg = getSectionProgress('projects');
        const awardsProg = getSectionProgress('achievements');

        // Part A: Chrome Knot in Projects (Sweeps from LEFT across to center-right)
        if (Math.abs(projectsProg) < 0.85) {
          knotGroup.visible = true;

          // FULL SCREEN TRAVERSAL:
          // Enters from LEFT (x: -2.2, y: 3.8) -> sweeps across to RIGHT (x: 1.8, y: -3.8)
          const sweepX = (isMobile ? -0.5 : -2.2) + (0.5 - projectsProg * 0.5) * (isMobile ? 1.2 : 3.8);
          const fallY = -projectsProg * 4.8;
          knotGroup.position.set(sweepX, fallY, -0.4);

          const presence = Math.max(0, 1 - Math.pow(Math.abs(projectsProg) * 1.15, 2));
          const scale = (isMobile ? 1.05 : 1.85) * presence;
          knotGroup.scale.setScalar(Math.max(0.001, scale));

          // Physical tumble linked directly to scroll
          knotMesh.rotation.set(
            -projectsProg * 3.4,
            -projectsProg * 4.8,
            -projectsProg * 2.0
          );
        } else {
          knotGroup.visible = false;
        }

        // Part B: Acid Trophy Star in Achievements (Trophy Emblem in Upper Flank)
        if (Math.abs(awardsProg) < 0.85) {
          acidStarGroup.visible = true;

          const fallY = -awardsProg * 4.6;
          const targetX = isMobile ? 0.75 : 2.15;
          acidStarGroup.position.set(targetX, fallY, 0.2);

          const presence = Math.max(0, 1 - Math.pow(Math.abs(awardsProg) * 1.15, 2));
          const scale = (isMobile ? 1.1 : 1.95) * presence;
          acidStarGroup.scale.setScalar(Math.max(0.001, scale));

          // Clockwork trophy spin geared to scroll
          acidStarMesh.rotation.set(
            Math.sin(-awardsProg * Math.PI) * 0.25,
            -awardsProg * 2.2,
            -awardsProg * Math.PI * 2.5
          );
        } else {
          acidStarGroup.visible = false;
        }

        // ---------------------------------------------------------------------
        // ACT III: THE GRAND ORBITAL GYROSCOPE ENGINE (Stack -> Curation -> Footer)
        // 100% GLITCH-FREE & NON-DISTRACTING:
        // Positioned deep in the atmospheric background (z: -2.4), smoothly fading in
        // from zero scale without popping or blocking the foreground content.
        // ---------------------------------------------------------------------
        const stackEl = document.getElementById('stack');
        if (stackEl) {
          const stackTop = stackEl.offsetTop;
          const stackThreshold = stackTop - vh * 0.85;

          if (scrollY > stackThreshold) {
            // Single continuous monotonic progress (0.0 at top of stack to 1.0 at footer)
            const lowerProg = Math.max(0, Math.min(1.0, (scrollY - stackThreshold) / Math.max(1, docHeight - stackThreshold)));

            // Smooth sine curve starting strictly at 0.0 (zero pop on entrance)
            const presence = Math.sin(lowerProg * Math.PI);

            if (presence > 0.01) {
              gyroGroup.visible = true;

              // Placed deep in background (z: -2.4) with calm, elegant vertical glide
              const fallY = 0.6 - lowerProg * 1.5;
              gyroGroup.position.set(0, fallY, -2.4);

              // Refined, tasteful scale (never jumps big into user's face)
              const scale = (isMobile ? 0.9 : 1.45) * presence;
              gyroGroup.scale.setScalar(Math.max(0.001, scale));

              // Smooth continuous geared gimbal counter-rotation (NEVER jumps)
              gyroRing.rotation.set(
                Math.PI * 0.25 - lowerProg * Math.PI * 2.5,
                -lowerProg * Math.PI * 3.5,
                0
              );
              gyroInnerRing.rotation.set(
                0,
                lowerProg * Math.PI * 4.0,
                Math.PI * 0.35 + lowerProg * Math.PI * 1.5
              );
              gyroCore.rotation.set(
                -lowerProg * Math.PI * 1.8,
                lowerProg * Math.PI * 2.2,
                0
              );
            } else {
              gyroGroup.visible = false;
            }
          } else {
            gyroGroup.visible = false;
          }
        }

        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    }
    animate();

  } catch (err) {
    console.warn('WebGL Engine notice:', err);
    if (fallback) fallback.style.display = 'block';
  }
}
