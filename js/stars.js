/* a quiet sky — stars that breathe, a few of them gold */
(function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function gold() {
        // roughly one in seven stars wears the brand's gold
        return Math.random() < 0.14;
    }

    function seed() {
        var w = window.innerWidth, h = window.innerHeight;
        canvas.width = w * DPR;
        canvas.height = h * DPR;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        var count = Math.round((w * h) / 9000);
        stars = [];
        for (var i = 0; i < count; i++) {
            var r = Math.random();
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: r < 0.85 ? 0.7 + Math.random() * 0.7 : 1.2 + Math.random() * 0.9,
                period: 2.6 + Math.random() * 4.5,          // seconds per breath
                phase: Math.random() * Math.PI * 2,
                base: 0.25 + Math.random() * 0.45,          // dimmest alpha
                amp: 0.25 + Math.random() * 0.35,           // how much it brightens
                gold: gold()
            });
        }
    }

    function draw(t) {
        var w = window.innerWidth, h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var tw = reduced ? 0.6 : s.base + s.amp * (0.5 + 0.5 * Math.sin((t / 1000) * (2 * Math.PI / s.period) + s.phase));
            ctx.globalAlpha = Math.min(tw, 1);
            ctx.fillStyle = s.gold ? '#d9b877' : '#dfe4ee';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    var running = false;
    function frame(t) {
        draw(t);
        if (!reduced) requestAnimationFrame(frame);
    }

    seed();
    draw(0);
    if (!reduced) requestAnimationFrame(frame);

    var t;
    window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(function () { seed(); draw(0); }, 200);
    });
})();
