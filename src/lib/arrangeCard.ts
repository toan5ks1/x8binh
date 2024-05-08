function listSodu(t: any) {
  for (var e = [], i = 0; i < t.length; i++) {
    var n = Math.floor(t[i] / 4) + 1;
    0 === n && (n = 13), e.push(n);
  }
  return listSort(e), e;
}
function listSort(t: any[]) {
  t.sort(function (t, e) {
    return t > e ? 1 : t < e ? -1 : 0;
  });
}
function sortSanhTangDan(t: any[]) {
  t.sort(function (t, e) {
    return t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
  });
}
function sortSanhGiamDan(t: any[]) {
  t.sort(function (t: { N: number }, e: { N: number }) {
    return t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
  });
}
function sortThungGiamDan(t: any[]) {
  t.sort(function (t, e) {
    return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
  });
}
function sortVector2(t: any[]) {
  t.sort(function (t, e) {
    return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
  });
}
function sortVector(t: any[]) {
  t.sort(function (t, e) {
    return t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
  });
}
function checkTPS(t: any[]) {
  if (t.length < 5) return 0;
  var e = t.slice();
  return (
    sortVector(e), checkThung(t) > 0 && checkSanh(t) > 0 ? 544 + e[4].N : 0
  );
}
function checkDoi(t: any) {
  var e = 0,
    i = t.slice();
  sortVector(i);
  for (var n = 0; n < i.length - 1; ++n)
    if (i[n].N === i[n + 1].N) {
      e = 68 + i[n].N;
      break;
    }
  return e;
}
function checkThu(t: any) {
  var e = 0;
  if (t.length <= 3) return 0;
  var i = t.slice();
  sortVector(i);
  for (var n = 0, o = [], a = 0; a < i.length - 1; ++a) {
    for (var s = a + 1; s < i.length && i[a].N === i[s].N; ++s) n++;
    1 === n && (o.push(i[a]), o.push(i[a + 1]), (a += 1)), (n = 0);
  }
  return 4 === o.length && (e = 136 + o[3].N), e;
}
function checkSam(t: any) {
  var e = 0,
    i = t.slice();
  sortVector(i);
  for (var n = 0, o = 0; o < i.length - 1; ++o) {
    for (var a = o + 1; a < i.length && i[o].N === i[a].N; ++a) n++;
    if (2 === n) {
      e = 204 + i[o].N;
      break;
    }
    n = 0;
  }
  return e;
}
function checkSanh(t: any) {
  var e = 0;
  if (t.length < 5) return 0;
  var i = t.slice();
  sortVector(i);
  for (
    var n = 0, o = 0, a = 0, s = indexA(i) > 0, r = 0;
    r < i.length - 1;
    ++r
  ) {
    var c = i[r + 1].N - i[r].N;

    if (
      (c > 1
        ? ((n = 0), (o = 0), (a = i[r + 1].N))
        : 1 === c &&
          (n++, (o = i[r].N), r === i.length - 2 && (n++, (o = i[r + 1].N))),
      s && ((3 === n && 4 === o) || (4 === n && 5 === o)))
    )
      return 277;
    if (5 === n) break;
  }
  if (5 === n) {
    if (((e = 272 + o), s && 2 === a)) return 277;
    if (s && 10 === a) return 286;
  }
  return e;
}

// function sortVector2(t) {
//   t.sort(function (t, e) {
//     return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
//   });
// }

function checkCuLu(t: any) {
  if (t.length < 5) return 0;
  var e = t.slice();
  sortVector(e);
  for (var i = 0, n = -1, o = 0, a = 0; a < e.length - 1; ++a) {
    for (var s = a + 1; s < e.length && e[a].N === e[s].N; ++s) i++;
    if (2 === i) {
      (n = a), (i = 0), (o = e[a].N);
      break;
    }
    i = 0;
  }
  if (-1 !== n) {
    e.splice(n, 3);
    for (a = 0; a < e.length - 1; ++a)
      if (e[a].N === e[a + 1].N) return 408 + o;
  }
  return 0;
}
function checkTuQuy(t: any) {
  if (t.length < 4) return 0;
  var e = 0,
    i = t.slice();
  sortVector(i);
  for (var n = 0, o = 0; o < i.length - 1; ++o) {
    for (var a = o + 1; a < i.length && i[o].N === i[a].N; ++a) n++;
    if (3 === n) return o as any, (n = 0), 476 + i[o].N;
    n = 0;
  }
  return e;
}
function checkThung(t: any[]) {
  if (t.length < 5) return 0;
  var e = t.slice();
  sortVector2(e);
  for (var i = 0, n = 0; n < e.length - 1; ++n) {
    for (var o = n + 1; o < e.length && e[n].S === e[o].S; ++o) i++;
    if (4 === i) return 340 + e[0].N;
    i = 0;
  }

  return 0;
}

