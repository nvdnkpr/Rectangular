angular.module("Calvin")
.service("CalvinStats", function () {

  var explosion1 = {
    skin: {
      src: 'img/sprites/explosion1.png',
      bg: 'spritesheet',
      framerate: 90,
      frames: {
        width: 123,
        height: 120,
        regX: 65,
        regY: 95,

      },
      frameWidth: 150,
      frameHeight: 150,
      animations: {
        explode: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          speed: 0.4,
          next: 'hide'
        },
        hide: [21]
      }
    },
  };

  var explosion1Big = {
    skin: {
      src: 'img/sprites/explosion1.png',
      bg: 'spritesheet',
      framerate: 90,
      frames: {
        width: 123,
        height: 120,
        regX: 65,
        regY: 95,

      },
      frameWidth: 50,
      frameHeight: 50,
      animations: {
        explode: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          speed: 0.4,
          next: 'hide'
        },
        hide: [21]
      }
    },
  };

  var explosion2 = {
    skin: {
      src: 'img/sprites/explosion2.png',
      bg: 'spritesheet',
      framerate: 90,
      frames: {
        width: 283,
        height: 312,
        regX: 142,
        regY: 156,

      },
      frameWidth: 280,
      frameHeight: 280,
      animations: {
        explode: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          speed: 0.4,
          next: 'hide'
        },
        hide: [21]
      }
    },
  }
  this.stats = {
    lateralSpeed: 60,
    lateralSpeedJumping: 45,
    jumpCooldown: 25,
    jumpForce: 1700,
    doubleJumpForce: 0,
    airborneGrace: 3,
    groundSmashPower: 1000,
    dashInputTimeout: 5,
    dashCooldown: 40,
    dashForce: 500,
    maxSpeed: 30,
    dashForceAir: 250,
    flinchForceX: 1500,
    flinchForceY: -100,
    invincibilityTime: 30,
    brakeSpeed: 0.5,
    hp: 55,
    defense: 5,
    muscle: 1000,
    attack: 10,
    evade: 0,
    canShoot: false,
    canSprint: false,
    attacks: {
      punch1: {
        id: 'punch1',
        name: 'Punch of Meaning',
        animation: 'punch1',
        damage: 10,
        range: 4,
        stunnedTime: 15,
        duration: 25,
        knockback: 10,
        propel: 0.2,
        superTime: 40,
        canComboTime: 50,
        effect: explosion2,
        nextPunch1: "punch2",
        nextPunch2: "punch1Super",
        nextKick1: "kick1",
        nextKick2: "kick1Super",
      },
      punch1Super: {
        id: 'punch1Super',
        name: 'Punch of Intergrity',
        animation: 'punch1',
        damage: 30,
        range: 5,
        stunnedTime: 20,
        propel: 2,
        duration: 25,
        knockback: 30,
        superTime: 0,
        canComboTime: 0,
        effect: explosion1Big,
      },
      punch2: {
        id: 'punch2',
        name: 'Punch of Honesty',
        animation: 'punch2',
        damage: 15,
        stunnedTime: 10,
        duration: 16,
        knockback: 10,
        range: 4,
        propel: 0.2,
        superTime: 40,
        canComboTime: 50,
        effect: explosion2,
        nextPunch1: "punch1",
        nextPunch2: "punch1Super",
        nextKick1: "kick1",
        nextKick2: "kick1Super",
      },
      kick1: {
        id: 'kick1',
        name: 'Kick of Truth',
        animation: 'kick1',
        damage: 15,
        stunnedTime: 15,
        duration: 18,
        knockback: 15,
        range: 6,
        propel: 0.3,
        superTime: 40,
        canComboTime: 50,
        effect: explosion1,
        nextPunch1: "punch2",
        nextPunch2: "punch1Super",
        nextKick1: "kick2",
        nextKick2: "kick1Super",
      },
      kick1Super: {
        id: 'kick1Super',
        animation:'kick1',
        name: 'Kick of Riches',
        animation: 'kick1',
        damage: 50,
        range: 5,
        propel: 5,
        stunnedTime: 25,
        duration: 18,
        knockback: 30,
        superTime: 0,
        canComboTime: 0,
        effect: explosion1Big,

      },
      kick2: {
        id: 'kick2',
        name: 'Kick of Friendship',
        animation: 'kick2',
        damage: 20,
        range: 5.5,
        knockback: 15,
        stunnedTime: 6,
        duration: 18,
        effect: explosion1,
        superTime: 40,
        canComboTime: 50,
        nextPunch1: "punch1",
        nextPunch2: "punch1Super",
        nextKick1: "kick1",
        nextKick2: "kick1Super",
      }
    }
  }

  this.state = {
    goingLeft: false,
    goingRight: false,
    facingRight: true,
    facingLeft: false,
    isJumping: false,
    airBorne: false,
    jumpWait: 0,
    isAttacking: false,
    canAttack: true,
    currentAttack: null,
    airborneGraceTime: 0,
    canAct: true,
    usedGroundSmash: false,
    dashInputTimeRight: 0,
    dashInputTimeLeft: 0,
    dashCurrentCooldown: 0,
    dashReadyRight: false,
    dashReadyLeft: false,
    idling: false,
    health: 0,
    invincible: false,
    invincibleTimeout: 0,
    stats: this.stats,
  }

  this.defaults = {
    name: 'Calvin',
    shape: 'box',
    profile: 'Calvin',
    skin: {
      src: 'img/sprites/calvin/calvin.png',
      bg: 'spritesheet',
      framerate: 90,
      frames: {
        width: 238.5,
        height: 223.5,
        regX: 120,
        regY: 145,

      },
      frameWidth: 90,
      frameHeight: 160,
      animations: {
        run: [0, 15],
        stand: [16, 45],
        jump: [46, 75, "fly"],
        fly: [75],
        duck: [76, 165],
        hurt: [166],
        punch1: [167, 180, "stand"],
        kick1: [176, 185, "stand"],
        kick2: [180, 187, "stand"],
        punch2: [188, 193, 192, 191, "stand"],
      }
    },
    controls: 'platform-hero',
    userData: {
      doodad: true,
    },
    presets: {
      height: 2,
      width: 1.24,
      restitution: 0.1,
      density: 0.07,
      friction: 0.2,
      gravityScale: 0.4
    }

  };
})
