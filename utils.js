import _ from 'lodash';

// 自动添加数字单位 传入num数字 unit个 或者其他单位
const autoGetUnit = (num = 0, unit = '', tofixed = 1) => {
  const floatNumber = parseFloat(num);
  const rightFloatNumber = isNaN(floatNumber) ? 0 : floatNumber;
  let n = _.round(rightFloatNumber, tofixed);
  let u = unit;
  if (n >= 10000 && n < 100000000) {
    n /= 10000;
    n = _.round(parseFloat(n), tofixed);
    u = `万${u}`;
  } else if (n >= 100000000) {
    n /= 100000000;
    n = _.round(parseFloat(n), tofixed);
    u = `亿${u}`;
  }
  return { number: n, unit: u };
};


// 根据传入的code排序 传入arr数组 code排序字段 数组的key
const sortByCode = (arr = [], code, key) => {
  if (arr.length === 0) {
    return [];
  }
  const spareArr = [];
  // console.log(sortArr)
  const sortArr = array => {
    // console.log(array.length)
    if (array.length === 0) {
      return;
    }
    let val = array[0];
    array.forEach(item => {
      if (Number(item[code]) >= Number(val[code])) {
        val = item;
      }
    });
    spareArr.push(val);
    sortArr(array.filter(ele => ele[key] !== val[key]));
  };
  sortArr(arr);
  return spareArr;
};

// 数字除位保留多少位小数 被除数n 除数u 位数f
const numberToFixed = (n, u = 10000, f = false) => {
  if (!n || n === '0' || !u || u === '0') return 0;
  const num = parseFloat(n || 0);
  if (isNaN(f)) return num / u;
  if (num % u === 0) return (num / u).toFixed(0);
  return (num / u).toFixed(f);
};

// 判断文字中是否有数字
const isDecimal = n => {
  return new RegExp(/^[0-9]+?\.[0-9]+?$/).test(n);
};

const MathRound = (m, n = 1) => {
  if (!m) return 0;
  if (Math.abs(Number(m)) < 1) {
    return Math.round(m * Math.pow(10, 2)) / Math.pow(10, 2);
  }
  return Math.round(m * Math.pow(10, n)) / Math.pow(10, n);
};

const beMathRound = (m, n = 1, l = 10000) => {
  if (!m || !l) return 0;
  const num = Number(m) / Number(l);
  if (Math.abs(num) < 1) {
    return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
  }
  return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
};


// 带小数的数据，大于1时候，保留1位小数，小于1时候保留2位小数
const setNumFloat = value => {
  if (Math.abs(parseFloat(value)) > 1) {
    return _.round(parseFloat(value), 1);
  } else if (Math.abs(parseFloat(value)) > 0) {
    return _.round(parseFloat(value), 2);
  } else {
    return value || 0;
  }
};

// 环比数据-小于1的数据，转换成20%时候，大于1%时保留1个小数，小于1%时候保留2个小数
const setPercentFloat = value => {
  if (Math.abs(parseFloat(value)) > 0.01) {
    return _.round(parseFloat(value), 3);
  } else if (Math.abs(parseFloat(value)) > 0.0001) {
    return _.round(parseFloat(value), 4);
  } else {
    return 0;
  }
};

const patt = /[0-9]+/;
const UITextAlign = val => (patt.test(val) ? 'right' : 'left');
const JsonParse = string => {
  let value = null;
  try {
    value = JSON.parse(string);
  } catch (err) {
    console.error(err); // eslint-disable-line
  }
  return value;
};

export default {
  numberToFixed,
  isDecimal,
  autoGetUnit,
  sortByCode,
  setNumFloat,
  UITextAlign,
  MathRound,
  beMathRound,
  setPercentFloat,
  JsonParse,
};
