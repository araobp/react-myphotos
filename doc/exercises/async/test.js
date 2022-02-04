const test = async () => {
  return 1;
}

const t = {};

const test2 = async () => {
  test()
  .then(d => {
    t.d = 1;
    console.log(t);
  });
  console.log(t);
}

test2();
