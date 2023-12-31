class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(30) - cameraPerson.x, 
      utils.withGrid(15) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(30) - cameraPerson.x, 
      utils.withGrid(15) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "images/startLocation.jpg",
    upperSrc: "...",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(14.5),
        y: utils.withGrid(32),
      }),
      npcA: new Person({
        x: utils.withGrid(14.5),
        y: utils.withGrid(20),
        src: "images/actor2.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Welcome to our market", faceHero: "npcA" },
              { type: "textMessage", text: "U can go and buy somthing!"},
              { who: "hero", type: "walk",  direction: "left" },
              { who: "hero", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(10),
        src: "images/actor2.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "U can buy all what u wont,ofc if u have money", faceHero: "npcB" },
              { who: "hero", type: "walk",  direction: "down" },
            ]
          }
        ]
      }),
      npcC: new Person({
        x: utils.withGrid(35),
        y: utils.withGrid(10),
        src: "images/actor2.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "U cant go here", faceHero: "npcC" },
              { who: "hero", type: "walk",  direction: "left" },
              { who: "hero", type: "walk",  direction: "left" },
            ]
          }
        ]
      }),
    },
    walls: {
      [utils.asGridCoord(14.5,15)] : true,
      [utils.asGridCoord(14,15)] : true,
      [utils.asGridCoord(15,15)] : true,
      [utils.asGridCoord(16,15)] : true,
      [utils.asGridCoord(13.5,15)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(14.5,14)]: [
        {
          events: [
            { who: "npcb", type: "walk",  direction: "right" },
            { who: "npcb", type: "walk",  direction: "down" },
            { who: "npcb", type: "stand",  direction: "down", time: 500 },
            { type: "textMessage", text:"What do u want?"},
          ]
        }
      ],
      [utils.asGridCoord(14.5,33)]: [
        {
          events: [
            { type: "changeMap", map: "Village" }
          ]
        }
      ]
    }
    
  },
  Village: {
    lowerSrc: "images/village.jpg",
    upperSrc: "...",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(10),
      }),
      npcB: new Person({
        x: utils.withGrid(20),
        y: utils.withGrid(20),
        src: "images/actor2.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Where i am and who are u?", faceHero:"npcB" },
              { type: "textMessage", text: "Welcome to Stray! Im villager!", faceHero:"npcB" },
            ]
          }
        ]
      })
    },
    cutsceneSpaces:{
      [utils.asGridCoord(10,9)]: [
        {
          events: [
            { type: "changeMap", map: "DemoRoom" }
          ]
        }
      ]
    }
  },
}