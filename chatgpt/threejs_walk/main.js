var camera, scene, renderer;
var world, ground, controls;
var cannonControls;
var cube, cubeBody;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0,
};
var cameraSpeed = 0.1; // 移動速度

init();
animate();

function init() {
    // シーンの作成
    scene = new THREE.Scene();

    // カメラの作成
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // カメラの位置を調整
    camera.position.set(0, 2, 5); // X, Y, Z の位置を設定

    // カメラの注視点を設定
    camera.lookAt(0, 0, 0); // カメラの注視点を原点に設定

    // 夕日のようなオレンジ色の背景色を設定
    scene.background = new THREE.Color(0xffa500); // オレンジ色

    // レンダラーの作成
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // CANNON
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // 重力を設定

    var groundShape = new CANNON.Plane();
    ground = new CANNON.Body({ mass: 0 });
    ground.addShape(groundShape);
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(ground);

    var cubeGeometry = new THREE.BoxGeometry();
    // var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 1, 0); // 高さ1の位置に設定
    scene.add(cube);

    var cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    cubeBody = new CANNON.Body({ mass: 1 });
    cubeBody.addShape(cubeShape);
    world.add(cubeBody);

    var numBuildings = 20; // 生成するビルの数

    for (var i = 0; i < numBuildings; i++) {
        var buildingWidth = Math.random() * 1.0 + 0.5; // ビルの幅（ランダムに設定）
        var buildingHeight = Math.random() * 4 + 2; // ビルの高さ（ランダムに設定）
        var buildingDepth = Math.random() * 1.0 + 0.5; // ビルの奥行き（ランダムに設定）

        var buildingGeometry = new THREE.BoxGeometry(
            buildingWidth,
            buildingHeight,
            buildingDepth
        );

        var buildingMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        });

        var building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        // ランダムな位置に配置
        building.position.set(
            Math.random() * 20 - 10, // X座標をランダムに配置
            buildingHeight / 2, // Y座標をビルの半分の高さに設定
            Math.random() * 20 - 10 // Z座標をランダムに配置
        );

        // ビルの影を受ける設定
        building.castShadow = true;
        building.receiveShadow = true;

        scene.add(building);
    }

    camera.position.z = 5;
    cannonControls = new CannonCameraController(camera, world, camera.position);

    // 地面を作成
    var groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    var groundMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

    // 地面の法線ベクトルを調整
    groundGeometry.rotateX(-Math.PI / 2); // X軸を中心に90度回転

    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    scene.add(ground);

    // アンビエントライトの設定
    var ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // シャドウマップを有効化
    renderer.shadowMap.enabled = true;

    // ディレクショナルライト（太陽光）を追加
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(100, 150, 150);
    scene.add(directionalLight);

    // ディレクショナルライト（太陽光）を追加2
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-100, 50, -150);
    scene.add(fillLight);

    // // ポイントライト（ランプのような光）を追加
    // const pointLight = new THREE.PointLight(0xff0000, 0.5, 100);
    // pointLight.position.set(0, 10, 0);
    // scene.add(pointLight);

    // // スポットライト（焦点を当てる光）を追加
    // const spotLight = new THREE.SpotLight(0x00ff00, 2, 10, Math.PI / 4, 1, 2);
    // spotLight.position.set(0, 5, 5);
    // scene.add(spotLight);

    // ライトヘルパーを使用して光源の位置を表示
    const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        1
    );
    scene.add(directionalLightHelper);
    const fillLightHelper = new THREE.DirectionalLightHelper(
        fillLight,
        1
    );
    scene.add(fillLightHelper);
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
    // scene.add(pointLightHelper);
    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);

    // ディレクショナルライトをシャドウキャスターに設定
    directionalLight.castShadow = true;
    // spotLight.castShadow = true;
    // pointLight.castShadow = true;

    // シャドウマップの設定
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // 立方体にシャドウキャスターの設定を追加
    cube.castShadow = true;

    // 地面にシャドウレシーバーの設定を追加
    ground.receiveShadow = true;
}

function animate() {
    requestAnimationFrame(animate);

    cannonControls.update();

    // Three.jsのオブジェクトをCannon.jsの位置に更新
    cube.position.copy(cubeBody.position);
    cube.quaternion.copy(cubeBody.quaternion);

    // ... 他のアニメーション処理 ...

    renderer.render(scene, camera);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}
