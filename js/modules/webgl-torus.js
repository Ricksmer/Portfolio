/**
 * WebGL 3D Liquid Chrome Star Centerpiece Engine (Three.js Standalone)
 * 
 * Implements exact user specifications:
 * 1. ONE singular iconic 3D liquid chrome star (puffed 4-point acid-graphic star with smooth beveled facets).
 * 2. 100% Mirror Liquid Chrome (dark steel base 0x141822, 100% metalness, 0.02 roughness,
 *    procedural studio HDRI with sharp horizon split line and cyan/magenta neon rim tubes).
 * 3. Increased prominent size (0.98 base scale desktop, 0.64 mobile).
 * 4. Section-Aware Strict State Machine:
 *    - IN INTRO SECTION:
 *      * Positioned to the right.
 *      * AVOIDS THE CURSOR: when cursor gets close, it pushes and veers away with smooth repulsion physics.
 *      * CLICK PULLS IT: clicking pulls the star slightly toward the cursor position with an elastic impulse & spin.
 *    - IN OTHER PAGES:
 *      * Smoothly glides to the EXACT CENTER OF THE SCREEN (x: 0, y: 0).
 *      * INTERACTION COMPLETELY DISABLED: mouse hover and clicks are 100% ignored.
 *      * Steady hypnotic ambient spinning in place as a subtle background element.
 *    - BACK TO INTRO:
 *      * Smoothly glides back to intro position and re-enables avoidance & click attraction.
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
    // Non-blocking interaction across the page
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

    // Obsidian horizon split gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0.0, '#020306');
    bgGrad.addColorStop(0.36, '#0c101a');
    bgGrad.addColorStop(0.48, '#2b3445');
    bgGrad.addColorStop(0.50, '#04060b'); // Sharp horizon split
    bgGrad.addColorStop(0.64, '#090d15');
    bgGrad.addColorStop(1.0, '#020305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Key bright white overhead softbox reflection
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(160, 40, 260, 120);

    // Secondary specular softbox
    ctx.fillStyle = '#eaf2ff';
    ctx.fillRect(660, 60, 180, 110);

    // Electric cyan chromatic strip
    const cyanGrad = ctx.createLinearGradient(440, 0, 490, 0);
    cyanGrad.addColorStop(0, 'rgba(0, 229, 255, 0.95)');
    cyanGrad.addColorStop(1, 'rgba(0, 140, 255, 0.15)');
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

    // Master Group holding the 3D art piece
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // =========================================================================
    // 2. Singular Sculpted 3D Liquid Chrome Star
    // =========================================================================
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x141822,        // Dark metallic steel base
      metalness: 1.0,         // 100% metal
      roughness: 0.02,        // Mirror polish
      clearcoat: 1.0,         // Wet lacquer surface
      clearcoatRoughness: 0.02,
      envMapIntensity: 5.4,   // High-contrast environment reflections
      reflectivity: 1.0
    });

    // Puffed 4-point acid-graphic 3D chrome star
    function createChromeStarGeometry() {
      const shape = new THREE.Shape();
      const points = 4;
      const outerRadius = 1.65;
      const innerRadius = 0.46;

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
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 18,
        steps: 2,
        bevelSize: 0.24,
        bevelThickness: 0.38
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.computeVertexNormals();
      return geo;
    }

    const starMesh = new THREE.Mesh(createChromeStarGeometry(), chromeMaterial);
    masterGroup.add(starMesh);

    // =========================================================================
    // 3. Studio Lighting Rig
    // =========================================================================
    const dirKey = new THREE.DirectionalLight(0xffffff, 2.5);
    dirKey.position.set(5, 6, 7);
    scene.add(dirKey);

    const rimCyan = new THREE.PointLight(0x00e5ff, 2.4, 25);
    rimCyan.position.set(-6, -4, 5);
    scene.add(rimCyan);

    const rimMagenta = new THREE.PointLight(0xc966ff, 2.0, 25);
    rimMagenta.position.set(6, -3, -3);
    scene.add(rimMagenta);

    // Cursor tracking specular point light (only active in intro)
    const cursorLight = new THREE.PointLight(0xffffff, 3.2, 14);
    cursorLight.position.set(0, 0, 4.0);
    scene.add(cursorLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    scene.add(ambientLight);

    // =========================================================================
    // 4. Section State, Viewport Bounds & Interactive Physics
    // =========================================================================
    let isIntro = true;
    let introTransition = 1.0; // 1.0 = intro, 0.0 = other pages

    // Mouse coordinates in normalized & 3D world space
    let normMouseX = 0;
    let normMouseY = 0;
    let cursorWorldX = 0;
    let cursorWorldY = 0;

    // Proximity avoidance velocities (Intro only)
    let avoidVelX = 0;
    let avoidVelY = 0;

    // Click attraction impulse velocities (Intro only)
    let attractImpulseX = 0;
    let attractImpulseY = 0;
    let clickSpinVelY = 0;
    let clickSpinVelX = 0;
    let clickScalePulse = 0;

    // Viewport world bounds helper
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

    // Scroll listener: tracks whether user is in #intro or other sections
    function updateScrollState() {
      const scrollY = window.scrollY;
      const introThreshold = window.innerHeight * 0.75;
      isIntro = scrollY < introThreshold;
    }
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    // =========================================================================
    // 5. Cursor Tracking & Proximity Avoidance (Intro ONLY)
    // =========================================================================
    window.addEventListener('mousemove', (e) => {
      normMouseX = (e.clientX / window.innerWidth) - 0.5;
      normMouseY = (e.clientY / window.innerHeight) - 0.5;

      cursorWorldX = normMouseX * visibleHalfW * 2.0;
      cursorWorldY = -normMouseY * visibleHalfH * 2.0;

      // STRICT RULE: If not in intro, completely ignore interaction
      if (!isIntro) {
        return;
      }

      // Move specular cursor light in 3D
      cursorLight.position.x = cursorWorldX * 0.85;
      cursorLight.position.y = cursorWorldY * 0.85;
    }, { passive: true });

    // =========================================================================
    // 6. Click Attraction: Pulls slightly toward cursor (Intro ONLY)
    // =========================================================================
    window.addEventListener('click', (e) => {
      // Ignore clicks on inputs, modals, buttons, links
      if (e.target.closest('input, textarea, .admin-modal, .admin-bar, a, button, [tabindex], .project-card, .achievement-card, .arc-card')) {
        return;
      }

      // STRICT RULE: Interaction disabled in other pages
      if (!isIntro) return;

      // Vector from star to cursor
      const toCursorX = cursorWorldX - masterGroup.position.x;
      const toCursorY = cursorWorldY - masterGroup.position.y;
      const distToCursor = Math.hypot(toCursorX, toCursorY);

      // Leaps / pulls slightly towards cursor
      if (distToCursor > 0.1) {
        const pullStrength = Math.min(1.6, Math.max(0.6, distToCursor * 0.45));
        attractImpulseX += (toCursorX / distToCursor) * pullStrength;
        attractImpulseY += (toCursorY / distToCursor) * pullStrength;
      }

      // Elastic scale pulse
      clickScalePulse = -0.15;

      // High-speed metallic spin burst
      clickSpinVelY += (Math.random() > 0.5 ? 12 : -12);
      clickSpinVelX += 6.0;

      // Specular flare
      cursorLight.intensity = 7.5;
    });

    // =========================================================================
    // 7. Animation Loop & State Execution
    // =========================================================================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      if (!reduced) {
        // Smooth transition between intro and other sections
        const targetTransition = isIntro ? 1.0 : 0.0;
        introTransition += (targetTransition - introTransition) * 0.07;

        // Container opacity: 1.0 in intro, 0.40 in other sections
        container.style.opacity = (0.40 + 0.60 * introTransition).toFixed(3);

        const isMobile = window.innerWidth < 900;
        const introPosX = isMobile ? 0 : 1.45;
        const introPosY = isMobile ? 0.15 : 0.05;

        // Scale interpolation (Slightly increased size: 0.98 desktop / 0.64 mobile)
        const introScale = isMobile ? 0.64 : 0.98;
        const otherScale = isMobile ? 0.52 : 0.80;
        const baseScale = otherScale + (introScale - otherScale) * introTransition;

        if (isIntro) {
          // ===================================================================
          // INTERACTIVE IN INTRO: Avoid cursor + pull on click
          // ===================================================================
          // 1. Calculate distance from star to cursor in 3D
          const dx = masterGroup.position.x - cursorWorldX;
          const dy = masterGroup.position.y - cursorWorldY;
          const distToCursor = Math.hypot(dx, dy);

          // Avoidance threshold: within ~2.4 units, it pushes away from the cursor
          const avoidDist = visibleHalfH * 0.95;
          if (distToCursor < avoidDist && distToCursor > 0.05) {
            const pushForce = Math.pow((avoidDist - distToCursor) / avoidDist, 1.4) * 4.2;
            avoidVelX += (dx / distToCursor) * pushForce * dt * 4.5;
            avoidVelY += (dy / distToCursor) * pushForce * dt * 4.5;
          }

          // Velocity dampening
          avoidVelX *= 0.90;
          avoidVelY *= 0.90;

          attractImpulseX *= 0.88;
          attractImpulseY *= 0.88;

          clickSpinVelY *= 0.92;
          clickSpinVelX *= 0.92;

          clickScalePulse *= 0.86;

          // Target position in intro = base position + avoidance repulsion + click attraction
          const targetX = introPosX + avoidVelX + attractImpulseX;
          const targetY = introPosY + avoidVelY + attractImpulseY;

          masterGroup.position.x += (targetX - masterGroup.position.x) * 0.08;
          masterGroup.position.y += (targetY - masterGroup.position.y) * 0.08;

          // Scale with click rebound
          masterGroup.scale.setScalar(Math.max(0.25, baseScale + clickScalePulse));

          // Interactive rotation: ambient glide + click spin impulse
          starMesh.rotation.y += dt * 0.35 + clickSpinVelY * dt;
          starMesh.rotation.x += dt * 0.18 + clickSpinVelX * dt;
          starMesh.rotation.z += dt * 0.12;

          // Gentle camera tilt in intro
          camera.position.x += (normMouseX * 0.5 - camera.position.x) * 0.04;
          camera.position.y += (-normMouseY * 0.35 - camera.position.y) * 0.04;

          cursorLight.intensity += (3.2 - cursorLight.intensity) * 0.08;
        } else {
          // ===================================================================
          // NON-INTERACTIVE IN OTHER PAGES: Centered & animated only
          // ===================================================================
          avoidVelX = 0;
          avoidVelY = 0;
          attractImpulseX = 0;
          attractImpulseY = 0;
          clickScalePulse = 0;

          // Gentle breathing float at exact center (x: 0, y: 0)
          const centeredFloatY = Math.sin(time * 0.85) * 0.08;

          masterGroup.position.x += (0 - masterGroup.position.x) * 0.07;
          masterGroup.position.y += (centeredFloatY - masterGroup.position.y) * 0.07;

          masterGroup.scale.setScalar(baseScale);

          // Steady continuous hypnotic ambient spinning (ZERO mouse interaction)
          starMesh.rotation.y += dt * 0.42;
          starMesh.rotation.x += dt * 0.20;
          starMesh.rotation.z += dt * 0.14;

          camera.position.x += (0 - camera.position.x) * 0.05;
          camera.position.y += (0 - camera.position.y) * 0.05;

          cursorLight.intensity = 0.8;
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
