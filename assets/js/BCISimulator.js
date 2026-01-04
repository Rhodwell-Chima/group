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
            const row = Date.now();
            const timeSinceMouseMove = now - this.lastMouseMove;

            this.focusLevel = Math.max(30, this.focusLevel -0.08);
            this.attention = Math.max(20, this.attention -0.05);
            this.engagement = Math.max(40, this.engagement - 0.03);

            if(timeSinceMouseMove > 10000) {
                this.focusLevel = Math.max(20,this.focusLevel - 0.2);
                this.attention = Math.max(10, this.attention -0.1);
            }

            const noise = Math.random() * 3 -1.5;
            this.focusLevel += noise;
            this.attention += noise * 0.7;

            this.focusLevel = Math.max(0, Math.min(100, this.focusLevel));
            this.attention = Math.max(0, Math.min(100, this.attention));
            this.engagement = Math.max(0, Math.min(100, this.engagement));
                
            this.stress = 100 - ((this.focusLevel + this.attention) / 2);
            this.meditation = (this.focusLevel + this.engagement) / 2;

        }
        updateVisualization() {
            document.getElementById('focus-bar').style.width = `${this.focusLevel}%`;
            document.getElementById('focus-value').textContent = `${Math.round(this.focusLevel)}%`;
                
            document.getElementById('attention-bar').style.width = `${this.attention}%`;
            document.getElementById('attention-value').textContent = `${Math.round(this.attention)}%`;
                
            document.getElementById('engagement-bar').style.width = `${this.engagement}%`;
            document.getElementById('engagement-value').textContent = `${Math.round(this.engagement)}%`;

            this.updateFrequencyBands();
            document.getElementById('projectAttentionFill').style.width = `${this.attention}%`;
    }
    updateFrequencyBands() {
                const focusFreq = document.getElementById('focus-frequency');
                const attentionBand = document.getElementById('attention-band');
                const engagementWave = document.getElementById('engagement-wave');
                
                // Update based on current state
                if (this.focusLevel > 80) {
                    focusFreq.textContent = 'β: 13-30 Hz';
                    focusFreq.style.color = '#00ff88';
                } else if (this.focusLevel > 60) {
                    focusFreq.textContent = 'α: 8-12 Hz';
                    focusFreq.style.color = '#88ff00';
                } else {
                    focusFreq.textContent = 'θ: 4-7 Hz';
                    focusFreq.style.color = '#ff8800';
                }
                
                if (this.attention > 75) {
                    attentionBand.textContent = 'β: 13-30 Hz';
                    attentionBand.style.color = '#00ff88';
                } else if (this.attention > 45) {
                    attentionBand.textContent = 'α: 8-12 Hz';
                    attentionBand.style.color = '#88ff00';
                } else {
                    attentionBand.textContent = 'θ: 4-7 Hz';
                    attentionBand.style.color = '#ff8800';
                }
                
                if (this.engagement > 80) {
                    engagementWave.textContent = 'γ: 31-100 Hz';
                    engagementWave.style.color = '#00ff88';
                } else if (this.engagement > 60) {
                    engagementWave.textContent = 'β: 13-30 Hz';
                    engagementWave.style.color = '#88ff00';
                } else {
                    engagementWave.textContent = 'α: 8-12 Hz';
                    engagementWave.style.color = '#ff8800';
                }
            }
    drawBrainwaves() {
                const canvas = document.getElementById('brainwave-canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw EEG-like waves
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const time = Date.now() * 0.01;
                const amplitude = (this.focusLevel / 100) * 15;
                const frequency = 0.1 + (this.attention / 100) * 0.2;
                const width = canvas.width;
                
                for (let x = 0; x < width; x++) {
                    const y = canvas.height / 2 + 
                        Math.sin(x * frequency + time) * amplitude +
                        Math.sin(x * frequency * 2 + time * 1.3) * amplitude * 0.5 +
                        Math.sin(x * frequency * 0.5 + time * 0.7) * amplitude * 0.3;
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                ctx.stroke();
                
                // Draw secondary wave for meditation
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                
                for (let x = 0; x < width; x++) {
                    const y = canvas.height / 2 + 
                        Math.cos(x * frequency * 0.7 + time * 0.8) * amplitude * 0.7;
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                ctx.stroke();
            }
            
            initProjectTracking() {
                document.querySelectorAll('.project-card').forEach(card => {
                    const projectId = card.querySelector('.project-title').textContent;
                    this.projectFocus[projectId] = 0;
                    
                    // Update scores periodically
                    setInterval(() => {
                        if (card.classList.contains('bci-focus')) {
                            this.projectFocus[projectId] = Math.min(100, 
                                this.projectFocus[projectId] + 2);
                        } else {
                            this.projectFocus[projectId] = Math.max(0,
                                this.projectFocus[projectId] - 0.5);
                        }
                        
                        // Update display
                        const scoreElement = card.querySelector('.score');
                        if (scoreElement) {
                            scoreElement.textContent = Math.round(this.projectFocus[projectId]);
                        }
                    }, 100);
                });
            }
            trackProjectAttention(card) {
                const title = card.querySelector('.project-title').textContent;
                
                // Boost attention when hovering projects
                this.attention = Math.min(100, this.attention + 8);
                this.engagement = Math.min(100, this.engagement + 5);
                
                // Update project focus
                if (!this.projectFocus[title]) this.projectFocus[title] = 0;
                this.projectFocus[title] = Math.min(100, this.projectFocus[title] + 15);
            }
            
            updateProjectHover(event) {
                // Find project card under cursor
                const elements = document.elementsFromPoint(event.clientX, event.clientY);
                const projectCard = elements.find(el => el.classList.contains('project-card'));
                
                if (projectCard) {
                    // Highlight based on BCI metrics
                    const intensity = this.focusLevel / 100;
                    projectCard.style.boxShadow = 
                        `0 0 ${20 * intensity}px rgba(0, 255, 136, ${0.5 * intensity})`;
                }
            }
            
            updateTypingMetrics(event) {
                const field = event.target;
                const value = field.value;
                
                // Calculate typing speed
                if (!field._lastTypingTime) field._lastTypingTime = Date.now();
                if (!field._lastLength) field._lastLength = 0;
                
                const now = Date.now();
                const timeDiff = now - field._lastTypingTime;
                const lengthDiff = value.length - field._lastLength;
                
                if (timeDiff > 100 && lengthDiff > 0) {
                    const cpm = (lengthDiff / timeDiff) * 60000;
                    this.typingMetrics.speed = Math.min(100, cpm / 4);
                    
                    field._lastTypingTime = now;
                    field._lastLength = value.length;
                }
                
                // Update focus based on typing
                this.focusLevel = Math.min(100, this.focusLevel + 0.5);
                this.attention = Math.min(100, this.attention + 0.3);
                
                // Update display
                document.getElementById('typingQuality').textContent = 
                    `${Math.round(this.typingMetrics.speed)}%`;
                document.getElementById('focusStability').textContent = 
                    `${Math.round(this.focusLevel)}%`;
            }
            
            processFormSubmission() {
                const submitBtn = document.getElementById('bciSubmit');
                const loading = document.getElementById('bciLoading');
                const btnText = submitBtn.querySelector('.btn-text');
                
                // Validate form
                const form = document.getElementById('contactForm');
                if (!form.checkValidity()) {
                    this.showNotification("Form Error", "Please fill all required fields correctly.", "error");
                    return;
                }
                
                // Show loading state
                btnText.textContent = 'Processing Neural Data...';
                loading.style.display = 'inline-block';
                submitBtn.disabled = true;
                
                // Simulate neural data processing
                setTimeout(() => {
                    // Analyze form completion quality
                    const quality = Math.round((this.focusLevel + this.attention) / 2);
                    
                    this.showNotification(
                        "Form Analysis Complete",
                        `Neural engagement: ${quality}% | Data quality: ${quality > 70 ? 'Excellent' : quality > 50 ? 'Good' : 'Fair'}`,
                        "success"
                    );
                    
                    // Show success animation
                    loading.style.display = 'none';
                    btnText.textContent = '✅ Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #008844)';
                    
                    // Reset after delay
                    setTimeout(() => {
                        form.reset();
                        btnText.textContent = 'Send Neural Message';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        
                        this.showNotification(
                            "Neural Reset",
                            "Form cleared. Ready for new input.",
                            "system"
                        );
                    }, 3000);
                    
                }, 2000);
            }
            
            showNotification(title, message, type = "info") {
                const notification = document.getElementById('bciNotification');
                const messageEl = document.getElementById('notificationMessage');
                const timestampEl = document.getElementById('notificationTimestamp');
                
                // Update icon based on type
                const icon = notification.querySelector('.notification-icon');
                switch(type) {
                    case "success": icon.textContent = "✅"; break;
                    case "error": icon.textContent = "⚠️"; break;
                    case "project": icon.textContent = "🚀"; break;
                    case "field": icon.textContent = "⌨️"; break;
                    default: icon.textContent = "🧠";
                }
                
                // Update content
                messageEl.innerHTML = `<strong>${title}</strong><br>${message}`;
                
                const now = new Date();
                timestampEl.textContent = 
                    `${now.getHours().toString().padStart(2, '0')}:` +
                    `${now.getMinutes().toString().padStart(2, '0')}:` +
                    `${now.getSeconds().toString().padStart(2, '0')}`;
                
                // Show notification
                notification.classList.add('show');
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 5000);
                
                // Log notification
                this.notificationQueue.push({ title, message, type, timestamp: now });
                if (this.notificationQueue.length > 10) this.notificationQueue.shift();
            }
            
            calibrate() {
                this.showNotification(
                    "Calibration Started",
                    "Please focus on the center of the screen for 5 seconds...",
                    "system"
                );
                
                let count = 5;
                const interval = setInterval(() => {
                    this.showNotification(
                        "Calibration",
                        `${count} seconds remaining...`,
                        "system"
                    );
                    
                    count--;
                    
                    if (count < 0) {
                        clearInterval(interval);
                        
                        // Reset metrics to optimal levels
                        this.focusLevel = 85;
                        this.attention = 80;
                        this.engagement = 90;
                        
                        this.showNotification(
                            "Calibration Complete",
                            "Neural interface optimized. Focus levels reset to optimal ranges.",
                            "success"
                        );
                    }
                }, 1000);
            }
            
            exportData() {
                const data = {
                    sessionStart: new Date(this.sessionStart).toISOString(),
                    sessionDuration: Date.now() - this.sessionStart,
                    metrics: {
                        averageFocus: this.focusLevel,
                        averageAttention: this.attention,
                        averageEngagement: this.engagement,
                        stressLevel: this.stress,
                        meditationLevel: this.meditation
                    },
                    projectEngagement: this.projectFocus,
                    notifications: this.notificationQueue,
                    typingMetrics: this.typingMetrics,
                    scrollActivity: this.scrollActivity
                };
                
                // Create downloadable JSON
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `neural-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showNotification(
                    "Data Exported",
                    "Neural session data downloaded as JSON file.",
                    "success"
                );
            }
            
            togglePanel() {
                const panel = document.getElementById('bci-visualization');
                const toggleBtn = document.getElementById('bciToggle');
                
                if (panel.style.height === '60px') {
                    panel.style.height = '';
                    toggleBtn.textContent = 'MINIMIZE';
                } else {
                    panel.style.height = '60px';
                    toggleBtn.textContent = 'MAXIMIZE';
                }
            }
            
            toggleBCI() {
                this.isActive = !this.isActive;
                const panel = document.getElementById('bci-visualization');
                const status = document.getElementById('bciStatus');
                const mode = document.getElementById('neuralMode');
                const toggleBtn = document.getElementById('bciToggleBtn');
                
                if (this.isActive) {
                    panel.style.opacity = '1';
                    panel.style.pointerEvents = 'auto';
                    status.textContent = 'ACTIVE';
                    status.style.background = 'var(--primary)';
                    mode.textContent = 'NEURAL MODE: ACTIVE';
                    mode.style.color = 'var(--primary)';
                    toggleBtn.textContent = ' DISABLE BCI';
                    
                    this.showNotification(
                        "Neural Interface Activated",
                        "BCI system online. Tracking neural patterns...",
                        "system"
                    );
                } else {
                    panel.style.opacity = '0.3';
                    panel.style.pointerEvents = 'none';
                    status.textContent = 'STANDBY';
                    status.style.background = '#666';
                    mode.textContent = 'NEURAL MODE: STANDBY';
                    mode.style.color = '#666';
                    toggleBtn.textContent = '🧠 ENABLE BCI';
                    
                    this.showNotification(
                        "Neural Interface Standby",
                        "BCI system in standby mode.",
                        "system"
                    );
                }
            }
            
            updateSessionTimer() {
                setInterval(() => {
                    const elapsed = Date.now() - this.sessionStart;
                    const hours = Math.floor(elapsed / 3600000);
                    const minutes = Math.floor((elapsed % 3600000) / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    
                    document.getElementById('sessionTime').textContent = 
                        `${hours.toString().padStart(2, '0')}:` +
                        `${minutes.toString().padStart(2, '0')}:` +
                        `${seconds.toString().padStart(2, '0')}`;
                    
                    // Simulate active users
                    const activeUsers = 1 + Math.floor(Math.random() * 5);
                    document.getElementById('activeUsers').textContent = activeUsers;
                }, 1000);
            }
        }
        
      
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize BCI
            const bci = new BCISimulator();
            
           
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if(targetId === '#') return;
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
           
            window.bci = bci;
         
            setInterval(() => {
                if (Math.random() > 0.97 && bci.isActive) {
                    bci.focusLevel = Math.min(100, bci.focusLevel + 15);
                    bci.showNotification(
                        "Neural Spike Detected",
                        "High focus activity detected in prefrontal cortex.",
                        "info"
                    );
                }
            }, 15000);
           
            setInterval(() => {
                if (Math.random() > 0.95) {
                    const title = document.querySelector('.site-title');
                    title.classList.add('glitch');
                    setTimeout(() => title.classList.remove('glitch'), 300);
                }
            }, 10000);
            
            document.querySelectorAll('.project-card button').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const card = this.closest('.project-card');
                    const title = card.querySelector('.project-title').textContent;
                    const description = card.querySelector('.project-description').textContent;
                    
                    bci.showNotification(
                        `Project Preview: ${title}`,
                        description,
                        "project"
                    );
                    
                   
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'pulse 0.5s';
                    }, 10);
                });
            });
        });