function checkSanhRong(t: string | any[]) {
  if (t.length < 13) return -1;
  for (var e = listSodu(t), i = 0; i < e.length; i++)
    if (e[i] !== i + 1) return !1;
  return !0;
}
function checkAndMoveTuQuy(t: any[], e: any[]) {
  if (4 === t.length && e.length > 3) {
    var i = getComBo(e, 3, null);
    i.length > 0
      ? (t.push(e[0]), e.splice(0, 1), e.push(i[0]), e.push(i[1]), e.push(i[2]))
      : (i = getComBo(e, 2, null)).length > 0
      ? (t.push(e[0]), e.splice(0, 1), e.push(i[0]), e.push(i[1]))
      : (t.push(e[0]), e.splice(0, 1));
  }
}
function checkSanhRongDongHoa(t: any) {
  if (t.length < 13) return -1;
  if (checkSanhRong(t)) {
    for (var e = (t[0] % 4) + 1 > 2, i = 0; i < t.length; i++) {
      if (e && (t[i] % 4) + 1 <= 2) return -1;
      if (0 == (e as any) && (t[i] % 4) + 1 > 2) return -1;
    }
    return 15;
  }
  return -1;
}
function indexA(t: any) {
  for (var e = 0; e < t.length; ++e) if (14 === t[e].N) return e;
  return 0;
}
function getMark(t: any) {
  var e = 0;
  if ((e = checkTPS(t)) > 0) {
    return e;
  } else if ((e = checkTuQuy(t)) > 0) {
    return e;
  } else if ((e = checkCuLu(t)) > 0) {
    return e;
  } else if ((e = checkThung(t)) > 0) {
    return e;
  } else if ((e = checkSanh(t)) > 0) {
    return e;
  } else if ((e = checkSam(t)) > 0) {
    return e;
  } else if ((e = checkThu(t)) > 0) {
    return e;
  } else if ((e = checkDoi(t)) > 0) {
    return e;
  } else {
    return e;
  }
}

function BinhSanhRong(t: any) {
  if (t.length < 13) return -1;
  for (var e = listSodu(t), i = 0; i < e.length; i++)
    if (e[i] !== i + 1) return -1;
  return 14;
}
function BinhDongHoa(t: any) {
  if (t.length < 13) return -1;
  for (var e = t[0] % 4, i = 0 === e || 1 === e, n = 1; n < t.length; ++n) {
    var o = t[n] % 4;
    if (i !== (0 === o || 1 === o)) return -1;
  }
  return 13;
}
function getMarkMauBinh(t: any, e: any, i: any, n: any) {
  listSort(t);
  if (15 === checkSanhRongDongHoa(t)) return 15;
  if (14 === BinhSanhRong(t)) return 14;
  if (13 === BinhDongHoa(t)) return 13;
  var o = Binh6Doi(t);
  return 16 === o
    ? 16
    : 12 === o
    ? 12
    : 11 === Binh3Thung(e, i, n)
    ? 11
    : 10 === Binh3Sanh(e, i, n)
    ? 10
    : 0;
}

function Binh3Thung(t: any, e: any, i: any) {
  return checkThung(e) <= 0 || checkThung(i) <= 0
    ? -1
    : 3 !== t.length
    ? -1
    : t[0].S === t[1].S && t[0].S === t[2].S
    ? 11
    : -1;
}

function Binh3Sanh(t: any, e: any, i: any) {
  return checkSanh(e) <= 0 || checkSanh(i) <= 0
    ? -1
    : 3 !== t.length
    ? -1
    : (sortVector(t),
      12 === t[0].N && 13 === t[1].N && 14 === t[2].N
        ? 10
        : 2 === t[0].N && 3 === t[1].N && 14 === t[2].N
        ? 10
        : t[0].N + 1 === t[1].N && t[1].N + 1 === t[2].N
        ? 10
        : -1);
}

function Binh6Doi(t: any) {
  if (t.length < 13) return -1;
  for (var e = 0, i = 0, n = 0, o = 0; o < 12; ++o) {
    for (var a = Math.floor(t[o] / 4) + 1, s = o + 1; s < 13; ++s) {
      if (a !== Math.floor(t[s] / 4) + 1) break;
      n++;
    }
    n >= 1 && n <= 2
      ? ((e += 1), n > 1 && (i += 1), (o += n), (n = 0))
      : n > 2 && ((e += 2), (o += n), (n = 0));
  }
  return e >= 6 ? (i > 0 ? 16 : 12) : -1;
}

