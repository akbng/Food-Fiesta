/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const scene = require("Scene");
const patch = require("Patches");

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require("Diagnostics");

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function () {
  // Enables async/await in JS [part 1]

  const name = await patch.outputs.getString("textvalue");
  const score = await scene.root.findFirst(name.pinLastValue());
  const finalScore = await scene.root.findFirst("FinalScore");
  //todo increase the speed with some logic
  const defaultSpeed = 1.8;
  await patch.inputs.setScalar("speed", defaultSpeed);

  patch.outputs.getScalar("Score").then((e) => {
    e.monitor().subscribe(async (ea) => {
      const num = ea.newValue;
      const newScore = parseInt(num);
      const newSpeed = Math.max(1, defaultSpeed - newScore * 0.05);
      await patch.inputs.setScalar("speed", newSpeed);
      score.text = num.toString();
      finalScore.text = num.toString();
    });
  });

  patch.outputs.getBoolean("gameover").then((e) => {
    e.monitor().subscribe(async (ea) => {
      if (ea.newValue == true) {
        score.text = "0";
        await patch.inputs.setBoolean("over", true);
      }
    });
  });

  // To access scene objects
  // const [directionalLight] = await Promise.all([
  //   Scene.root.findFirst('directionalLight0')
  // ]);

  // To access class properties
  // const directionalLightIntensity = directionalLight.intensity;

  // To log messages to the console
  // Diagnostics.log('Console message logged from the script.');
})(); // Enables async/await in JS [part 2]
