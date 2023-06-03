var bg = {
  // (A) INITIALIZE
  data : null, // entries data
  hBal : null, // html balance amount
  hInc : null, // html income amount
  hExp : null, // html expense amount
  hList : null, // html entries list
  hForm : null, // html form wrapper
  fID : null, fSign : null, fTxt : null, fAmt : null, // html form fields
  init : () => {
    // (A1) GET HTML ELEMENTS
    bg.hBal = document.getElementById("balanceAmt");
    bg.hInc = document.getElementById("incomeAmt");
    bg.hExp = document.getElementById("expenseAmt");
    bg.hList = document.getElementById("list");
    bg.hForm = document.getElementById("form");
    bg.fID = document.getElementById("formID");
    bg.fSign = document.getElementById("formSign");
    bg.fTxt = document.getElementById("formTxt");
    bg.fAmt = document.getElementById("formAmt");

    // (A2) LOAD ENTRIES
    bg.entries = localStorage.getItem("entries");
    if (bg.entries==null) { bg.entries = []; }
    else { bg.entries = JSON.parse(bg.entries); }

    // (A3) DRAW ENTRIES
    bg.draw();
  },

  // (B) TOGGLE FORM
  toggle : id => {
    if (id===false) {
      bg.fID.value = "";
      bg.fSign.value = "+";
      bg.fTxt.value = "";
      bg.fAmt.value = "";
      bg.hForm.classList.remove("show");
    } else {
      if (Number.isInteger(id)) {
        bg.fID.value = id;
        bg.fSign.value = bg.entries[id].s;
        bg.fTxt.value = bg.entries[id].t;
        bg.fAmt.value = bg.entries[id].a;
      }
      bg.hForm.classList.add("show");
    }
  },

  // (C) DRAW ENTRIES
  draw : () => {
    // (C1) BALANCE, INCOME, EXPENSES
    let bal = 0, inc = 0, exp = 0, row;

    // (C2) LOOP & DRAW HTML ENTRIES
    bg.hList.innerHTML = "";
    bg.entries.forEach((entry, i) => {
      if (entry.s=="+") {
        inc += entry.a;
        bal += entry.a;
      } else {
        exp += entry.a;
        bal -= entry.a;
      }
      row = document.createElement("div");
      row.className = `entry ${entry.s=="+"?"income":"expense"}`;
      row.innerHTML = `<div class="eDel" onclick="bg.del(${i})">X</div>
      <div class="eTxt">${entry.t}</div>
      <div class="eAmt">$${parseFloat(entry.a).toFixed(2)}</div>
      <div class="eEdit" onclick="bg.toggle(${i})">&#9998;</div>`;
      bg.hList.appendChild(row);
    });

    // (C3) UPDATE TOTALS
    bg.hBal.innerHTML = bal<0 ? `-$${Math.abs(bal).toFixed(2)}` : `$${bal.toFixed(2)}` ;
    bg.hInc.innerHTML = `$${inc.toFixed(2)}`;
    bg.hExp.innerHTML = `$${exp.toFixed(2)}`;
  },

  // (D) SAVE ENTRY
  save : () => {
    // (D1) GET DATA
    let data = {
      s : bg.fSign.value,
      t : bg.fTxt.value,
      a : parseFloat(bg.fAmt.value)
    };

    // (D2) UPDATE ENTRIES ARRAY
    if (bg.fID.value=="") { bg.entries.push(data); }
    else { bg.entries[parseInt(bg.fID.value)] = data; }
    localStorage.setItem("entries", JSON.stringify(bg.entries));

    // (D3) UPDATE HTML INTERFACE
    bg.toggle(false);
    bg.draw();
    return false;
  },

  // (E) DELETE ENTRY
  del : id => { if (confirm("Delete entry?")) {
    bg.entries.splice(id, 1);
    localStorage.setItem("entries", JSON.stringify(bg.entries));
    bg.draw();
  }}
};
window.onload = bg.init;