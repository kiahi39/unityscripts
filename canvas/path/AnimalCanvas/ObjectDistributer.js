

class ObjectDistributer {
    constructor(option) {
        this.canvas = option.canvas;
        // this.ctx = option.ctx;
        this.cw = option.cw;
        this.org = option.org;
        this.objects = [];
        this.debugMode = false;
        option.objects = this.objects;
        this.collisionManager = new CollisionManager(option);
        this.drawManager = new DrawManager(option);

        console.log("objDist-debug", );
    }

    submitObject(object) {
        this.objects.push(object);
    }
    update() {
        this.objects.forEach( (object) => {
            object.update();
        } );
    }
    onMouseMove(input) {
        // this.drawManager.camera.position = input.mousePosition;
    }
    onMouseHoldDown(input) {
        // this.canvas.style.background = 'black';
        this.drawManager.onMouseHoldDown(input);
    }
    
}