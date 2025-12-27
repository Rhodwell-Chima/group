(function () {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.querySelector('.matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let fontSize = 18; // base - will be clamped on resize
    let columns = 0;
    let drops = [];
    const chars = 'アァカサタナハマヤャラワイィキシチニヒミリヰウゥクスツヌフムユュルエェケセテネヘメレヱオォコソトノホモヨョロヲ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const decay = 0.06; // background alpha for trail fade

    function getPrimaryColor() {
        const el = canvas;
        const val = getComputedStyle(el).getPropertyValue('--color-primary').trim();
        return val || '#00ff99';
    }

    function resize() {
        // size matches the element's client size
        const rect = canvas.getBoundingClientRect();
        dpr = Math.max(1, window.devicePixelRatio || 1);
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // choose font size relative to width but clamp for readability
        fontSize = Math.max(12, Math.min(26, Math.floor(width / 40)));
        columns = Math.max(1, Math.floor(width / fontSize));
        drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * 10));
        ctx.textBaseline = 'top';
        ctx.font = `${fontSize}px monospace`;
    }

    function step() {
        // fade with a semi-transparent rect to create trailing effect
        ctx.fillStyle = `rgba(0,0,0,${decay})`;
        ctx.fillRect(0, 0, width, height);

        const color = getPrimaryColor();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const char = chars.charAt(Math.floor(Math.random() * chars.length));
            // draw character
            ctx.fillText(char, x, y);
            // advance drop
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i]++;
            }
        }

        animationId = requestAnimationFrame(step);
    }

    let animationId = null;

    function start() {
        if (animationId == null) {
            resize();
            animationId = requestAnimationFrame(step);
        }
    }

    function stop() {
        if (animationId != null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // initialize and attach events
    resize();
    start();
    window.addEventListener('resize', () => {
        // small debounce
        clearTimeout(window._matrixResizeTimer);
        window._matrixResizeTimer = setTimeout(() => {
            resize();
        }, 120);
    });

    // Respect runtime reduced-motion changes
    if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.addEventListener('change', (e) => {
            if (e.matches) stop();
            else start();
        });
    }
})();