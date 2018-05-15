function Floor(width, height) {
    let floorGeometry = new THREE.PlaneGeometry(width, height);
    
    let floorMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./resources/texture_floor.jpg'),
        side: THREE.DoubleSide
    });

    floorMaterial.map.wrapS = THREE.RepeatWrapping;
    floorMaterial.map.wrapT = THREE.RepeatWrapping;
    floorMaterial.map.repeat.set(width, height);

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    return floor;
}