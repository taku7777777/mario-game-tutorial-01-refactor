import { Controller } from "./controller";

/**
 * 1フレームあたりの処理をまとめて行ってくれる
 * Controllerの初期化を行う
 */
const instance = Controller.createInstance();

/**
 * 1フレームあたりの更新処理の定義
 * @param timestamp requestAnimationFrameが渡すそのフレームの時刻(DOMHighResTimeStamp)
 *
 * ブラウザから渡されるこの時刻がそのフレームの正規の時刻源となる。
 * 下流のControllerへそのまま渡すことで、FPS計測などが別途performance.now()を
 * 呼ばずに済み、後で固定タイムステップへ拡張する際の土台にもなる
 */
function update(timestamp: number) {
  /**
   * Controllerの更新処理を実行する
   */
  instance.update(timestamp);

  /**
   * 毎フレームごとに更新処理が実行されるように
   * 更新処理内で再帰的に呼び出しを行う
   * (予め決められた呪文のようなもの)
   */
  window.requestAnimationFrame(update);
}

/**
 * 初期ロード時に、更新処理が実行されるようにする
 *
 * loadイベントのハンドラをupdateに直接渡すと、初回だけ引数にEventが渡り
 * 時刻源にならない。requestAnimationFrame経由で呼び出すことで、
 * 初回から正規のtimestampがupdateへ渡るようにする
 */
window.addEventListener("load", () => {
  window.requestAnimationFrame(update);
});
