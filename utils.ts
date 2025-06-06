
// for demo purpose don't want to install @types/node
export function assertEq(first: boolean | number, second: boolean | number) {
  if (typeof first !== typeof second) {
    throw new Error('Types not equal')
  }

  if (first === second) {
    console.log("✅ OK");
  } else {
    console.log("⛔ Err");
  }
}