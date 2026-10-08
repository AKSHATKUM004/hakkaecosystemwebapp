import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.querySelector('.loader');
const loaderNumber = loader.querySelector('b');

function finishLoader() {
  loaderNumber.textContent = '100';
  loader.classList.add('leave');
  document.body.classList.remove('preload');
  window.setTimeout(() => loader.remove(), 900);
}

window.setTimeout(finishLoader, reduceMotion ? 50 : 820);

function startThree() {
  if (reduceMotion) return;
  const canvas = document.querySelector('#heroCanvas');
  const hero = document.querySelector('.hero');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const light = new THREE.DirectionalLight(0xf7b95d, 2.3);
  light.position.set(-3, 4, 5);
  scene.add(light, new THREE.AmbientLight(0xdc6f40, 1.1));

  const beanMaterial = new THREE.MeshStandardMaterial({ color: 0xf4a51c, roughness: 0.43, metalness: 0.08 });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0xd3321e, roughness: 0.7 });
  const geometry = new THREE.SphereGeometry(0.34, 24, 24);
  const seamGeometry = new THREE.TorusGeometry(0.15, 0.014, 10, 30, Math.PI);
  const group = new THREE.Group();
  const specs = [[-2.6,1.4,.1,.75],[2.75,.6,-.5,.45],[-1.8,-1.55,-.6,.5],[1.25,2.1,-1,.34],[3.1,-1.3,-1.1,.28]];
  specs.forEach(([x,y,z,s], index) => {
    const bean = new THREE.Group();
    const body = new THREE.Mesh(geometry, beanMaterial);
    body.scale.set(.7, 1, .42);
    const seam = new THREE.Mesh(seamGeometry, seamMaterial);
    seam.rotation.x = Math.PI / 2;
    seam.scale.set(.9, 1.35, 1);
    bean.add(body, seam);
    bean.position.set(x, y, z);
    bean.scale.setScalar(s);
    bean.rotation.set(index * .45, index * .72, index * .38);
    bean.userData = { speed: .15 + index * .035, baseY: y, drift: index * .6 };
    group.add(bean);
  });
  scene.add(group);

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);
  let scrollOffset = 0;
  window.addEventListener('scroll', () => { scrollOffset = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1); }, { passive: true });
  const clock = new THREE.Clock();
  function render() {
    const time = clock.getElapsedTime();
    group.children.forEach((bean) => {
      bean.rotation.y += bean.userData.speed * .012;
      bean.rotation.z += bean.userData.speed * .008;
      bean.position.y = bean.userData.baseY + Math.sin(time * bean.userData.speed * 4 + bean.userData.drift) * .08;
    });
    group.rotation.z = scrollOffset * .85;
    group.position.y = -scrollOffset * 1.7;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}

function startScrollMotion() {
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const heroLines = document.querySelectorAll('.hero h1, .hero .eyebrow, .hero .intro, .hero .round-link');
  gsap.from(heroLines, { y: 62, opacity: 0, duration: .9, ease: 'power4.out', stagger: .08, delay: .85 });
  gsap.from('.coffee-cutout', { scale: .58, y: 110, rotation: -9, opacity: 0, duration: 1.35, ease: 'power4.out', delay: .7 });
  gsap.to('.coffee-cutout', { yPercent: 12, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-stamp', { rotation: 285, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.story, .menu-section, .visit').forEach((section) => {
    const title = section.querySelector('h2');
    const eyebrow = section.querySelector('.eyebrow');
    gsap.from([eyebrow, title], { y: 82, opacity: 0, duration: 1, ease: 'power4.out', stagger: .1, scrollTrigger: { trigger: section, start: 'top 77%' } });
  });
  gsap.from('.ingredient-row article', { y: 38, opacity: 0, stagger: .14, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: '.ingredient-row', start: 'top 79%' } });
  gsap.from('.menu-card', { y: 115, rotation: 4, opacity: 0, stagger: .12, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.menu-grid', start: 'top 76%' } });
  gsap.from('.menu-cutout', { y: 45, scale: .78, rotation: -7, opacity: 0, stagger: .1, duration: .85, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.menu-grid', start: 'top 68%' } });
  const pinEnabled = window.matchMedia('(min-width: 761px)').matches;
  gsap.timeline({ scrollTrigger: { trigger: '.pour-section', start: 'top top', end: pinEnabled ? '+=85%' : 'bottom bottom', pin: pinEnabled, scrub: .65 } })
    .to('.pour-word', { scale: 1.42, rotation: 9, ease: 'none' }, 0)
    .to('.chole-cutout', { scale: 1.12, rotation: -5, yPercent: -8, ease: 'none' }, 0)
    .to('.ring-one', { rotation: 120, scale: 1.16, ease: 'none' }, 0)
    .to('.ring-two', { rotation: -150, scale: .72, ease: 'none' }, 0)
    .from('.pour-copy > *', { x: 45, opacity: 0, stagger: .1, ease: 'none' }, 0);
  gsap.from('.visit-card', { y: 90, rotate: -7, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.visit', start: 'top 67%' } });
}

startThree();
startScrollMotion();
