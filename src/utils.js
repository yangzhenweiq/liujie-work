import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

export const todoLocalStorage = {
  // fetch: function(key) {
  //     return localStorage.getItem(STORAGE_KEY + key) || '';
  // },
  // save: function(key, val) {
  //     localStorage.setItem(STORAGE_KEY + key, val);
  // },
  fetch: function(key) {
      var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
      arr = document.cookie.match(reg);
      if (arr) {
          return unescape(arr[2]);
      } else {
          return null;
      }
  },
  save: function(key, val) {
      var Days = 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);

      document.cookie = key + "=" + escape(val) + ";expires=" + exp.toGMTString();
      // document.cookie = name + "=" + escape(value) ;
  }
};

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 非负整数
export function formatterInteger(value, max, min) {
  value = value.toString().replace(/\$\s?|([^\d]*)/g, '');
  if (parseInt(value) > max || parseInt(value) < min) {
    value = value.substring(0, value.length-1);
  }
  return value;
}

// 非负小数
export function formatterDecimal(num, max, min, precision) {
  //输入[..][0..][1..][012][100.000][1.010][0.0.][00][01]
  const value = num.toString().replace(/\$\s?|([^\d.]*)/g, '');
  const step1 = value.replace(/^\.(.*?)$/g, '0.$1');
  let step2 = '';
  // 保留小数点后x位
  if (precision === 1) {
    step2 = step1.replace(/([0-9]+\.[0-9]{1}).*/g, '$1');
  } else {
    step2 = step1.replace(/([0-9]+\.[0-9]{2}).*/g, '$1');
  }


  // 排除输入两个小数点
  let count = 0;
  for (let i = 0; i < step2.length; i++) {
    if (step2[i] === '.') {
      count++;
    }
  }
  if (count === 2) {
    step2 = step2.substring(0, step2.length-1)
  }

  // [00][01]自动变成[0][1], 首字符为0时，后面为数字时，将前面的0去掉
  if (step2[0] === '0' && step2[1] && step2[1] !== '.') {
    step2 = step2.substring(1, step2.length);
  }

  // 最大值 最小值
  if (parseFloat(step2) > max || parseFloat(step2) < min) {
    step2 = step2.substring(0, step2.length-1);
  }
  return step2;
}
