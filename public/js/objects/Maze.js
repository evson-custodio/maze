function Maze(matrix, renderer) {
    let maze = new THREE.Object3D();

    maze.width = 0;
    maze.height = 0;
    maze.mat = copyMatrix(matrix);

    matrixWidthHeight();

    maze.floor = Floor(maze.width, maze.height);
    maze.character = Ball(0.25, renderer);
    maze.walls = [];
    maze.renderer = renderer;
    maze.camera = new THREE.OrthographicCamera(-maze.height * aspect / 2, maze.height * aspect / 2, maze.height / 2, -maze.height / 2, 1, 2000);
    maze.camera.position.z = 10;

    maze.isAnimation = false;
    maze.animation = () => {};

    function copyMatrix(mat) {
        let m = [];

        for (let i = 0; i < mat.length; i++) {
            m.push(mat[i].slice(0));
        }

        return m;
    }

    function matrixWidthHeight() {
        maze.height = matrix.length;

        for (let i = 0; i < maze.height; i++) {
            if (matrix[i].length > maze.width) {
                maze.width = matrix[i].length;
            }
        }
    }

    function matrixToWall() {
        let mat = copyMatrix(maze.mat);

        for (h = 0; h < mat.length; h++) {
            for (w = 0; w < mat[h].length; w++) {
                if (mat[h][w]) {
                    let biggestW = 0;
                    let biggestH = 0;
                    let wall = null;

                    for (let i = h; i < mat.length && w < mat[i].length && mat[i][w]; biggestH++, i++);

                    for (let j = w; j < mat[h].length && mat[h][j]; biggestW++, j++);

                    if (biggestW >= biggestH) {
                        for (let j = w; j < (w + biggestW); mat[h][j] = 0, j++);

                        wall = Wall(biggestW, 2, 1);
                        wall.position.set(w - (maze.width / 2) + (biggestW / 2), -h + (maze.height / 2)  - (1 / 2), 1.001);

                        w += (biggestW - 1);
                    }
                    else {
                        for (let i = h; i < (h + biggestH); mat[i][w] = 0, i++);

                        wall = Wall(biggestH, 2, 1);
                        wall.position.set(w - (maze.width / 2) + (1 / 2), -h + (maze.height / 2) - (biggestH / 2), 1.001);

                        wall.rotateZ(Math.PI / 2);
                    }

                    maze.walls.push(wall);
                }
            }
        }
    }

    function setInitialPositionCharacter() {
        let i = 0;
        let j = 0;

        while(matrix[i][j]) {
            i = Math.floor(Math.random() * maze.height);
            j = Math.floor(Math.random() * maze.width);
        }

        maze.character.direction = 0;
        maze.character.y = i;
        maze.character.x = j;
        // maze.character.elevation = 0.75; // Radius 0.5 - 0.5 Radius 0.25 - 0.75
        // maze.character.back = 1.25; // Radius 0.5 - 1 Radius 0.25 - 1.25
        // maze.character.focus = 1.25; // Radius 0.5 - 1 Radius 0.25 - 1.25
        // maze.character.focusElevation = 0; // 0
        maze.character.position.set(-(maze.width / 2) + j + (1 / 2), (maze.height / 2) - i - (1 / 2), maze.character.radius + 0.001);
    }

    maze.keyDownHolder = (event) => {
        if (!maze.isAnimation && (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'ArrowLeft')) {
            maze.isAnimation = true;
            let frames = 30;

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                let distance = (event.key === 'ArrowUp') ? 1 : -1;
                let partialDistance = distance / frames;

                let colision = false;
                let angle = Math.PI;
                let partialAngle = angle / frames;
                let currentAngle = partialAngle;

                if (maze.character.direction == 0 && !maze.mat[maze.character.y - distance][maze.character.x]) {
                    maze.character.y -= distance;
                }
                else if (maze.character.direction == 1 && !maze.mat[maze.character.y][maze.character.x + distance]) {
                    maze.character.x += distance;
                }
                else if (maze.character.direction == 2 && !maze.mat[maze.character.y + distance][maze.character.x]) {
                    maze.character.y += distance;
                }
                else if (maze.character.direction == 3 && !maze.mat[maze.character.y][maze.character.x - distance]) {
                    maze.character.x -= distance;
                }
                else {
                    colision = true;
                    maze.isAnimation = false;
                }

                if (!colision) {
                    maze.animation = () => {
                        if (frames > 0) {
                            maze.character.translateX(partialDistance);
                            maze.character.translateY(Math.sin(currentAngle) - Math.sin(currentAngle - partialAngle));
                            currentAngle += partialAngle;
                        }
                        else if (frames == 0) {
                            maze.isAnimation = false;
                        }
    
                        frames--;
                    }
                }
            }
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                let rotationAxis = maze.character.rotationVertices.z;
                let angle = Math.PI / 2;

                if (event.key === 'ArrowRight') {
                    angle = -angle;
                    maze.character.direction++;
                    maze.character.direction = (maze.character.direction % 4);
                }
                else {
                    maze.character.direction = (!maze.character.direction) ? 3 : maze.character.direction - 1;
                }

                let partialAngle = angle / frames;

                let quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(rotationAxis, angle);

                let quaternionPartial = new THREE.Quaternion();
                quaternionPartial.setFromAxisAngle(rotationAxis, partialAngle);

                maze.animation = () => {
                    if (frames > 0) {
                        maze.character.applyQuaternion(quaternionPartial);
                    }
                    else if (frames == 0) {
                        maze.isAnimation = false;
                    }

                    frames--;
                }
            }
        }
    }

    maze.updateCamera = () => {
        let aspect = window.innerWidth / window.innerHeight;

        maze.camera.left = -maze.height * aspect / 2;
        maze.camera.right = maze.height * aspect / 2;
        maze.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setInitialPositionCharacter();
    matrixToWall();

    maze.add(maze.floor);
    maze.add(maze.character);
    maze.walls.forEach(wall => maze.add(wall));

    return maze;
}