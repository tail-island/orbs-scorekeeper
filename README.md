# orbs-scorekeeper

[orbs](https://github.com/tail-island/orbs)の採点用プログラムです。解答のスコアを調べるツールとして、ご使用ください。

## ビルド方法

node.jsを使用しています。まずはnode.jsをセットアップしてください。

1. コードを取得

```shell
$ git clone https://github.com/tail-island/orbs-scorekeeper.git
```

2. 依存するライブラリをインストール

```shell
$ npm install
```

3. ビルド

```shell
$ npm start
```
ビルド後に、data/question.txtとdata/answer.txtを使用して実行します。最後に`13`と表示されればビルド成功です。

4. 実行

```shell
$ node app [問題ファイル名] [解答ファイル名]
```
