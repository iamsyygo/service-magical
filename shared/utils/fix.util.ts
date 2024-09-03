declare global {
  interface BigInt {
    toJSON(): string | number;
  }
}

/**
 * fix: Do not know how to serialize a BigInt
 * see: https://github.com/prisma/studio/issues/614
 */
export function fixBigIntToJSON() {
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };
}
