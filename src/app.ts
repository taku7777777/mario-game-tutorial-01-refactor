import { Controller } from "./controller";

/**
 * 1フレームあたりの処理をまとめて行ってくれる
 * Controllerの初期化を行う
 */
const instance = Controller.createInstance();

/**
 * 1フレームあたりの更新処理の定義
 */
function update() {
  /**
   * Controllerの更新処理を実行する
   */
  instance.update();

  /**
   * 毎フレームごとに更新処理が実行されるように
   * 更新処理内で再帰的に呼び出しを行う
   * (予め決められた呪文のようなもの)
   */
  window.requestAnimationFrame(update);
}

/**
 * 初期ロード時に、更新処理が実行されるようにする
 */
window.addEventListener("load", update);