function sapXep2(t: any, e: any) {
  void 0 === e && (e = -1);
  var i,
    o = [],
    a = [];
  (o = getchi(t, e)),
    (a = getchi(t, undefined)),
    (i = t),
    checkAndMoveTuQuy(o, i),
    checkAndMoveTuQuy(a, i);
  var s = getMark(o),
    r = getMark(a),
    c = getMark(i);

  if (r > s || (s === r && soSanhMauThau(a, o))) {
    var l = o;
    (o = a), (a = l);
    var h = s;
    (s = r), (r = h);
  }
  for (var u = [], d = [], p = 0; p < i.length; ++p)
    d.push(i[p]), u.push(i[p].serverCode);
  for (p = 0; p < a.length; ++p) d.push(a[p]), u.push(a[p].serverCode);
  for (p = 0; p < o.length; ++p) d.push(o[p]), u.push(o[p].serverCode);
  return {
    list: d,
    // p: s + r + c,
    mark3: s,
    mark2: r,
    mark1: c,
    mb: getMarkMauBinh(u, i, a, o),
  };
}
function soSanhMauThau(t: any, e: any) {
  sortVector(t), sortVector(e);
  for (var i = Math.min(t.length, e.length), n = 0; n < i; ++n) {
    var o = t[t.length - 1 - n].N,
      a = e[e.length - 1 - n].N;
    if (o > a) return !0;
    if (o < a) return !1;
  }
  return !1;
}

function getchi(t: any, e: any) {
  void 0 === e && (e = -1);
  var i = [],
    n = getThungPS(t);
  if (n.length > 0) return n;
  if ((n = getComBo(t, 4, undefined)).length > 0) return n;
  if (1 !== e) {
    var o = getComBo(t, 3, undefined);
    if (o.length > 0) {
      var a = getComBo(t, 2, undefined);
      if (a.length > 0) for (var s = 0; s < a.length; ++s) o.push(a[s]);
      if (5 === o.length) return o;
      for (s = 0; s < o.length; ++s) t.push(o[s]);
    }
  }
  if (2 !== e && (n = getThung(t)).length > 0) return n;
  if ((n = getSanh(t)).length > 0) return n;
  var r = getComBo(t, 3, undefined);
  if (r.length > 0) {
    sortSanhTangDan(t);
    for (s = 0; s < 2; ++s) r.push(t[s]);
    return t.splice(0, 2), r;
  }
  var c = getComBo(t, 2, !0);
  if (c.length > 0) {
    var l = getComBo(t, 2, undefined);
    if (l.length > 0) for (s = 0; s < l.length; ++s) c.push(l[s]);
    else {
      sortSanhTangDan(t);
      for (s = 0; s < 3; ++s) c.push(t[s]);
      t.splice(0, 3);
    }
    return c;
  }
  sortSanhTangDan(t);
  for (s = 0; s < 4; ++s) i.push(t[s]);
  return t.splice(0, 4), i.push(t[t.length - 1]), t.splice(t.length - 1, 1), i;
}

function getThungPS(t: any) {
  sortThungGiamDan(t);
  for (var e = [0, 0, 0, 0], i = 0; i < t.length; ++i) {
    var n = t[i];
    if (n.S > 4 || n.S < 1) return [];
    e[n.S - 1]++;
  }
  var o = 0;
  for (i = 0; i < e.length; ++i) {
    if (e[i] >= 5)
      for (var a = 0, s = t[o].N, r = o; r < o + e[i] - 1; ++r) {
        if (
          (1 === Math.abs(t[r + 1].N - t[r].N)
            ? a++
            : ((a = 0), (s = t[r + 1].N)),
          a >= 4)
        ) {
          for (var c = [], l = 0; l < 5; ++l) c.push(t[r + 1 - 4 + l]);
          return t.splice(r + 1 - 4, 5), c;
        }
        if (3 === a && 5 === s && 14 === t[o].N) {
          for (c = [], l = 0; l < 4; ++l) c.push(t[r + 1 - 3 + l]);
          return t.splice(r + 1 - 3, 4), c.push(t[o]), t.splice(o, 1), c;
        }
      }
    o += e[i];
  }
  return [];
}

function getThung(t: any[]) {
  sortThungGiamDan(t);
  for (var e = [0, 0, 0, 0], i = 0; i < t.length; ++i) {
    var n = t[i];
    if (n.S > 4 || n.S < 1) return [];
    e[n.S - 1]++;
  }
  var o = 0;
  for (i = 0; i < e.length; ++i) {
    if (e[i] >= 5) {
      for (var a = [], s = o; s < o + 5; ++s) a.push(t[s]);
      return t.splice(o, 5), a;
    }
    o += e[i];
  }
  return [];
}

