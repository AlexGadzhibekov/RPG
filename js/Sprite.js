class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; 
    if (this.useShadow) {
      this.shadow.src = "images/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down" : [ [4,4] ],
      "idle-right": [ [4,6] ],
      "idle-up"   : [ [4,7] ],
      "idle-left" : [ [4,5] ],
      "walk-down" : [ [3,4],[4,4],[5,4],[4,4], ],
      "walk-right": [ [3,6],[4,6],[5,6],[4,6], ],
      "walk-up"   : [ [3,7],[4,7],[5,7],[4,7], ],
      "walk-left" : [ [3,5],[4,5],[5,5],[4,5], ]
    }
    this.currentAnimation = "idle-right"; 
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(30) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(15) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);


    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 48, frameY * 48,
      48,48,
      x,y,
      70,70
    )

    this.updateAnimationProgress();
  }

}