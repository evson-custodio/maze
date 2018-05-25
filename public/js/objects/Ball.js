function Ball(radius, renderer) {
    let ballGeometry = new THREE.SphereGeometry(radius, 32, 32);
    let ballMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./resources/texture_ball.png'),
        side: THREE.DoubleSide
    });

    let ball = new THREE.Mesh(ballGeometry, ballMaterial);

    let aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(20, aspect, 1, 2000);
    let orbit = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.set(ball.position.x - 1, ball.position.y + 1, ball.position.z);
    camera.lookAt(ball.position);

    orbit.enablePan = false;
    orbit.enableKeys = false;
    orbit.minDistance = 1.5;
    orbit.maxDistance = 4;
    orbit.minPolarAngle = Math.PI / 6;
    orbit.maxPolarAngle = Math.PI / 2;

    ball.radius = radius;
    ball.renderer = renderer;
    ball.camera = camera;
    ball.orbit = orbit;
    ball.direction = 0;
    ball.rotationVertices = {
        x: new THREE.Vector3(1, 0, 0),
        y: new THREE.Vector3(0, 1, 0),
        z: new THREE.Vector3(0, 0, 1)
    };

    ball.add(camera);

    ball.translateZ(radius);

    let quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(ball.rotationVertices.x, Math.PI / 2);

    let quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(ball.rotationVertices.y, Math.PI / 2);

    let quaternionZ = new THREE.Quaternion();
    quaternionZ.setFromAxisAngle(ball.rotationVertices.z, Math.PI / 2);

    ball.applyQuaternion(quaternionX);
    ball.applyQuaternion(quaternionZ);

    ball.updateCamera = () => {
        let aspect = window.innerWidth / window.innerHeight;

        ball.camera.aspect = aspect;
        ball.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return ball;
}