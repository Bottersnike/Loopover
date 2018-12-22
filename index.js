let size = 5;
let pad = 0;
let ctx;
let w, h, side, ts, xp, yp;
let dx, dy;
let animating;
let anim_frame;
let anim_frames = 5;
let grid;
let t_grid;
let pannel = 300;
let action = "Scramble";
let start = 0;
let times = [];
let max_size = 30;


Array.prototype.rotateRight = function(n) {
    this.unshift.apply(this, this.splice(n, this.length))
    return this;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotateCounterClockwise(a){
    var n=a.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=a[i][j];
            a[i][j]=a[j][n-i-1];
            a[j][n-i-1]=a[n-i-1][n-j-1];
            a[n-i-1][n-j-1]=a[n-j-1][i];
            a[n-j-1][i]=tmp;
        }
    }
    return a;
}

function rotateClockwise(a) {
    var n=a.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=a[i][j];
            a[i][j]=a[n-j-1][i];
            a[n-j-1][i]=a[n-i-1][n-j-1];
            a[n-i-1][n-j-1]=a[j][n-i-1];
            a[j][n-i-1]=tmp;
        }
    }
    return a;
}


function makeGrid() {
    grid = [];
    t_grid = [];
    for (let x = 0; x < size; x++) {
        grid.push([]);
        t_grid.push([]);
        for (let y = 0; y < size; y++) {
            grid[x].push(y * size + x);
            t_grid[x].push(y * size + x);
        }
    }
}


window.requestAnimFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        });
}();


//window.requestAnimFrame = function(cb) {
//    window.setTimeout(cb, 1000 / 10)
//};


function render() {
    ctx.clearRect(0, 0, w, h)

    let fs = ts * .50;

    ctx.font = fs + "px sans-serif";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXY"

    let i;
    for (let x = -1; x <= size; x++) {
        for (let y = -1; y <= size; y++) {
            i = grid[(x + size) % size][(y + size) % size];

            let colorX = (i % size) / (size - 1);
            let colorY = (i / size) / (size - 1);
            ctx.fillStyle = "rgb(" + Math.round((1 - colorX) * 255) + "," + Math.round(colorY * 255) + "," + Math.round(colorX * 255) + ")";

            if (size <= 5) i = chars[i];
            else i += 1;

            let delt_y = 0;
            let delt_x = 0;
            if (animating && x === animating[3]) {
                delt_y = -((animating[0] - animating[1]) * ts) / anim_frames * (anim_frame - anim_frames);
            }
            if (animating && y === animating[1]) {
                delt_x = -((animating[2] - animating[3]) * ts) / anim_frames * (anim_frame - anim_frames);
            }

            ctx.fillRect(x * ts + xp + pad + delt_x, y * ts + yp + pad + delt_y, ts - pad * 2, ts - pad * 2);
            ctx.fillStyle = "#000";
            let t_size = ctx.measureText(i).width;
            ctx.fillText(i, delt_x + xp + x * ts + (ts - t_size) / 2, yp + y * ts + (ts + fs * .7) / 2 + delt_y);
        }
    }

    anim_frame += (0.5 - anim_frame / 10) * 4;
    if (anim_frame > anim_frames) {
        animating = undefined;
        anim_frame = 0;
    }

    ctx.fillStyle = "rgb(160, 200, 250)";
    ctx.fillRect(0, 0, xp, h);
    ctx.fillRect(xp + side, 0, xp + pannel, h);
    ctx.fillRect(0, 0, w, yp);
    ctx.fillRect(0, yp + side, w, yp);

    renderPanel();
}

function renderSquircle(x, y, w, h, rad=20) {
    ctx.beginPath()
    ctx.arc(x + rad, y + rad, rad, Math.PI, Math.PI / -2, false);
    ctx.lineTo(x + w - rad, y);
    ctx.arc(x + w - rad, y + rad, rad, Math.PI / -2, 0, false);
    ctx.lineTo(x + w, y + h - rad);
    ctx.arc(x + w - rad, y + h - rad, rad, 0, Math.PI / 2, false);
    ctx.lineTo(x + rad, y + h);
    ctx.arc(x + rad, y + h - rad, rad, Math.PI / 2, Math.PI, false);
    ctx.fill();
}

function getTime() {
    let distance = new Date().getTime() - start;

    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return text = hours + ":" + minutes + ":" + seconds + "." + ('000' + Math.round(distance % 1000)).slice(-3)
}

function renderPanel() {
    ctx.fillStyle = "#000";
    ctx.fillRect(xp + side, yp, pannel, side);

    if (action === "Scramble") {
        ctx.fillStyle = "#505050";
        renderSquircle(xp + side + 10, yp + 10, pannel - 20, 100);
    }

    let fs = 48;
    ctx.font = fs + "px sans-serif";
    ctx.fillStyle = "#fff";
    let t_size = ctx.measureText(action).width;
    ctx.fillText(action, xp + side + 10 + (pannel - 20 - t_size) / 2, yp + 10 + (100 + fs * .7) / 2);

    if (start) {
        let text = getTime()
        t_size = ctx.measureText(text).width;
        ctx.fillText(text, xp + side + 10 + (pannel - 20 - t_size) / 2, yp + 100 + (100 + fs * .7) / 2);
    }

    fs = 36;
    ctx.font = fs + "px sans-serif";
    let y = yp + 250
    for (let i = 0; i < times.length; i++) {
        t_size = ctx.measureText(times[i]).width;
        ctx.fillText(times[i], xp + side + 10 + (pannel - 20 - t_size) / 2, y);
        y += 50;

        if (y >= side - 100) break;
    }

    text = size + "x" + size + " grid"
    t_size = ctx.measureText(text).width;
    ctx.fillText(text, xp + side + 10 + (pannel - 20 - t_size) / 2, yp + side - 150 + (150 + fs * .7) / 2);

    ctx.fillStyle = "#505050";
    if (size > 2) renderSquircle(xp + side + 10, yp + side - 100, 50, 50);
    if (size < max_size) renderSquircle(xp + side + pannel - 60, yp + side - 100, 50, 50);

    ctx.fillStyle = "#fff";
    if (size > 2) {
        t_size = ctx.measureText("<").width;
        ctx.fillText("<", xp + side + 15 + t_size / 2, yp + side - 150 + (150 + fs * .7) / 2);
    }
    if (size < max_size) {
        t_size = ctx.measureText(">").width;
        ctx.fillText(">", xp + side + pannel - 55 + t_size / 2, yp + side - 150 + (150 + fs * .7) / 2);
    }
}

