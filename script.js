const drawer = document.getElementById('drawer');
const toggle = document.getElementById('menuToggle');
const closeBtn = document.getElementById('drawerClose');

function openDrawer(){
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  toggle.setAttribute('aria-expanded','true');
  document.body.classList.add('menu-open');
}
function closeDrawer(){
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  toggle.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
}
toggle.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if(!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if(!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({top, behavior:'smooth'});
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

const navigationLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .drawer-nav a[href^="#"]')];
const navigationSections = [...new Set(navigationLinks
  .map(link => document.getElementById(link.getAttribute('href').slice(1)))
  .filter(Boolean))];

function setActiveNavigation(sectionId){
  navigationLinks.forEach(link => {
    if(link.getAttribute('href') === `#${sectionId}`){
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateActiveNavigation(){
  const marker = window.innerHeight * .35;
  const activeSection = navigationSections.find(section => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= marker && bounds.bottom > marker;
  });
  if(activeSection) setActiveNavigation(activeSection.id);
}

window.addEventListener('scroll', updateActiveNavigation, {passive:true});
window.addEventListener('resize', updateActiveNavigation);
navigationLinks.forEach(link => link.addEventListener('click', () => {
  setActiveNavigation(link.getAttribute('href').slice(1));
}));
updateActiveNavigation();

const portrait = document.querySelector('.portrait-wrap');
const portraitFrame = portrait?.querySelector('.portrait-frame');
const pointerMotion = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if(portrait && portraitFrame){
  const resetPortrait = () => {
    portraitFrame.style.setProperty('--pointer-tx', '0px');
    portraitFrame.style.setProperty('--pointer-ty', '0px');
    portraitFrame.style.setProperty('--pointer-rx', '0deg');
    portraitFrame.style.setProperty('--pointer-ry', '0deg');
  };

  portrait.addEventListener('pointermove', event => {
    if(!pointerMotion.matches || reducedMotion.matches) return;
    const bounds = portrait.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    portraitFrame.style.setProperty('--pointer-tx', `${(x * 16).toFixed(2)}px`);
    portraitFrame.style.setProperty('--pointer-ty', `${(y * 18).toFixed(2)}px`);
    portraitFrame.style.setProperty('--pointer-rx', `${(y * -12).toFixed(2)}deg`);
    portraitFrame.style.setProperty('--pointer-ry', `${(x * 12).toFixed(2)}deg`);
  });

  portrait.addEventListener('pointerleave', resetPortrait);

  reducedMotion.addEventListener('change', event => {
    if(event.matches) resetPortrait();
  });
}

window.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeDrawer();
});