function getComBo(t: any, e: any, i: any | undefined) {
  if ((void 0 === i && (i = !1), t.length < e)) return [];
  e > 2 || i ? sortSanhGiamDan(t) : sortSanhTangDan(t);
  for (var n = 0, o = 0; o < t.length - 1; ++o) {
    for (var a = o + 1; a < t.length && t[o].N === t[a].N; ++a) n++;
    if (n === e - 1) {
      var s = [];
      for (a = o; a < o + e; ++a) s.push(t[a]);
      return t.splice(o, e), s;
    }
    n = 0;
  }
  return [];
}

function getSanh(t: any) {
  sortSanhGiamDan(t);
  for (var e, i, n = 0, o = getXiIndex(t), a = 0; a < t.length - 1; ++a) {
    var s = t[a] as any;
    (e = s.N), (i = s.N), (n = 0);
    for (var r = a + 1; r < t.length; ++r) {
      var c = t[r],
        l = Math.abs(c.N - e);
      if ((1 === l && (n++, (e = c.N)), l > 1)) break;
      if (4 === n) {
        (d = []).push(s as never), t.splice(a, 1), (e = s.N);
        for (var h = a; h < t.length; ++h) {
          var u = t[h];
          if (
            1 === Math.abs(u.N - e) &&
            (d.push(u), (e = u.N), t.splice(h, 1), (h -= 1), 0 === --n)
          )
            return d;
        }
      } else if (o >= 0 && 3 === n && 5 === i) {
        var d: any[];
        (d = []).push(s as never), t.splice(a, 1), (e = s.N);
        for (h = a; h < t.length; ++h) {
          u = t[h];
          if (
            1 === Math.abs(u.N - e) &&
            (d.push(u), (e = u.N), t.splice(h, 1), (h -= 1), 0 === --n)
          )
            return (o = getXiIndex(t)), d.push(t[o]), t.splice(o, 1), d;
        }
      }
    }
  }
  return [];
}

function getXiIndex(t: string | any[]) {
  for (var e = 0; e < t.length; ++e) if (14 === t[e].N) return e;
  return -1;
}

function getTextOfListCard(t: number) {
  return t > 544
    ? 'TP Sảnh'
    : t > 476
    ? 'Tứ Quý'
    : t > 408
    ? 'Cù lũ'
    : t > 340
    ? 'Thùng'
    : t > 272
    ? 'Sảnh'
    : t > 204
    ? 'Sam'
    : t > 136
    ? 'Thú'
    : t > 68
    ? 'Đôi'
    : 'Mậu Thầu';
}

function getTextofMauBinh(t: number) {
  return 10 === t
    ? '3 Sảnh'
    : 11 === t
    ? '3 Thùng'
    : 12 === t
    ? '6 Đôi'
    : 13 === t
    ? 'Đồng Hoa'
    : 14 === t
    ? 'Sảnh Rồng'
    : 15 === t
    ? 'Sảnh Rồng Đồng Hoa'
    : 16 === t
    ? '5 Đôi 1 Sam'
    : '';
}

function decodeCard2(cardCode: number) {
  const suits = ['bich', 'chuon', 'ro', 'co'];
  const s = (cardCode % 4) + 1;
  var n = Math.floor(cardCode / 4) + 1;

  if (n === 1) {
    n = 14;
  }

  const suitSymbol = suits[s - 1];

  return { serverCode: cardCode, N: n, S: s, suitSymbol: suitSymbol };
}

function getCardNumBer(t: string | any[]) {
  for (var e = [], i = 0; i < t.length; ++i) e.push(t[i].serverCode);
  return e;
}

function mBaiSapXep(t: any) {
  if (13 !== t.length) return [];
  var e = t.map((cardCode: number) => decodeCard2(cardCode));
  var n = sapXep2(e, undefined) as any;
  var sortedList = n.list;
  var result: any[];
  if (n.mark3 > 544 || n.mark3 > 476) sortedList = n.list;
  if (n.mb > 0) sortedList = n.list;
  else if (n.mark3 > 408 || n.mark3 > 340) {
    var o = t.map((cardCode: number) => decodeCard2(cardCode));
    var a = -1;
    n.mark3 > 408 ? (a = 1) : n.mark3 > 340 && (a = 2);
    var s = sapXep2(o, a) as any;
    // n.mark3 = s.mark3;
    // n.mark2 = s.mark2;
    // n.mark1 = s.mark1;
    sortedList = s.p > n.p || s.mb > 0 ? s.list : n.list;
  }

  result = sortedList.map((item: any) => item.serverCode);

  var orderedResult = result.map((code) =>
    result.find((item) => item === code)
  );

  return {
    cards: orderedResult.reverse(),
    chi1: getTextOfListCard(n.mark3),
    chi2: getTextOfListCard(n.mark2),
    chi3: getTextOfListCard(n.mark1),
    instant: getTextofMauBinh(n.mb),
  };
}

export const arrangCard = (cards: any) => {
  return mBaiSapXep(cards);
};
