import { KeyInput } from "./input";

/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   * (矩形のx座標と、キー入力状態を保持するKeyInputを保持する)
   */
  private x: number;
  private keyInput: KeyInput;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.x = 0;
    this.keyInput = KeyInput.createInstance();
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * 1フレーム単位で実行される更新処理
   * キー入力状態に応じてx座標を更新し、canvasに矩形を描画する
   */
  public update = () => {
    /**
     * 押下中の方向キーに応じてx座標を移動させる
     */
    if (this.keyInput.isLeftPressed()) this.x = this.x - 2;
    if (this.keyInput.isRightPressed()) this.x = this.x + 2;

    /**
     * 描画対象のcanvasと2Dコンテキストを取得する
     * (取得できない環境では描画処理を行わない)
     */
    const canvas = document.getElementById("screen") as HTMLCanvasElement | null;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    /**
     * 前フレームの描画をクリアした上で、現在のx座標に矩形を描画する
     */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(this.x, 160, 40, 40);
  };
}
