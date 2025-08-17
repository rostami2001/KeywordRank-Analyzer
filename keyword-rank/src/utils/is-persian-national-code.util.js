const isPersianNationalCode = (value) => {
  let code = value;
  if (code.length === 10) {
    if (
      code === '0000000000' ||
      code === '1111111111' ||
      code === '2222222222' ||
      code === '3333333333' ||
      code === '4444444444' ||
      code === '5555555555' ||
      code === '6666666666' ||
      code === '7777777777' ||
      code === '8888888888' ||
      code === '9999999999'
    ) {
      return false;
    }
    let c = parseInt(code.charAt(9));
    let n =
      parseInt(code.charAt(0)) * 10 +
      parseInt(code.charAt(1)) * 9 +
      parseInt(code.charAt(2)) * 8 +
      parseInt(code.charAt(3)) * 7 +
      parseInt(code.charAt(4)) * 6 +
      parseInt(code.charAt(5)) * 5 +
      parseInt(code.charAt(6)) * 4 +
      parseInt(code.charAt(7)) * 3 +
      parseInt(code.charAt(8)) * 2;
    let r = n - parseInt(n / 11) * 11;
    return (r === 0 && r === c) || (r === 1 && c === 1) || (r > 1 && c === 11 - r);
  }
  return false;
};

export default isPersianNationalCode;
