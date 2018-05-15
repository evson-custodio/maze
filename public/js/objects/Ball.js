function Ball(radius) {
    let ballGeometry = new THREE.SphereGeometry(radius, 32, 32);

    let ballMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./resources/texture_ball3.png')
    });

    let ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.radius = radius;

    return ball;
}