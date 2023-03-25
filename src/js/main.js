import '../css/style.scss'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'lil-gui';
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.controls = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.gui = new dat.GUI();

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      uSpeed: {
        value: 1.0
      },
    };

    this.clock = new THREE.Clock();

    this.init();
    // this._init();
    // this._update();
    // this._addEvent();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    //ウインドウとWebGL座標を一致させる
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setControlls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  _setGui() {
    // this.gui.add(this.uniforms.uWave, "value").min(0).max(60).step(0.1).name('ノイズの高さ');
    // this.gui.add(this.uniforms.uFrequency, "value").min(0.01).max(0.1).step(0.01).name('ノイズの粒度');
    this.gui.add(this.uniforms.uSpeed, 'value').min(0.001).max(10.0).step(0.001).name('速度')
    // this.gui.addColor(this.uniforms.uColor1, 'value').name('Color 1').listen()
    // this.gui.addColor(this.uniforms.uColor2, 'value').name('Color 2').listen()
    // this.gui.add(this.uniforms.uFrequency.value, "x").min(0).max(30).step(0.1).name('FrequencyX');
    // this.gui.add(this.uniforms.uFrequency.value, "y").min(0).max(30).step(0.1).name('FrequencyY');
    // this.gui.add(this.uniforms.uFrequency.value, "z").min(0).max(30).step(0.1).name('FrequencyZ');
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {
    //ジオメトリ
    this.geometry = new THREE.SphereGeometry(200, 80, 80);


    //マテリアル
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      side: THREE.DoubleSide
    });

    //メッシュ
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  init() {
    this._setRenderer();
    this._setCamera();
    this._setControlls();
    this._setLight();
    this._addMesh();

    this._update();
    this._addEvent();

    this._setGui();
  }

  _update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime * 0.1;

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
    // uniforms変数に反映
    this.mesh.material.uniforms.uResolution.value.set(this.viewport.width, this.viewport.height);
    // meshのscale設定
    const scaleX = Math.round(this.viewport.width / this.mesh.geometry.parameters.width * 100) / 100 + 0.01;
    const scaleY = Math.round(this.viewport.height / this.mesh.geometry.parameters.height * 100) / 100 + 0.01;
    this.mesh.scale.set(scaleX, scaleY, 1);
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();
