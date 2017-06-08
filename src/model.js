import R from 'ramda';

function orbIndex(orb) {
  return R.indexOf(orb, ['r', 'g', 'b'])
}

class BlackOrb {
  constructor(y, x) {
    this.y = y;
    this.x = x;

    this.inCase = true;
    this.absorbedOrbCounts = [0, 0, 0];
  }

  absorb(orb) {
    this.absorbedOrbCounts[orbIndex(orb)]++;
  }
}

export default class Model {
  constructor(questionString, answerString) {
    const splitLines = (string) => {
      return R.map(R.trim, R.split(/\n|\r\n|\r/, R.trim(string)));
    }

    const parseQuestionString = R.pipe(
      (string) => {
        return splitLines(string);
      },
      (lines) => {
        this.size = parseInt(R.head(lines));
        return R.tail(lines);
      },
      (lines) => {
        this.blackOrbCount = parseInt(R.head(lines));
        return R.tail(lines);
      },
      (lines) => {
        this.items = R.map(R.split(' '), R.take(this.size, lines));
        return R.drop(this.size, lines);
      },
      (lines) => {
        this.frames = R.map(R.split(' '), R.take(4, lines));
        return R.drop(4, lines);
      }
    );

    const parseAnswerString = R.pipe(
      (string) => {
        return splitLines(string);
      },
      (lines) => {
        this.blackOrbs = R.map(R.compose(R.apply(R.construct(BlackOrb)), R.reverse, R.map(R.compose(parseInt, R.trim)), R.split(' ')), R.take(this.blackOrbCount, lines));

        for (const blackOrb of this.blackOrbs) {
          if (blackOrb.y < 0 || this.size <= blackOrb.y || blackOrb.x < 0 || this.size <= blackOrb.x || this.items[blackOrb.y][blackOrb.x] === 'w') {
            throw new Error(`(${blackOrb.x}, ${blackOrb.y})には、黒い宝玉を置けません。`);
          }

          blackOrb.absorb(this.items[blackOrb.y][blackOrb.x]);
          this.items[blackOrb.y][blackOrb.x] = 'x';
        }

        return R.drop(this.blackOrbCount, lines);
      },
      (lines) => {
        this.commands = R.map(R.compose(parseInt, R.trim), lines);
      }
    );

    this.score = 0;

    parseQuestionString(questionString);
    parseAnswerString(answerString);
  }

  doCommand(command) {
    R.pipe(
      () => {
        return this.blackOrbs;
      },
      R.filter(R.prop('inCase')),  // ケースの中の黒い宝玉のみにフィルーターします。
      R.sort(R.pipe(R.unapply(R.map(R.prop(command % 2 == 0 ? 'x' : 'y'))), command < 2 ? R.identity : R.reverse, R.apply(R.subtract))),  // 邪魔になる順（左に動かすなら、左にある方が先）に、ソートします。
      R.forEach((blackOrb) => {
        // 黒い宝玉が移動できる可能性がある領域を取得します。
        const [ys, xs] = R.pipe(
          R.juxt([
            (blackOrb) => {
              const prop = R.prop(command % 2 == 0 ? 'y' : 'x')(blackOrb);
              return [prop, prop + 1];
            },
            (blackOrb) => {
              const prop = R.prop(command % 2 == 0 ? 'x' : 'y')(blackOrb);
              return command < 2 ? [0, prop] : [prop + 1, this.size];
            }
          ]),
          R.map(R.apply(R.range)),
          ([r1, r2]) => {
            return (command % 2 == 0 ? R.identity : R.reverse)([r1, (command < 2 ? R.reverse : R.identity)(r2)]);
          }
        )(blackOrb);

        // 黒い宝玉を実際に移動させます。
        for (const y of ys) {
          for (const x of xs) {
            if (new Set(['w', 'x']).has(this.items[y][x])) {
              return;
            }

            this.items[blackOrb.y][blackOrb.x] = ' ';

            blackOrb.y = y;
            blackOrb.x = x;
            blackOrb.absorb(this.items[y][x]);

            this.items[blackOrb.y][blackOrb.x] = 'x';
          }
        }

        // 黒い宝玉がケースの外に出る場合は、消します。
        if (new Set([0, this.size - 1]).has(R.prop(command % 2 == 0 ? 'x' : 'y')(blackOrb))) {
          this.score += blackOrb.absorbedOrbCounts[orbIndex(this.frames[command][R.prop(command % 2 == 0 ? 'y' : 'x')(blackOrb)])];  // スコア計算。
          this.items[blackOrb.y][blackOrb.x] = ' ';

          blackOrb.inCase = false;
        }
      })
    )();
  }

  calculateScore() {
    for (const command of this.commands) {
      this.doCommand(command);

      // console.log(this.items);
      // console.log(this.score);
    }

    return R.all(R.complement(R.prop('inCase')), this.blackOrbs) ? this.score : null;
  }
}
