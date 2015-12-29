var camera, scene, renderer;
var meshes = [];
var meshes2 = [];
var geometry;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 150;

  scene = new THREE.Scene();

  // generateColors();

  var material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 0.5
  });

  var mesh;

  for (var i = 0; i < 50; i++) {
    geometry = new THREE.OctahedronGeometry(10, 1);
    generateColors(geometry);

    mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = Math.random() * 200 - 100;
    mesh.position.y = Math.random() * 100 - 50;
    mesh.position.z = Math.random() * 50 - 50;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    meshes.push(mesh);
  }

  meshes2 = meshes.slice(0, 1);
  // console.log(meshes2);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateColors(geometry) {
  for (var i = 0; i < geometry.faces.length; i += 2) {
    var hex = 0x222222;
    geometry.faces[i].color.setHex(hex);
    geometry.faces[i + 1].color.setHex(hex);
  }
}

var count = 0;
var switcher = true;
function updateColors() {
  switcher = !switcher;
  count++;
  if (count < 15) {
    meshes.forEach(doUpdate);
    meshes2.forEach(setWhite);
  } else if (count <= 30) {
    count = (count === 30) ? 0 : count;
    meshes2.forEach(doUpdate);
    meshes.forEach(setWhite);
  }
  var hex1, hex2;

  function doUpdate(mesh) {
    for (var i = 0; i < mesh.geometry.faces.length; i += 2) {
      var hex = Math.random() * 0xffffff / 1.25;

      if (switcher) {
        mesh.geometry.faces[i].color.setHex(hex);
      } else {
        mesh.geometry.faces[i + 1].color.setHex(hex);
      }
    }

    mesh.geometry.colorsNeedUpdate = true;
  }
}

function singleUpdate(index) {
  switcher = !switcher;
  for (var i = 0; i < meshes[index].geometry.faces.length; i += 2) {
    var hex = Math.random() * 0xffffff;
    var hex2 = Math.random() * 0xffffff;
      (meshes[index].addY) ? meshes[index].position.y += 0.25 : meshes[index].position.y -= 0.25;
      // (meshes[index].addZ) ? meshes[index].position.z += Math.random() : meshes[index].position.z -= 0.1;
      // (meshes[index].addX) ? meshes[index].position.x += 0.05 : meshes[index].position.x -= 0.05;
    // }
    // (addZ) ? meshes[index].position.z += 2 : meshes[index].position.z -= 2;
    //
    // console.log(renderer.context.drawingBufferHeight / 2, meshes[index].position.y)

    if (meshes[index].position.x >= renderer.context.drawingBufferWidth / 12) {
      meshes[index].addX = false;
    } else if (meshes[index].position.x <= 0 - (renderer.context.drawingBufferWidth / 12) ) {
      meshes[index].addX = true;
    }

    if (meshes[index].position.y >= (renderer.context.drawingBufferHeight / 14)) {
      meshes[index].addY = false;
    } else if (meshes[index].position.y <= 0 - (renderer.context.drawingBufferHeight / 14)) {
      meshes[index].addY = true;
    }

    if (meshes[index].position.z >= 20) {
      meshes[index].addZ = false;
    } else if (meshes[index].position.z <= -100) {
      meshes[index].addZ = true;
    }
    if (switcher) {
      if (meshes[index]) {
        meshes[index].geometry.faces[i].color.setHex(hex);
        meshes[index].geometry.faces[i+1].color.setHex(hex);
      }
      if (meshes[index+1]) {
        meshes[index+1].geometry.faces[i].color.setHex(hex);
      }
    } else {
      if (meshes[index]) {
        meshes[index].geometry.faces[i+1].color.setHex(hex);
      }
      if (meshes[index+1]) {
        meshes[index+1].geometry.faces[i+1].color.setHex(hex);
      }
    }

    if (meshes[index]) {
      meshes[index].geometry.colorsNeedUpdate = true;
    }

    if (meshes[index+1]) {
      meshes[index+1].geometry.colorsNeedUpdate = true;
    }
  }
}
var colorz = true;
function setWhite(index) {
  for (var i = 0; i < meshes[index].geometry.faces.length; i += 2) {
    // if (switcher) {
    //   hex1 = 0xC5E1F0
    //   hex2 = 0xB3B3B5

    // } else {
    //   hex1 = 0xB3B3B5
    //   hex2 = 0xC5E1F0
    // }

    var hexa = (colorz) ? 0x2980B9 : 0xaaaaaa;

    if (meshes[index]) {
      meshes[index].geometry.faces[i].color.setHex(hexa);
      meshes[index].geometry.faces[i+1].color.setHex(hexa);
      meshes[index].geometry.colorsNeedUpdate = true;
    }
    if (meshes[index+1]) {
      meshes[index+1].geometry.faces[i].color.setHex(hexa);
      meshes[index+1].geometry.faces[i+1].color.setHex(hexa);
      meshes[index+1].geometry.colorsNeedUpdate = true;
    }
  }
  colorz = !colorz;
}

var counter = 0;
var index = 0;
var buzz = 0;

meshes.forEach(function(mesh) {
  mesh.addX = false;
  mesh.addY = true;
  mesh.addZ = true;
})

function animate() {
  requestAnimationFrame(animate);

  if (index === meshes.length) {
      index = 0;
  }

  if (++counter % 1 === 0 && meshes[index]) {
    singleUpdate(index);
    counter = 0;
    var mod = Math.floor(Math.abs(Math.sin(buzz)) * 220);

    if (++buzz % mod === 0) {
      buzz = 0;
      setWhite(index);
      index++;
    }
  }

  // meshes.forEach(function(mesh) {
  //   // if (mesh.geometry.faces[0].color.r === 1 && mesh.geometry.faces[0].color.g === 1 && mesh.geometry.faces[0].color.b === 1) {
  //     // mesh.rotation.x -= 0.025;
  //     // mesh.rotation.y += 0.05;
  //     // mesh.rotation.z -= 0.01;
  //   // }
  // });

  // meshes.forEach(function(mesh) {
    // (addX) ? meshes[0].position.x += 2 : mesh.position.x -= 2;

    // if (mesh.geometry.faces[0].color.r === 1 && mesh.geometry.faces[0].color.g === 1 && mesh.geometry.faces[0].color.b === 1) {
      // (mesh.addX) ? mesh.position.x += 0.1 : mesh.position.x -= 0.1;
    //   (mesh.addY) ? mesh.position.y += 0.1 : mesh.position.y -= 0.1 ;
    //   (mesh.addZ) ? mesh.position.z += 0.5 : mesh.position.z -= 0.5;
    // // }
    // // (addZ) ? mesh.position.z += 2 : mesh.position.z -= 2;
    // //
    // // console.log(renderer.context.drawingBufferHeight / 2, mesh.position.y)

    // if (mesh.position.x >= renderer.context.drawingBufferWidth / 12) {
    //   mesh.addX = false;
    // } else if (mesh.position.x <= 0 - (renderer.context.drawingBufferWidth / 12) ) {
    //   mesh.addX = true;
    // }

    // if (mesh.position.y >= (renderer.context.drawingBufferHeight / 12)) {
    //   mesh.addY = false;
    // } else if (mesh.position.y <= 0 - (renderer.context.drawingBufferHeight / 12)) {
    //   mesh.addY = true;
    // }

    // if (mesh.position.z >= 50) {
    //   mesh.addZ = false;
    // } else if (mesh.position.z <= -50) {
    //   mesh.addZ = true;
    // }

  // });
  // });
  renderer.render(scene, camera);
}