function doShuffle(count=20) {
    for (let i = 0; i < count; i++) {
        let a = getRandomInt(0, size - 1);
        let b = getRandomInt(0, size - 1);
        let c = (getRandomInt(0, 1) - 0.5) * 2;
        if (c === -1 && b === 0) b = 1;
        if (c === 1 && b === size - 1) b = size - 2;

        if (Math.random() > 0.5) {
            doMove(a, a, b, b + c);
        } else {
            doMove(b, b + c, a, a);
        }
    }

    action = "Solve it!";
}

function buttonClick() {
    if (action === "Scramble")
        doShuffle();
}


document.onpointerdown = function(e) {
    if (e.clientX >= xp + side + 10 && e.clientX < xp + side + pannel - 10)
        if (e.clientY >= yp + 10 && e.clientY < yp + 110)
            return buttonClick();

    if (e.clientX >= xp + side + 10 && e.clientX < xp + side + 10 + 50) {
        if (e.clientY >= yp + side - 100 && e.clientY < yp + side - 100 + 50) {
            if (size > 2) {
                size -= 1;
                makeGrid();
                or();
                action = "Scramble";
                start = 0;
                times = [];
            }
            return;
        }
    }

    if (e.clientX >= xp + side + pannel - 60 && e.clientX < xp + side + pannel - 10) {
        if (e.clientY >= yp + side - 100 && e.clientY < yp + side - 100 + 50) {
            if (size < max_size) {
                size += 1;
                makeGrid();
                or();
                action = "Scramble";
                start = 0;
                times = [];
            }
            return;
        }
    }

    //renderSquircle(xp + side + 10, yp + h - 100, 50, 50);
    //renderSquircle(xp + side + pannel - 60, yp + h - 100, 50, 50);

    if (action === "Scramble") return;

    let x = e.clientX - xp;
    let y = e.clientY - yp;
    if (!(0 <= x && x < side && 0 <= y && y < side)) return;

    dx = Math.floor(x / ts);
    dy = Math.floor(y / ts);

};

document.onpointerup = function(e) {
    dx = undefined;
    dy = undefined;
};

document.onpointermove = function(e) {
    if (dx === undefined) return;

    let x = e.clientX - xp;
    let y = e.clientY - yp;
    if (!(0 <= x && x < side && 0 <= y && y < side)) return;

    let ndx = Math.floor(x / ts);
    let ndy = Math.floor(y / ts);

    if (doMove(dx, dy, ndx, ndy)) {
        if (!start) start = new Date().getTime();
        action = "Keep going";
    }

    dx = ndx;
    dy = ndy;
};

function doMove(dx, dy, ndx, ndy) {
    if (dx === ndx && dy !== ndy) {
        grid[dx] = grid[dx].rotateRight(dy - ndy);

        animating = [dy, ndy, dx, ndx];
        anim_frame = 0;
        return true;
    } else if (dy === ndy && dx !== ndx) {
        grid = rotateCounterClockwise(grid);
        grid[size - dy - 1] = grid[size - dy - 1].rotateRight(dx - ndx);
        grid = rotateClockwise(grid);

        animating = [dy, ndy, dx, ndx];
        anim_frame = 0;
        return true;
    } else if (dy !== ndy && dx !== ndx) {
        grid = rotateCounterClockwise(grid);
        grid[size - dy - 1] = grid[size - dy - 1].rotateRight(dx - ndx);
        grid = rotateClockwise(grid);

        grid[ndx] = grid[ndx].rotateRight(dy - ndy);

        animating = [dy, dy, dx, ndx];
        anim_frame = 0;
        return true;
    }

    return false;
}

function anim () {
    render();

    if (action === "Keep going") {
        let yes = true;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (grid[x][y] != t_grid[x][y]) yes = false;
            }
        }
        if (yes) {
            action = "Scramble";
            times.unshift(getTime());
            start = 0;
        }
    }

    window.requestAnimFrame(anim);
}

window.onload = function () {
    ctx = document.getElementById("game").getContext("2d");
    makeGrid();
    or();

    window.requestAnimFrame(anim);
}

function or () {
    document.getElementById("game").width = window.innerWidth;
    document.getElementById("game").height = window.innerHeight;

    w = window.innerWidth;
    h = window.innerHeight;
    side = Math.min(window.innerWidth - pannel, window.innerHeight);
    ts = Math.floor(side / size);
    side = ts * size;
    xp = (window.innerWidth - side - pannel) / 2;
    yp = (window.innerHeight - side) / 2;

}

window.onresize = or;
