window.addEventListener('load', () => {

    let canvas = document.getElementById('canvas');
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    let ctx = canvas.getContext('2d');
    
    const canvasAndXYRate = 250;
    let cw = canvas.width / canvasAndXYRate;
    let org = {x: 100, y: 100};

    //クラスインスタンス生成など
    const objectDistributer = new ObjectDistributer( {canvas: canvas, ctx: ctx, cw: cw, org: org} );
    const inputManager = new InputManager( {canvas: canvas, ctx: ctx, cw: cw, org: org} );
    inputManager.submitReceiver( objectDistributer );

    const animalFactory = new AnimalFactory({distributer: objectDistributer});

    for (let i=0; i<20; i++) {
        animalFactory.make({
            identifiedName: utl.randomStringLikeSynbolID(),
            position: {x: (Math.random()-0.5)*canvasAndXYRate, y: (Math.random()-0.5)*canvasAndXYRate},
            creatureType: 'herbivore',
            radius: 6,
        });
    }

    let alphaPlants = [];
    for (let i=0; i<400; i++) {
        alphaPlants[i] = new Animal({
            position: {x: (Math.random()-0.5)*canvasAndXYRate * 2, y: (Math.random()-0.5)*canvasAndXYRate * 2},
            radius: 4,
            creatureType: 'plant',
        });
        objectDistributer.submitObject(alphaPlants[i]);
    }

    for (let i=0; i<3; i++) {
        animalFactory.make({
            identifiedName: utl.randomStringLikeSynbolID(),
            position: {x: (Math.random()-0.5)*canvasAndXYRate, y: (Math.random()-0.5)*canvasAndXYRate},
            radius: 15,
            creatureType: 'carnivore',
        });
        objectDistributer.submitObject(alphaPlants[i]);
    }
    

    // FrameLoop
    const fps = 60;

    let targetInterval = 1000 / fps;
    let previousTime = Date.now() - targetInterval;

    function loop() {
        let currentTime = Date.now();
        if (currentTime - previousTime > targetInterval) {
            update();
            previousTime = Date.now();
        }
        requestAnimationFrame(loop);
    }

    function update() {
        objectDistributer.collisionManager.check();
        animalFactory.update();
        inputManager.update();
        objectDistributer.update();
        objectDistributer.drawManager.draw();

    }

    loop();

    

    resizeCanvas();
    window.onresize = resizeCanvas;

    function resizeCanvas() {
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    };

})
