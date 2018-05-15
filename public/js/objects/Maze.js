function Maze(matrix, camera) {
    let maze = new THREE.Object3D();

    maze.width = 0;
    maze.height = 0;
    maze.mat = copyMatrix(matrix);
    maze.camera = camera;

    matrixWidthHeight();

    maze.floor = Floor(maze.width, maze.height);
    maze.floor.rotateX(Math.PI / 2);
    maze.character = Ball(0.25);
    maze.walls = [];

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
        let mat =copyMatrix(maze.mat);
        for (h = 0; h < mat.length; h++) {
            for (w = 0; w < mat[h].length; w++) {
                if (mat[h][w]) {
                    let biggestW = 0;
                    let biggestH = 0;
                    let wall = null;

                    for (let i = w; i < mat[h].length && mat[h][i]; biggestW++, i++);

                    for (let j = h; j < mat.length && w < mat[j].length && mat[j][w]; biggestH++, j++);

                    if (biggestW >= biggestH) {
                        for (let i = w; i < (w + biggestW); mat[h][i] = 0, i++);

                        wall = Wall(biggestW, 2, 1);
                        wall.position.set(w + (biggestW / 2) - (maze.width / 2), 1, h + (1 / 2) - (maze.height / 2));

                        w += (biggestW - 1);
                    }
                    else {
                        for (let j = h; j < (h + biggestH); mat[j][w] = 0, j++);

                        wall = Wall(biggestH, 2, 1);
                        wall.position.set(w + (1 / 2) - (maze.width / 2), 1, h + (biggestH / 2) - (maze.height / 2));

                        wall.rotateY(Math.PI / 2);
                    }

                    maze.walls.push(wall);
                }
            }
        }
    }

    function setPositionCharacter(x, z) {
        maze.character.position.x = x + (1 / 2) - (maze.width / 2);
        maze.character.position.z = z + (1 / 2) - (maze.height / 2);

        if (maze.camera) {
            maze.camera.position.x = x + (1 / 2) - (maze.width / 2);
            maze.camera.position.z = z - (maze.height / 2);
            maze.camera.lookAt(new THREE.Vector3(maze.camera.position.x, maze.camera.position.y, maze.camera.position.z - 1));
        }
    }

    function setInitialPositionCharacter() {
        let i = 0;
        let j = 0;

        while(matrix[j][i]) {
            i = Math.floor(Math.random() * maze.width);
            j = Math.floor(Math.random() * maze.height);
        }

        maze.character.rotateY(Math.PI / 2);
        maze.character.direction = 0;
        maze.character.x = i;
        maze.character.z = j;
        maze.character.elevation = 0.75; // Radius 0.5 - 0.5 Radius 0.25 - 0.75
        maze.character.back = 1.25; // Radius 0.5 - 1 Radius 0.25 - 1.25
        maze.character.focus = 1.25; // Radius 0.5 - 1 Radius 0.25 - 1.25
        maze.character.focusElevation = 0; // 0
        maze.character.position.set(i + (1 / 2) - (maze.width / 2), maze.character.radius, j + (1 / 2) - (maze.height / 2));
        setCamera();
    }

    function setCamera() {
        if (maze.character.direction == 0) {
            maze.camera.position.set(maze.character.position.x, maze.character.position.y + maze.character.elevation, maze.character.position.z + maze.character.back);
            maze.camera.lookAt(new THREE.Vector3(maze.character.position.x, maze.character.position.y + maze.character.focusElevation, maze.character.position.z - maze.character.focus));
        }
        else if (maze.character.direction == 1) {
            maze.camera.position.set(maze.character.position.x - maze.character.back, maze.character.position.y + maze.character.elevation, maze.character.position.z);
            maze.camera.lookAt(new THREE.Vector3(maze.character.position.x + maze.character.focus, maze.character.position.y + maze.character.focusElevation, maze.character.position.z));
        }
        else if (maze.character.direction == 2) {
            maze.camera.position.set(maze.character.position.x, maze.character.position.y + maze.character.elevation, maze.character.position.z - maze.character.back);
            maze.camera.lookAt(new THREE.Vector3(maze.character.position.x, maze.character.position.y + maze.character.focusElevation, maze.character.position.z + maze.character.focus));
        }
        else if (maze.character.direction == 3) {
            maze.camera.position.set(maze.character.position.x + maze.character.back, maze.character.position.y + maze.character.elevation, maze.character.position.z);
            maze.camera.lookAt(new THREE.Vector3(maze.character.position.x - maze.character.focus, maze.character.position.y + maze.character.focusElevation, maze.character.position.z));
        }
    }

    maze.keyDownHolder = (event) => {
        if (!maze.isAnimation) {
            switch (event.key) {
                case 'ArrowUp':
                if (maze.character.direction == 0 && !matrix[maze.character.z - 1][maze.character.x]) {
                    maze.character.z--;
                    maze.character.translateX(1);
                    setCamera();
                }
                else if (maze.character.direction == 1 && !matrix[maze.character.z][maze.character.x + 1]) {
                    maze.character.x++;
                    maze.character.translateX(1);
                    setCamera();
                }
                else if (maze.character.direction == 2 && !matrix[maze.character.z + 1][maze.character.x]) {
                    maze.character.z++;
                    maze.character.translateX(1);
                    setCamera();
                }
                else if (maze.character.direction == 3 && !matrix[maze.character.z][maze.character.x - 1]) {
                    maze.character.x--;
                    maze.character.translateX(1);
                    setCamera();
                }
                break;
                case 'ArrowLeft':
                maze.character.rotateY(Math.PI / 2);
                maze.character.direction = (!maze.character.direction) ? 3 : maze.character.direction - 1;
                setCamera();
                break;
                case 'ArrowRight':
                maze.character.rotateY(-Math.PI / 2);
                maze.character.direction++;
                maze.character.direction = (maze.character.direction % 4);
                setCamera();
                break;
                case 'ArrowDown':
                maze.character.rotateY(Math.PI);
                maze.character.direction += 2;
                maze.character.direction = (maze.character.direction % 4);
                setCamera();
                break;
            }
        }
    }

    setInitialPositionCharacter();
    matrixToWall();

    maze.add(maze.floor);
    maze.add(maze.character);
    maze.walls.forEach(wall => maze.add(wall));

    return maze;
}