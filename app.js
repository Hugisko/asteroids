const ship = document.querySelector('.ship');
const boost = document.querySelector('.boost');

const maxShipSpeed = 10;
let shipSpeed = 0.4;
let rotationSpeed = 5;
let angle = 0;
let targetAngle = angle;
let velocityX = 0;
let velocityY = 0;

const shootDelay = 500;
let bulletSpeed = 5;
let bullets = [];
let lastShotTime = 0;

const sizeAsteroid = 50;
let asteroidSpeed = 1;
let asteroids = [];

let keys = {};

function createAsteroid(x, y, size) {
    let asteroidElement = document.createElement('div');
    asteroidElement.classList.add('asteroid');
    asteroidElement.style.width = size + 'px';
    asteroidElement.style.height = size + 'px';
    document.body.appendChild(asteroidElement);
    let asteroidAngle = Math.random() * 360;
    let asteroidVelocityX = asteroidSpeed * Math.sin(asteroidAngle * Math.PI / 180);
    let asteroidVelocityY = asteroidSpeed * -Math.cos(asteroidAngle * Math.PI / 180);
    asteroids.push({
        element: asteroidElement,
        x: x,
        y: y,
        size: size,
        velocityX: asteroidVelocityX,
        velocityY: asteroidVelocityY
    });
}

function updateAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];
        asteroid.x += asteroid.velocityX;
        asteroid.y += asteroid.velocityY;
        asteroid.element.style.left = (asteroid.x - asteroid.size / 2) + 'px';
        asteroid.element.style.top = (asteroid.y - asteroid.size / 2) + 'px';
        if (asteroid.x < asteroid.size / 2 || asteroid.x > window.innerWidth - asteroid.size / 2) {
            asteroid.velocityX *= -1;
        }
        if (asteroid.y < asteroid.size / 2 || asteroid.y > window.innerHeight - asteroid.size / 2) {
            asteroid.velocityY *= -1;
        }
    }
    requestAnimationFrame(updateAsteroids);
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
        bullet.element.style.left = bullet.x + 'px';
        bullet.element.style.top = bullet.y + 'px';
        if (bullet.x < 0 || bullet.x > window.innerWidth || bullet.y < 0 || bullet.y > window.innerHeight) {
            document.body.removeChild(bullet.element);
            bullets.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(updateBullets);         
}

function updateShip() {
    if (Math.abs(targetAngle - angle) > rotationSpeed) {
        angle += Math.sign(targetAngle - angle) * rotationSpeed;
        ship.style.transform = `rotate(${angle}deg)`;
    }
    let newX = ship.offsetLeft + velocityX;
    let newY = ship.offsetTop + velocityY;
    if (newX < 0 || newX > window.innerWidth - ship.offsetWidth) {
        velocityX *= -1;
    }
    if (newY < 0 || newY > window.innerHeight - ship.offsetHeight) {
        velocityY *= -1;
    }
    ship.style.left = (ship.offsetLeft + velocityX) + 'px';
    ship.style.top = (ship.offsetTop + velocityY) + 'px';
    requestAnimationFrame(updateShip);
}

function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        for (let j = 0; j < asteroids.length; j++) {
            let asteroid = asteroids[j];
            let dx = bullet.x - asteroid.x;
            let dy = bullet.y - asteroid.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.size) {
                document.body.removeChild(bullet.element);
                bullets.splice(i, 1);
                i--;
                document.body.removeChild(asteroid.element);
                asteroids.splice(j, 1);
                j--;
                if (asteroid.size > 10) {
                    createAsteroid(asteroid.x, asteroid.y, asteroid.size / 2);
                    createAsteroid(asteroid.x, asteroid.y, asteroid.size / 2);
                }
                break;
            }
        }
    }
    requestAnimationFrame(checkCollisions);
}

function handler(event) {
    if(event.type === 'keydown'){
        keys[event.code] = true;
        if (keys['ArrowUp']) {
            velocityX += shipSpeed * Math.sin(angle * Math.PI / 180);
            velocityY += shipSpeed * -Math.cos(angle * Math.PI / 180);
            if(Math.abs(velocityY) >= maxShipSpeed) {
                velocityY = velocityY > 0 ? maxShipSpeed : (-1 * maxShipSpeed);
            }
            if(Math.abs(velocityX) >= maxShipSpeed) {
                velocityX = velocityX > 0 ? maxShipSpeed : (-1 * maxShipSpeed);
            }
            boost.classList.add('animate');
        }
        if (keys['ArrowLeft']) {
            targetAngle -= rotationSpeed;
        }
        if (keys['ArrowRight']) {
            targetAngle += rotationSpeed;
        } 
        if (keys['Space']) {
            let currentTime = new Date().getTime();
            if (currentTime - lastShotTime > shootDelay) {
                let bulletElement = document.createElement('div');
                bulletElement.classList.add('bullet');
                document.body.appendChild(bulletElement);
                let bulletX = ship.offsetLeft + ship.offsetWidth / 2.5 + (ship.offsetHeight / 2) * Math.sin(angle * Math.PI / 180);
                let bulletY = ship.offsetTop + ship.offsetHeight / 2.5 - (ship.offsetHeight / 2) * Math.cos(angle * Math.PI / 180);
                let bulletVelocityX = bulletSpeed * Math.sin(angle * Math.PI / 180);
                let bulletVelocityY = bulletSpeed * -Math.cos(angle * Math.PI / 180);
                bullets.push({
                    element: bulletElement,
                    x: bulletX,
                    y: bulletY,
                    velocityX: bulletVelocityX,
                    velocityY: bulletVelocityY
                });
                lastShotTime = currentTime;
            }
        }
    } else if (event.type === 'keyup') {
        if (keys['ArrowUp']) {
            boost.classList.remove('animate');
        }
        keys[event.code] = false;   
    }  
}

function gameLoop() {
    let x = Math.random() * window.innerWidth + 50;
    let y = Math.random() * window.innerHeight + 50;
    createAsteroid(x, y, sizeAsteroid);
    updateShip();
    updateBullets();
    updateAsteroids();
    checkCollisions();
}

document.addEventListener('keydown', handler);
document.addEventListener('keyup', handler);

setInterval(() => {
    let x = Math.random() * window.innerWidth + 50;
    let y = Math.random() * window.innerHeight + 50;
    createAsteroid(x, y, sizeAsteroid);
}, 10000);

gameLoop();