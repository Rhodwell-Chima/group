/* the class (BCISimulator ) is below this  */
class BCISimulator { 
    constructor() {
        this.focusLevel = 50;
        this.attention = 50;
        this.engament = 75;
        this.stress = 20;
        this.meditation = 60;

        this.sessionStart = Date.now();
        this.isActive = true;
        this.notificationQueue = [];
        this.currentField = null;
        this.typingMetrics = { speed: 0, accuracy: 0,consistency: 0};
        this.projectFocus = {};
        this.lasyMouseMove = Date.now();
        this.scrollActivity = 0;

        this.init();
    }

    init() {
        this.setupNeuralParticles();
        this.setupEventListeners();
        this.startUpdates();
        this.initProjectTracking();
        this.showNotification(
            "Neural Interface v1.0",
            "BCI System initialized. Tracking neural patterns.......",
            "system"
        );
        this.updateSessionTimer();   
    }
    setupNeuralParticles() {
        this.particlesCanvas = document.getElementsById('neuralParticles');
        this.particlesCtx = this.particlesCanvas.getContext('2d');
        const resizeCanvas = () => {
            this.particlesCanvas.width = window.innerWidth;
            this.particlesCanvas.height = window.innerHeight;
            this.particles = this.createParticles();
        };

        resizeCanvas();
        window.addEventListener('resize',resizeCanvas);

        const animate = () => {
            this.drawParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    createParticles() {
        const particles = [];
        const particleCount = Math.floor(window.innerwidth * window.innerHeight) / 4000;
        for(let i=0; i< particleCount; i++) {
            particles.push({
                x: Math.random() * this.particlesCanvas.width,
                y: Math.random() * this.particlesCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() -0.5) * 0.5,
                radius: Math.random() *2 + 0.5,
                color: 'rgba(0,255,136,${Math.random() * 0.3 + 0.1})',
                life: 1,
                decay: Math.random() * 0.01 + 0.001
            });
        }
        return particles;
    }
    drawParticles() {
        const ctx = this.particleCtx;
        const width  = this.particlesCanvas.width;
        const height = this.particlesCanvas.height;

        ctx.fillStyle = 'rgba(10, 10, 18 , 0.05)';
        ctx.fillRect(0,0,width,height);

        this.particles.forEach((p,i) => {
            p.x += p.vx;
            p.x += p.vy;

            if(p.x <0) p.x = width;
            if(p.x > width) p.x =0;
            if(p.y <0)p.y = height;
            if(p.y>height)p.y = 0;

            p.life -=p.decay;
            if(p.life <= 0) {
                p.x = Math.random() * width;
                piy = Math.random() * height;
                p.life = 1;

            }
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            const maxDistance = 100;
            this.particles.forEach((p2,j) => {
                if(i>=j) return;

                const dx = p2.x - p.x;
                const dy =p2.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < maxDistance){
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x,p2.y);
                    ctx.strokeStyle = 'rgba(0, 255, 136, ${(1 -distance/maxDistance) * 0.1*p.life * p2.life})';
                    ctx.linewidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    setupEventListeners(){
        document.addEventListener('mousemove', (e) => {
            this.lastMouseMove = Date.now();
            this.focusLevel = Math.min(100, this.focusLevl +0.2);
            this.attention = Math.min(100, this.attention + 0.1);

            this.updateProjectHover(e);
        })

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.engagement = Math.min(100, this.engagement + 0.3);
            this.scrollActivity++;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.scrollActivity = Math.max(0, this.scrollActivity -1 );
            },1000);
            });

            document.querySelectorAll('input, textaread,select').forEach(field => {
                field.addEventListener('focus', (e) => {
                    this.currentField = e.target;
                    this.showNotification(
                        "Field Analysis",
                        `Analyzing neural response for ${e.target.name || 'field'}...`,
                        "field"
                    );
                });
                field.addEventLsistener('input', (e) => {
                    this.updateTypingMetrics(e);
                });
            });

            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.classList.add('bci-focus');
                    this.trackProjectAttention(card);
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove('bci-focus');
                });

                card.querySelector('button').addEventListener('click',(e) => {
                    e.preventDefault();
                    card.classList.add('bci-active');
                    setTimeout(() => card.classList.remove('bci-active'), 2000);
                    this.showNotification(
                        "Project Engagement",
                        `Neural patterns show high interest in ${card.querySelector('.project-title').textContent}`,
                        "project"
                    );
                });
            });
            document.getElementById('contactForm').addEventListener('submit',(e) => {
                e.preventDefault();
                this.processFormSubmission();
            });
                document.getElementById('bciCalibrate').addEventListener('click', () => this.calibrate());
                document.getElementById('bciExport').addEventListener('click', () => this.exportData());
                document.getElementById('bciToggle').addEventListener('click', () => this.togglePanel());
                document.getElementById('bciToggleBtn').addEventListener('click', () => this.toggleBCI());

                document.querySelector('button[type="reset"]').addEventListener('click', () => {
                    this.showNotification("Neural Buffer cleared","All form data has been reset.","system");
                });
        }

        startUpdates() {
            setInterval(() => {
                this.updateMetrics();
                this.updateVisaulization();
                this.drawBrainwaves();
            },100);

            setInterval(() => {
                document.getElementById('liveFocus').textContent = `${Math.round(this.focusLevel)}%`;
                document.getElementById('formFocusStatus').textContent = 
                        `Form Focus: ${this.focusLevel > 70 ? 'High' : this.focusLevel > 40 ? 'Medium' : 'Low'}`;

            }, 500);

        }
        updateMetrics() {
            
        }
    }
}