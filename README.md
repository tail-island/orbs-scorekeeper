# orbs-scorekeeper

[orbs](https://github.com/tail-island/orbs)の採点用プログラムです。解答のスコアを手軽に調べるツールとして、ご活用ください。

## 使用方法

node.jsを使用しています。node.jsをセットアップし、以下の手順を実行してください。

### コードを取得

```shell
$ git clone https://github.com/tail-island/orbs-scorekeeper.git
```

### 依存するライブラリをインストール

```shell
$ npm install
```

### ビルド

```shell
$ npm start
```
ビルド後に、data/question.txt（ランダム・シード=0、ゲーム版のサイズ=10、黒い宝玉の数=6、壁の比率=0.1）とdata/answer.txtを使用して実行します。最後に`13`と表示されればビルド成功です。

### 実行

```shell
$ node app [問題ファイル名] [解答ファイル名]
```
