/**
 * =========================================================================
 * 3D REALISTIC FLORAL BOUQUET ENGINE (Three.js)
 * =========================================================================
 * - Perfectly centered in viewport (never sunken in the ground)
 * - True curved, cupped rose petal geometry with silky natural curvature
 * - 7 distinct sculpted garden roses with zero overlapping/clipping
 * - 4 curated bouquet themes: Classic Red, Pastel Garden, Sunset Coral, Royal Violet
 * - 360° orbit drag, zooming, blooming animation, and secret love note dewdrops
 */

class Bouquet3DEngine {
  constructor() {
    this.container = document.getElementById('flower-canvas-container');
    this.config = window.STORY_CONFIG.flowerExperience;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bouquetGroup = null;

    this.roses = [];
    this.allPetalMeshes = [];
    this.dewdrops = [];
    this.fillerClusters = [];
    this.leafMeshes = [];
    this.wrapperMesh = null;
    this.ribbonMesh = null;
    this.particles = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.isInitialized = false;
    this.bloomProgress = 0;
    this.isBlooming = false;
    this.currentStyleIndex = 0;

    // 360° Orbit Drag Controls
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.18, y: 0 };
    this.currentRotation = { x: 0.18, y: 0 };

    this.initStylesUI();
  }

  initAndBloom() {
    if (!this.isInitialized) {
      this.initThree();
      this.buildBouquet();
      this.buildAtmosphericParticles();
      this.setupInteraction();
      this.animate();
      this.isInitialized = true;
    }
    this.triggerBloom();
  }

  initThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x140207, 0.035);

    // Optimized camera settings to center the bouquet vertically
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0.55, 8.0);
    this.camera.lookAt(0, 0.15, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Warm Romantic Multi-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfff1f2, 0.95);
    this.scene.add(ambientLight);

    const mainKey = new THREE.DirectionalLight(0xffffff, 2.3);
    mainKey.position.set(5, 9, 6);
    this.scene.add(mainKey);

    const fillLight = new THREE.PointLight(0xe11d48, 2.8, 18);
    fillLight.position.set(-5, 4, 4);
    this.scene.add(fillLight);

    const goldRim = new THREE.DirectionalLight(0xfde047, 1.6);
    goldRim.position.set(0, -6, -4);
    this.scene.add(goldRim);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Generates a realistic double-curved, dish-shaped rose petal geometry.
   * Features natural cupping across the belly and an outward curl at the tip.
   */
  createCurvedRosePetalGeometry(width, height, cupDepth, tipCurl) {
    const segU = 14;
    const segV = 16;
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let j = 0; j <= segV; j++) {
      const v = j / segV;
      const widthFactor = Math.sin(v * Math.PI * 0.88) * (1.0 - 0.18 * (1 - v));

      for (let i = 0; i <= segU; i++) {
        const uNorm = i / segU;
        const u = uNorm * 2.0 - 1.0;

        const x = u * (width * 0.5) * widthFactor;
        const y = v * height;
        const zCup = -cupDepth * (1.0 - u * u) * Math.sin(v * Math.PI);
        const curlProgress = Math.max(0, (v - 0.65) / 0.35);
        const zCurl = tipCurl * Math.pow(curlProgress, 2);
        const z = zCup + zCurl;

        positions.push(x, y, z);
        uvs.push(uNorm, v);
      }
    }

    for (let j = 0; j < segV; j++) {
      for (let i = 0; i < segU; i++) {
        const a = j * (segU + 1) + i;
        const b = (j + 1) * (segU + 1) + i;
        const c = (j + 1) * (segU + 1) + (i + 1);
        const d = j * (segU + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  buildBouquet() {
    this.bouquetGroup = new THREE.Group();
    // Elevated center position so the bouquet floats comfortably in the center of the screen
    this.bouquetGroup.position.set(0, 0.15, 0);
    this.scene.add(this.bouquetGroup);

    this.roses = [];
    this.allPetalMeshes = [];
    this.dewdrops = [];
    this.fillerClusters = [];
    this.leafMeshes = [];

    // Shared Green Stem & Leaf Materials
    this.stemMat = new THREE.MeshStandardMaterial({
      color: 0x1e4620,
      roughness: 0.65,
      metalness: 0.05
    });

    this.leafMat = new THREE.MeshStandardMaterial({
      color: 0x163818,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // 1. Decorative Florist Paper Wrapping at Base
    this.buildFloristWrapping();

    // 2. Build 7 Distinct Sculpted Roses (1 Center + 6 Hexagonal Ring)
    const bouquetLayout = [
      // Central Hero Rose (Elevated & Prominent)
      { x: 0, y: 0.45, z: 0, rotX: 0.05, rotZ: 0, scale: 1.05, isCenter: true },
      // Surrounding Ring of 6 Roses (Cleanly spaced at r = 0.95, radially tilted)
      { x: 0.95, y: 0.22, z: 0, rotX: 0, rotZ: -0.42, scale: 0.92, isCenter: false },
      { x: 0.48, y: 0.22, z: 0.82, rotX: 0.38, rotZ: -0.22, scale: 0.92, isCenter: false },
      { x: -0.48, y: 0.22, z: 0.82, rotX: 0.38, rotZ: 0.22, scale: 0.92, isCenter: false },
      { x: -0.95, y: 0.22, z: 0, rotX: 0, rotZ: 0.42, scale: 0.92, isCenter: false },
      { x: -0.48, y: 0.22, z: -0.82, rotX: -0.38, rotZ: 0.22, scale: 0.92, isCenter: false },
      { x: 0.48, y: 0.22, z: -0.82, rotX: -0.38, rotZ: -0.22, scale: 0.92, isCenter: false }
    ];

    bouquetLayout.forEach((cfg, idx) => {
      const rose = this.createSculptedRose(cfg, idx);
      this.bouquetGroup.add(rose.group);
      this.roses.push(rose);
    });

    // 3. Delicate Gypsophila / Baby's Breath Starry Clusters
    this.buildBabyBreathFillers();

    // 4. Perimeter Green Eucalyptus Leaves Cupping the Bouquet
    this.buildFoliageSkirt();
  }

  createSculptedRose(cfg, roseIndex) {
    const roseGroup = new THREE.Group();
    roseGroup.position.set(cfg.x, cfg.y, cfg.z);
    roseGroup.rotation.x = cfg.rotX;
    roseGroup.rotation.z = cfg.rotZ;
    roseGroup.scale.set(cfg.scale, cfg.scale, cfg.scale);

    // Organic Curved Stem anchoring into the wrap bundle
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.9, 0),
      new THREE.Vector3(-cfg.x * 0.45, -0.9, -cfg.z * 0.45),
      new THREE.Vector3(0, 0, 0)
    ]);
    const stemMesh = new THREE.Mesh(
      new THREE.TubeGeometry(stemCurve, 14, 0.042, 8, false),
      this.stemMat
    );
    roseGroup.add(stemMesh);

    // Green Calyx Base holding the rose head
    const calyxGeo = new THREE.ConeGeometry(0.24, 0.32, 6);
    calyxGeo.rotateX(Math.PI);
    const calyx = new THREE.Mesh(calyxGeo, this.stemMat);
    calyx.position.set(0, -0.08, 0);
    roseGroup.add(calyx);

    // Golden Receptacle Core inside
    const stamenCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
        roughness: 0.3
      })
    );
    stamenCore.position.set(0, 0.12, 0);
    roseGroup.add(stamenCore);

    // Layered Concentric Whorls of Curved Petals
    const rosePetals = [];
    const whorlDefinitions = [
      { count: 3, r: 0.04, w: 0.32, h: 0.42, cup: 0.16, curl: 0.05, tilt: 10, isInner: true },
      { count: 4, r: 0.10, w: 0.44, h: 0.52, cup: 0.22, curl: 0.10, tilt: 22, isInner: true },
      { count: 5, r: 0.20, w: 0.58, h: 0.65, cup: 0.28, curl: 0.18, tilt: 38, isInner: false },
      { count: 6, r: 0.32, w: 0.74, h: 0.78, cup: 0.34, curl: 0.26, tilt: 56, isInner: false },
      { count: 7, r: 0.45, w: 0.88, h: 0.90, cup: 0.38, curl: 0.32, tilt: 70, isInner: false }
    ];

    let petalCounter = 0;
    whorlDefinitions.forEach((whorl) => {
      const geom = this.createCurvedRosePetalGeometry(whorl.w, whorl.h, whorl.cup, whorl.curl);
      const mat = this.getPetalMaterial(this.currentStyleIndex, cfg.isCenter, whorl.isInner);

      for (let i = 0; i < whorl.count; i++) {
        const mesh = new THREE.Mesh(geom, mat);
        const angle = (i * (2 * Math.PI / whorl.count)) + (petalCounter * 0.38);
        const tiltRad = (whorl.tilt * Math.PI) / 180;

        mesh.userData = {
          baseScale: new THREE.Vector3(0.15, 0.15, 0.15),
          targetScale: new THREE.Vector3(1.0, 1.0, 1.0),
          targetTilt: tiltRad,
          baseTilt: tiltRad * 0.25,
          angle: angle,
          targetRadius: whorl.r,
          isInner: whorl.isInner,
          isCenter: cfg.isCenter
        };

        // Initial Bud State Setup
        mesh.rotation.y = -angle;
        mesh.rotation.x = mesh.userData.baseTilt;
        mesh.position.set(
          Math.cos(angle) * (whorl.r * 0.3),
          0.05,
          Math.sin(angle) * (whorl.r * 0.3)
        );
        mesh.scale.set(0.15, 0.15, 0.15);

        roseGroup.add(mesh);
        rosePetals.push(mesh);
        this.allPetalMeshes.push(mesh);
        petalCounter++;
      }
    });

    // Attach 1 glowing interactive dewdrop to each of the 7 bouquet roses!
    const outerPetal = rosePetals[rosePetals.length - 2];
    this.addDewdropToPetal(outerPetal, roseIndex);

    return { group: roseGroup, petals: rosePetals, isCenter: cfg.isCenter };
  }

  getPetalMaterial(styleIdx, isCenter, isInner) {
    const style = this.config.styles[styleIdx];

    let petalHex;
    if (style.id === 'classic-romantic') {
      // Classic Velvet Red Roses: deep rich crimson and ruby
      petalHex = isInner ? 0x7a0914 : (isCenter ? 0xbe123c : 0xa61026);
    } else if (style.id === 'pastel-garden') {
      // Pastel Garden Harmony: peony pink, blush, and creamy ivory
      petalHex = isInner ? 0xf472b6 : (isCenter ? 0xfda4af : 0xfff1f2);
    } else if (style.id === 'sunset-gold') {
      // Sunset Coral & Gold: warm peach, coral rose, and honey amber
      petalHex = isInner ? 0xd97706 : (isCenter ? 0xf59e0b : 0xfb7185);
    } else if (style.id === 'royal-violet') {
      // Royal Violet & Lavender: imperial violet and lavender blossoms
      petalHex = isInner ? 0x6d28d9 : (isCenter ? 0x8b5cf6 : 0xa78bfa);
    } else {
      petalHex = style.colorHex;
    }

    return new THREE.MeshStandardMaterial({
      color: petalHex,
      roughness: style.roughness || 0.42,
      metalness: style.metalness || 0.08,
      side: THREE.DoubleSide
    });
  }

  buildFloristWrapping() {
    // Tasteful, low florist wrapping paper that holds the bouquet from underneath
    const wrapGeo = new THREE.CylinderGeometry(1.48, 0.4, 2.2, 32, 1, true);
    this.wrapperMat = new THREE.MeshStandardMaterial({
      color: 0x22050c, // Deep matte wine florist paper
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    this.wrapperMesh = new THREE.Mesh(wrapGeo, this.wrapperMat);
    this.wrapperMesh.position.set(0, -1.3, 0);
    this.bouquetGroup.add(this.wrapperMesh);

    // Scalloped decorative border around paper top
    const collarGeo = new THREE.TorusGeometry(1.48, 0.045, 12, 36);
    const collarMesh = new THREE.Mesh(collarGeo, this.wrapperMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, -0.2, 0);
    this.bouquetGroup.add(collarMesh);

    // Satin Ribbon Bow at bouquet waist
    const ribbonGeo = new THREE.TorusGeometry(0.55, 0.075, 16, 32);
    this.ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xf5c26b, // Gilded gold satin
      roughness: 0.25,
      metalness: 0.65
    });
    this.ribbonMesh = new THREE.Mesh(ribbonGeo, this.ribbonMat);
    this.ribbonMesh.rotation.x = Math.PI / 2;
    this.ribbonMesh.position.set(0, -1.2, 0);
    this.bouquetGroup.add(this.ribbonMesh);

    // Falling ribbon tails
    const tailGeo = new THREE.BoxGeometry(0.12, 0.95, 0.02);
    const tail1 = new THREE.Mesh(tailGeo, this.ribbonMat);
    tail1.position.set(-0.16, -1.65, 0.52);
    tail1.rotation.z = 0.22;
    this.bouquetGroup.add(tail1);

    const tail2 = new THREE.Mesh(tailGeo, this.ribbonMat);
    tail2.position.set(0.16, -1.65, 0.52);
    tail2.rotation.z = -0.22;
    this.bouquetGroup.add(tail2);
  }

  buildBabyBreathFillers() {
    // Starry baby's breath clusters tucked between roses
    const floretGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const floretMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      emissive: 0xffe4e6,
      emissiveIntensity: 0.45
    });

    const fillerCoords = [
      { x: 0.45, y: 0.42, z: 0.45 },
      { x: -0.45, y: 0.42, z: 0.45 },
      { x: 0.45, y: 0.42, z: -0.45 },
      { x: -0.45, y: 0.42, z: -0.45 },
      { x: 0, y: 0.48, z: 0.55 },
      { x: 0, y: 0.48, z: -0.55 },
      { x: 0.98, y: 0.18, z: 0.48 },
      { x: -0.98, y: 0.18, z: 0.48 }
    ];

    fillerCoords.forEach(pos => {
      const cluster = new THREE.Group();
      cluster.position.set(pos.x, pos.y, pos.z);

      for (let j = 0; j < 5; j++) {
        const floret = new THREE.Mesh(floretGeo, floretMat);
        floret.position.set(
          (Math.random() - 0.5) * 0.22,
          (Math.random() - 0.5) * 0.22,
          (Math.random() - 0.5) * 0.22
        );
        cluster.add(floret);
      }
      this.bouquetGroup.add(cluster);
      this.fillerClusters.push(cluster);
    });
  }

  buildFoliageSkirt() {
    // Deep green eucalyptus leaves cupping the bottom of the bouquet
    const leafCount = 10;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.28, 0.2, 0.38, 0.7, 0, 1.15);
      leafShape.bezierCurveTo(-0.38, 0.7, -0.28, 0.2, 0, 0);

      const geo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.018, bevelEnabled: false });
      const leafMesh = new THREE.Mesh(geo, this.leafMat);

      leafMesh.position.set(
        Math.cos(angle) * 1.25,
        0.02,
        Math.sin(angle) * 1.25
      );
      leafMesh.rotation.y = -angle;
      leafMesh.rotation.x = 0.85;
      leafMesh.scale.set(0.85, 0.85, 0.85);

      this.bouquetGroup.add(leafMesh);
      this.leafMeshes.push(leafMesh);
    }
  }

  addDewdropToPetal(petal, index) {
    const dewGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const dewMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xfb7185,
      emissiveIntensity: 0.8,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      transparent: true
    });

    const dewdrop = new THREE.Mesh(dewGeo, dewMat);
    dewdrop.position.set(0, 0.45, 0.08);
    dewdrop.userData = {
      isDewdrop: true,
      noteIndex: index
    };

    petal.add(dewdrop);
    this.dewdrops.push(dewdrop);
  }

  buildAtmosphericParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf5c26b,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  triggerBloom() {
    this.isBlooming = true;
    this.bloomProgress = 0;
  }

  setupInteraction() {
    const el = this.renderer.domElement;

    // 360° Drag & Tilt
    el.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };

      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.dewdrops, true);

      if (intersects.length > 0) {
        const drop = intersects[0].object;
        if (drop.userData && drop.userData.noteIndex !== undefined) {
          this.revealSecretNote(drop.userData.noteIndex);
        }
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.008;
      this.targetRotation.x = Math.max(-0.35, Math.min(0.65, this.targetRotation.x + deltaY * 0.006));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Zoom on wheel
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z = Math.max(5.5, Math.min(11.0, this.camera.position.z + e.deltaY * 0.005));
    }, { passive: false });
  }

  revealSecretNote(index) {
    const notes = this.config.secretNotes;
    const noteText = notes[index] || "I love you with all my heart.";

    let toast = document.getElementById('secret-note-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'secret-note-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 110px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(36, 8, 16, 0.94);
        border: 1px solid rgba(244, 114, 182, 0.5);
        color: #fff1f2;
        padding: 14px 28px;
        border-radius: 9999px;
        backdrop-filter: blur(16px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.75), 0 0 25px rgba(225, 29, 72, 0.4);
        font-size: 0.96rem;
        z-index: 80;
        transition: all 0.3s ease;
        text-align: center;
        max-width: 90%;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = `🌹 ${noteText}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 4500);
  }

  initStylesUI() {
    const container = document.getElementById('flower-style-picker');
    if (!container) return;

    container.innerHTML = '';
    this.config.styles.forEach((style, idx) => {
      const chip = document.createElement('button');
      chip.className = `style-chip ${idx === 0 ? 'active' : ''}`;
      chip.textContent = style.name;

      chip.addEventListener('click', () => {
        document.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.switchStyle(idx);
      });

      container.appendChild(chip);
    });

    const hl = document.querySelector('.flower-headline');
    const st = document.querySelector('.flower-subtext');
    if (hl && this.config.title) hl.textContent = this.config.title;
    if (st && this.config.subtitle) st.textContent = this.config.subtitle;
  }

  switchStyle(index) {
    this.currentStyleIndex = index;
    const style = this.config.styles[index];

    // Refresh petal materials on all roses
    this.roses.forEach(rose => {
      rose.petals.forEach(petal => {
        petal.material = this.getPetalMaterial(index, rose.isCenter, petal.userData.isInner);
      });
    });

    if (this.wrapperMat) {
      this.wrapperMat.color.setHex(style.id === 'sunset-gold' ? 0x241407 : (style.id === 'royal-violet' ? 0x1f0e2b : 0x22050c));
    }
  }

  onWindowResize() {
    if (!this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.07;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.07;

    if (this.bouquetGroup) {
      // Gentle romantic breathing motion
      const swayY = Math.sin(time * 0.65) * 0.025;
      const swayZ = Math.cos(time * 0.5) * 0.015;

      this.bouquetGroup.rotation.x = this.currentRotation.x + swayZ;
      this.bouquetGroup.rotation.y = this.currentRotation.y + swayY + (!this.isDragging ? time * 0.05 : 0);
    }

    // Dynamic Blooming Progression for every petal in the bouquet
    if (this.isBlooming && this.bloomProgress < 1) {
      this.bloomProgress = Math.min(1, this.bloomProgress + 0.01);
      const eased = this.easeOutCubic(this.bloomProgress);

      this.allPetalMeshes.forEach(petal => {
        const u = petal.userData;
        petal.scale.lerpVectors(u.baseScale, u.targetScale, eased);
        petal.rotation.x = u.baseTilt + (u.targetTilt - u.baseTilt) * eased;

        const currentRadius = u.targetRadius * (0.35 + 0.65 * eased);
        petal.position.x = Math.cos(u.angle) * currentRadius;
        petal.position.z = Math.sin(u.angle) * currentRadius;
      });
    }

    // Floating Stardust
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
      this.particles.rotation.x = Math.sin(time * 0.015) * 0.06;
    }

    // Dewdrops pulse
    this.dewdrops.forEach((drop, i) => {
      const pulse = 1 + Math.sin(time * 3.5 + i) * 0.16;
      drop.scale.set(pulse, pulse, pulse);
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
}

window.flower3DEngine = new Bouquet3DEngine();
