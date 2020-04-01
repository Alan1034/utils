import _ from 'lodash';
import XLSX from "XLSX";

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

//读取Xlsx静态表格文件

const readXlsx = (fileBase64) => {
  // 将base64转换为blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n);
    // eslint-disable-next-line no-plusplus
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  const blob = dataURLtoBlob(fileBase64);
  const fileReader = new FileReader();
  fileReader.readAsBinaryString(blob)

  return fileReader
}

const dealData = (fileBase64, getdata, type) => {
  if (!fileBase64 || !getdata || !type) {
    return
  }
  // type为传入参数
  // getdata为取值用的函数
  const fileReader = readXlsx(fileBase64)
  fileReader.onload = (ev) => {
    let workbook = null
    let datas = [];
    try {
      const data = ev.target.result
      workbook = XLSX.read(data, {
        type: 'binary',
      })// 以二进制流方式读取得到整份excel表格对象
      //  // 存储获取到的数据
    } catch (e) {
      // console.log('文件类型不正确');
    }
    // 表格的表格范围，可用于判断表头是否数量是否正确
    // let fromTo = '';
    // 遍历每张表读取
    for (const sheet in workbook.Sheets) {
      // if (workbook.Sheets.hasOwnProperty(sheet)) {
      if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
        // fromTo = workbook.Sheets[sheet]['!ref'];
        // console.log(fromTo);
        datas = datas.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
        // break; // 如果只取第一张表，就取消注释这行
      }
    }
    getdata(datas, type)
  }
}

// 处理数据
// componentDidMount(){

//   dealData(province, this.getdata, "省份区域")
//   // dealData(thisTrades, this.getdata, "所属行业")
// }

// getdata = (arr, type) => {
//   const { newMenuData } = this.state
//   this.setState({
//     newMenuData: newMenuData.map(ele => {
//       const { key } = ele
//       if (key === type) {
//         ele.children = arr.map(item => {
//           const { code, name } = item
//           return ({
//             ...item,
//             key: code,
//             title: name,
//             search: code,
//             icon: null,
//           })
//         })
//       }
//       return ele
//     }),
//   })
// }

// 千分位数字
const formatNum=(num)=> {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (`${num}`).replace(reg, '$&,');
}


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
  dealData,
  formatNum,
};

// 简单的number 字符格式化输出
export const formatNumberToString=(num, degree = 2)=> {
	let value = Number(num);
	value = isNaN(value) ? 0 : value;
	if (degree === 0) return Math.round(value);
	const power = Math.pow(10, degree);
	return Math.round(value * power) / power;
}
