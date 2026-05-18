// script.js
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * height; 
  }
  
  reset() {
    this.x = Math.random() * width;
    this.y = height + 10;
    this.size = Math.random() * 2.5 + 0.5; // Slightly larger particles
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() * -1) - 0.3; // Slightly faster
    this.opacity = Math.random() * 0.7 + 0.3; // Brighter
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    this.speedX += (Math.random() - 0.5) * 0.02;
    
    if (this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
    }
  }
  
  draw() {
    ctx.fillStyle = `rgba(251, 238, 160, ${this.opacity})`; // Brighter gold
    ctx.shadowBlur = 12; // More glow
    ctx.shadowColor = 'rgba(251, 238, 160, 0.9)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 70; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

animate();

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
});

// Loader logic - Changed to DOMContentLoaded to avoid hanging on heavy iframes
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    // A small delay makes the loading feel deliberate and premium
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    }, 800);
  }
});

// Welcome Overlay Logic (Autoplay bypass)
const openBtn = document.getElementById('open-invitation');
if (openBtn) {
  openBtn.addEventListener('click', () => {
    const overlay = document.getElementById('welcome-overlay');
    overlay.style.opacity = '0';
    document.body.classList.remove('no-scroll');
    
    // Attempt to force autoplay the YouTube player
    const ytPlayer = document.getElementById('yt-player');
    if (ytPlayer && ytPlayer.contentWindow) {
      ytPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      if (!ytPlayer.src.includes('autoplay=1')) {
        ytPlayer.src += '&autoplay=1';
      }
    }

    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1000);
  });
}
