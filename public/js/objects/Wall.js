function Wall(width, height, depth) {
    let wallGeometry = new THREE.BoxGeometry(width, depth, height);

    let wallMaterials = [
        // Right 0
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall_inverse.jpg'),
            side: THREE.DoubleSide
        }),
        // Left 1
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall_inverse.jpg'),
            side: THREE.DoubleSide
        }),
        // Top 2
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall.jpg'),
            side: THREE.DoubleSide
        }),
        // Bot 3
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall.jpg'),
            side: THREE.DoubleSide
        }),
        // Front 4
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall.jpg'),
            side: THREE.DoubleSide
        }),
        // Back 5
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./resources/texture_wall.jpg'),
            side: THREE.DoubleSide
        }),
    ];

    // RepeatWrapping
    // MirroredRepeatWrapping
    wallMaterials[0].map.wrapS = THREE.RepeatWrapping;
    wallMaterials[0].map.wrapT = THREE.MirroredRepeatWrapping;
    wallMaterials[0].map.repeat.set(height, depth);

    wallMaterials[1].map.wrapS = THREE.RepeatWrapping;
    wallMaterials[1].map.wrapT = THREE.MirroredRepeatWrapping;
    wallMaterials[1].map.repeat.set(height, depth);

    wallMaterials[2].map.wrapS = THREE.MirroredRepeatWrapping;
    wallMaterials[2].map.wrapT = THREE.RepeatWrapping;
    wallMaterials[2].map.repeat.set(width, height);

    wallMaterials[3].map.wrapS = THREE.MirroredRepeatWrapping;
    wallMaterials[3].map.wrapT = THREE.RepeatWrapping;
    wallMaterials[3].map.repeat.set(width, height);

    wallMaterials[4].map.wrapS = THREE.MirroredRepeatWrapping;
    wallMaterials[4].map.wrapT = THREE.RepeatWrapping;
    wallMaterials[4].map.repeat.set(width, depth);

    wallMaterials[5].map.wrapS = THREE.MirroredRepeatWrapping;
    wallMaterials[5].map.wrapT = THREE.RepeatWrapping;
    wallMaterials[5].map.repeat.set(width, depth);

    let wall = new THREE.Mesh(wallGeometry, wallMaterials);

    return wall;
}