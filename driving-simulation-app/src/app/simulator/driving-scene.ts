import Phaser from "phaser";

export class DrivingScene extends Phaser.Scene {
  private roadLines!: Phaser.GameObjects.Group;
  private vehicle!: Phaser.GameObjects.Rectangle;
  private speedText!: Phaser.GameObjects.Text;
  private currentSpeed: number = 0;

  constructor() {
    super({ key: "DrivingScene" });
  }

  create() {
    // 1. Background and Road
    this.add.rectangle(400, 300, 800, 600, 0x1a1a1a); // Dark background
    this.add.rectangle(400, 300, 400, 600, 0x333333);  // Gray road

    // 2. Scrolling Road Lines
    this.roadLines = this.add.group();
    for (let i = 0; i < 10; i++) {
      const line = this.add.rectangle(400, i * 80 - 100, 10, 40, 0xffffff);
      this.roadLines.add(line);
    }

    // 3. Vehicle (Simple red rectangle for V1)
    this.vehicle = this.add.rectangle(400, 450, 40, 80, 0xef4444); // Red car

    // 4. Telemetry Text
    this.speedText = this.add.text(20, 20, "Speed: 0 km/h", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "monospace",
    });
  }

  update() {
    // Scroll road lines based on speed
    const visualSpeed = this.currentSpeed * 2; 
    this.roadLines.getChildren().forEach((line: any) => {
      line.y += visualSpeed;
      if (line.y > 650) {
        line.y -= 800; // Reset to top
      }
    });

    // Update text
    this.speedText.setText(`Speed: ${this.currentSpeed} km/h`);
  }

  // --- Methods exposed to React ---
  
  public setSpeed(speed: number) {
    this.currentSpeed = Math.max(0, speed);
  }

  public triggerCollision() {
    // Visual feedback for a test collision event
    this.cameras.main.flash(500, 255, 0, 0, false);
    this.cameras.main.shake(500, 0.01);
  }
}