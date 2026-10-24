function popupBG(){
  popupBg.classList.toggle("hidden")
}

// ======================== POPUP REGIST LOGIC ========================
if(!regSession){
  popupRegist.classList.remove("hidden");
  popupBG();
  userData = {};
}else{
  console.log(`Haii ${userData["userName"]}, Selamat datang di dev Tolls ZumaPlan!`);
  viewHomePage();
  popupSaldoV();
  riwayatV();
  isiOptionDompet();
  updatePopupKategori();
};

document.querySelector(".formReg").addEventListener("submit", (e)=>{
  e.preventDefault();
  let userName = document.getElementById("regName").value;
  if(!userName || userName == ""){
    alert("Isi Nama Kamu Terlebih Dahulu");
    window.location.reload();
    return;
  };

  popupRegist.classList.add("hidden");
  popupBG();
  regSession = "nameOnly";
  document.getElementById("addNameDefault").value = "Cash";
  document.getElementById("addNameDefault").readOnly = true;
  document.getElementById("addValueDefault").setAttribute("valueId",document.getElementById("addNameDefault").value);
  userData["userName"] = userName;
  Object.values(allPage).forEach((fBtn)=>{
    if(!fBtn.classList.contains("hidden")){
      fBtn.classList.add("hidden");
    }
  });
  allPage["addPage"].classList.remove("hidden");
  document.getElementById("footer").classList.add("hidden");
});

if(regSession){
  document.getElementById("addNameDefault").addEventListener("input", ()=>{
    document.getElementById("addValueDefault").setAttribute("valueId",document.getElementById("addNameDefault").value);
    console.log(document.getElementById("addNameDefault").value)
  })
};
function addDompet(){
  let f1 = document.createElement("input");
  f1.classList.add("formNameDompet");
  let f2 = document.createElement("input");
  f2.classList.add("formValueDompet");
  f1.addEventListener("input", function(){
    let v = f1.value;
    f2.setAttribute("valueId",v);
    console.log(v);
  });
  f1.type = "text";
  f2.type = "text";
  f2.inputMode = "numeric";
  let elementBefore = document.querySelector('button[onclick="addDompet(event)"]');
  elementBefore.parentNode.insertBefore(f1, elementBefore)
  elementBefore.parentNode.insertBefore(f2, elementBefore)
}
function saveAdd(){
  if(regSession  == "nameOnly"){
    let time = new Date();
    userData['riwayat']= [];
    userData["dompet"]= {};
    document.querySelectorAll(".formNameDompet").forEach((nf)=>{
      let nm = nf.value;
      let vlu;
      document.querySelectorAll(".formValueDompet").forEach((lv)=>{
        if(lv.getAttribute("valueId") == nm){
          vlu = lv.value;
        }
      });
      userData["dompet"][nm]= vlu;
      userData['riwayat'].push({
        'date': time,
        'type': 'in',
        'dompet': nm,
        'nom': vlu,
        'ket': 'Saldo setup awal'
      });
    });
    Object.keys(userData["dompet"]).forEach((f)=>{
      confirm(`${f} = ${userData["dompet"][f]}`)
    });

    userData["regSession"] = true;
    localStorage.setItem("ZumaPlan", JSON.stringify(userData));
    window.location.reload();
  }else{
    let time = new Date();
    let cancle = false;
    document.querySelectorAll(".formNameDompet").forEach((nf)=>{
      let nm = nf.value;
      let vlu;
      document.querySelectorAll(".formValueDompet").forEach((lv)=>{
        if(lv.getAttribute("valueId") == nm){
          vlu = lv.value;
        }
      });
      Object.keys(userData["dompet"]).forEach((dc)=>{
        if(dc.toUpperCase() === nm.toUpperCase()){
          alert(`Dompet baru dengan nama ${nm} sudah ada!`)
          cancle = true;
        }
      });
      userData["dompet"][nm]= vlu;
      userData['riwayat'].push({
        'date': time,
        'type': 'in',
        'dompet': nm,
        'nom': vlu,
        'ket': 'Saldo awal dompet baru'
      });
    });
    if(cancle){
      return;
      resetCache();
    }
    updateCache();
    alert("Dompet baru berhasil ditambahkan")
    setTimeout(()=>{
      window.location.reload();
    }, 100)
  }
}

// HOME PAGE
function viewHomePage(){
  alert(`haii ${userData["userName"]}`);
  document.getElementById("homeUserName").innerText = userData["userName"];
  let saldoUser = 0;
  Object.values(userData["dompet"]).forEach((sld)=>{
    saldoUser += Number(sld);
  });
  document.getElementById("homeSaldoUser").innerText = `Rp${saldoUser.toLocaleString("ID-id")}`;

  let nw = new Date();
  let theMonth = Intl.DateTimeFormat("id-ID", {month: 'long'}).format(nw);
  let theYear = nw.getFullYear();
  let theDay = nw.getDate()

  document.getElementById("homeDateRekap").innerText = `${theMonth} ${theYear}`;
  let trxOut = [];
  userData['riwayat'].forEach((rt)=>{
    if(rt['type'] == "out" && new Date(rt['date']).getFullYear() == theYear){
      if(Intl.DateTimeFormat("id-ID", {month: "long"}).format(new Date(rt['date'])) == theMonth){
        trxOut.push(rt);
      }
    }
  });
  document.getElementById("homeTotalTransaksiValue").innerText = trxOut.length;
  let ttlOut= 0;
  trxOut.forEach((rt)=>{
    ttlOut += Number(rt["nom"]);
  });
  document.getElementById("homeTotalPengeluaranValue").innerText = ttlOut.toLocaleString("id-ID");
  document.getElementById("homeAveragePengeluaranValue").innerText = (ttlOut/trxOut.length || 0).toLocaleString("id-ID");
}

// POPUP SALDO
function popupSaldoV(){
  console.log(userData);
  document.querySelector(".popupSaldo").innerHTML = '';
  Object.keys(userData['dompet']).forEach((dpt)=>{
    let cont = document.createElement("div");
    let vName = document.createElement("h1");
    vName.textContent = dpt;
    let vValue = document.createElement("h2");
    vValue.textContent = `Rp ${Number(userData['dompet'][dpt]).toLocaleString("id-ID")}`;
    cont.append(vName, vValue);
    document.querySelector('.popupSaldo').append(cont);
    
  })
};

// RIWAYAT TRANSAKSI

 // RIWAYAT TRANSAKSI + FILTER
function riwayatV() {
  const areaRiwayat = document.querySelector(".homeRiwayatTransaksi");
  const header = document.getElementById("headerRiwayat");
  const filterWaktu = document.getElementById("riwayatFilterTime");
  const filterJenis = document.getElementById("riwayatFilter");

  if (!areaRiwayat || !header || !filterWaktu || !filterJenis) return;

  // Bersihkan hasil render sebelumnya
  areaRiwayat.querySelectorAll(
    ".riwayatTransaksi, .riwayatKosong"
  ).forEach((el) => el.remove());

  const waktu = filterWaktu.value;
  const jenis = filterJenis.value;
  const sekarang = new Date();

  // Filter transaksi berdasarkan waktu dan jenis
  const hasilFilter = userData["riwayat"]
    .filter((rwt) => {
      const tanggal = new Date(rwt.date);

      if (Number.isNaN(tanggal.getTime())) return false;

      // Jenis: semua, uang masuk, uang keluar, atau uang pindah
      if (jenis !== "all" && rwt.type !== jenis) return false;

      // Rentang waktu
      if (waktu === "m") {
        // Bulan dan tahun ini
        if (
          tanggal.getMonth() !== sekarang.getMonth() ||
          tanggal.getFullYear() !== sekarang.getFullYear()
        ) return false;
      } else if (waktu === "d") {
        // Hari ini
        if (
          tanggal.getDate() !== sekarang.getDate() ||
          tanggal.getMonth() !== sekarang.getMonth() ||
          tanggal.getFullYear() !== sekarang.getFullYear()
        ) return false;
      }

      return true;
    })
    // Terbaru di atas
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pesan jika tidak ada hasil
  if (hasilFilter.length === 0) {
    const kosong = document.createElement("div");
    kosong.className = "riwayatKosong";
    kosong.textContent = "Belum ada transaksi yang cocok.";
    header.after(kosong);
    return;
  }

  const fragmen = document.createDocumentFragment();

  hasilFilter.forEach((rwt) => {
    const tanggal = new Date(rwt.date);
    const cont = document.createElement("div");
    cont.className = "riwayatTransaksi";

    const h1 = document.createElement("h1");

    if (rwt.type === "in") {
      cont.classList.add("rwtIn");
      h1.className = "rin";
      h1.innerHTML =
        `+ ${Number(rwt.nom).toLocaleString("id-ID")}` + `<span>${rwt.dompet || ""}</span>`;

    } else if (rwt.type === "out") {
      cont.classList.add("rwtOut");
      h1.className = "rout";
      h1.innerHTML =
        `- ${Number(rwt.nom).toLocaleString("id-ID")}` + `<span>${rwt.dompet || ""}<span>`;

    } else if (rwt.type === "pin") {
      cont.classList.add("rwtPin");
      h1.className = "rp";
      h1.textContent =
        `⇌ ${Number(rwt.nom).toLocaleString("id-ID")}`;

    } else {
      // Untuk tipe transaksi yang belum dikenali
      cont.classList.add("rwtPin");
      h1.className = "rp";
      h1.textContent =
        `${Number(rwt.nom).toLocaleString("id-ID")}`;
    }

    const h2 = document.createElement("h2");
    h2.textContent = rwt.ket || "Tanpa Keterangan";

    const span = document.createElement("span");
    const jam = String(tanggal.getHours()).padStart(2, "0");
    const menit = String(tanggal.getMinutes()).padStart(2, "0");
    const hari = String(tanggal.getDate()).padStart(2, "0");
    const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
    const tahun = tanggal.getFullYear();

    span.textContent =
      `${jam}:${menit} | ${hari}-${bulan}-${tahun}`;

    cont.append(h1, h2, span);
    fragmen.appendChild(cont);
  });

  header.after(fragmen);
}

// Event listener filter
document.getElementById("riwayatFilterTime")
  .addEventListener("change", riwayatV);

document.getElementById("riwayatFilter")
  .addEventListener("change", riwayatV);


// PINDAH PAGE
function isiOptionDompet(){
  Object.keys(userData['dompet']).forEach((ld)=>{
    document.querySelectorAll(".selecDompet").forEach((list)=>{
      let option = document.createElement('option');
      option.value = ld;
      option.innerHTML = `${ld.toUpperCase()} | ${Number(userData['dompet'][ld]).toLocaleString("id-ID")}`;
      list.appendChild(option);
    });
  })
};

function savePindah(e){
  let dateNow = new Date();
  let pinFrom = document.getElementById('pindahFrom').value;
  let pinTo = document.getElementById('pindahTo').value;
  let pinNom = Number(document.getElementById('pindahNom').value);

  if(pinNom > userData['dompet'][pinFrom]){
    alert("Nominal yang dipindah tidak boleh lebih besar dari value saldo target");
    return;
  }else if(pinNom == ""){
    alert("Isi nominal terlebih dahulu!");
    return;
  }else if(pinFrom == pinTo){
    alert("Target perpindahan saldo tidak boleh sama dengan saldo yang dipindahkan");
    return;
  }
  userData['dompet'][pinFrom] = String(Number(userData['dompet'][pinFrom]) - pinNom);
  userData['dompet'][pinTo] = String(Number(userData['dompet'][pinTo]) + pinNom);
  alert("TRANSAKSI berhasil dicatat");
  let history = {
      date: dateNow,
      type: "pin",
      ket: `Pindah saldo dari ${pinFrom} ke ${pinTo}`,
      nom: String(pinNom)
  };
  userData['riwayat'].push(history);
  updateCache();
  setTimeout(()=>{
    window.location.reload();
  }, 100);
}

// OUT PAGE
function saveOut(e){
  let dateNow = new Date();
  let outFrom = document.getElementById('outFrom').value;
  let outLabel = document.getElementById('outLabel').value;
  let outNom = Number(document.getElementById('outNom').value);
  let outKet = document.getElementById('outKet').value;

  if(outNom > userData['dompet'][outFrom]){
    alert("Nominal uang keluar tidak boleh lebih besar dari value saldo target");
    return;
  }else if(outNom == ""){
    alert("Isi nominal terlebih dahulu!");
    return;
  }else if(outKet == ""){
    let lanjut = confirm("apakah kamu yakin ingin mengosongi keterangan?");
    if(lanjut){
      outKet = "Tanpa Keterangan";
    }else{
      return;
    }
  }
  userData['dompet'][outFrom] = String(Number(userData['dompet'][outFrom]) - outNom);
  alert("TRANSAKSI berhasil dicatat");
  let history = {
      date: dateNow,
      type: "out",
      ket: outKet,
      kat: outLabel,
      dompet: outFrom,
      nom: String(outNom)
  };
  userData['riwayat'].push(history);
  updateCache();
  setTimeout(()=>{
    window.location.reload();
  }, 100);
}

// IN PAGE
function saveIn(e){
  let dateNow = new Date();
  let inTo = document.getElementById('inTo').value;
  let inLabel = document.getElementById('inLabel').value;
  let inNom = Number(document.getElementById('inNom').value);
  let inKet = document.getElementById('inKet').value;

  if(inNom == ""){
    alert("Isi nominal terlebih dahulu!");
    return;
  }else if(inKet == ""){
    let lanjut = confirm("apakah kamu yakin ingin mengosongi keterangan?");
    if(lanjut){
      outKet = "Tanpa Keterangan";
    }else{
      return;
    }
  }
  userData['dompet'][inTo] = String(Number(userData['dompet'][inTo]) + inNom);
  alert("TRANSAKSI berhasil dicatat");
  let history = {
      date: dateNow,
      type: "in",
      ket: inKet,
      kat: inLabel,
      dompet: inTo,
      nom: String(inNom)
  };
  userData['riwayat'].push(history);
  updateCache();
  setTimeout(()=>{
    window.location.reload();
  }, 100);
}

function updatePopupKategori() {
  let nw = new Date();
  let theMonth = nw.getMonth();
  let theYear = nw.getFullYear();

  // List kode kategori yang ada di form Out
  let mapKategori = {
    "KP": "KEBUTUHAN POKOK",
    "KB": "KEBUTUHAN BELAJAR/KERJA",
    "INV": "INVESTASI",
    "FD": "MAKANAN DAN MINUMAN",
    "B": "BARANG",
    "PNP": "PULSA/PAKET DATA"
  };

  let totalPerKat = { "KP": 0, "KB": 0, "INV": 0, "FD": 0, "B": 0, "PNP": 0 };
  let totalSemuaOut = 0;
  let totalKat = 0;

  // Hitung total pengeluaran per kategori di bulan ini
  userData['riwayat'].forEach((rwt) => {
    let rDate = new Date(rwt['date']);
    if(rwt['type'] === "out" && rDate.getMonth() === theMonth && rDate.getFullYear() === theYear){
      let kat = rwt['kat'];
      let nom = Number(rwt['nom']);
      if(totalPerKat[kat] !== undefined){
        totalPerKat[kat] += nom;
      }
      totalSemuaOut += nom;
    }
  });
  Object.keys(totalPerKat).forEach((ttl)=>{
    if(totalPerKat[ttl] !== 0){
      totalKat += 1;
    }
  });
  document.getElementById("totalKat").innerHTML = totalKat;
  console.log(totalKat);
  console.log(totalPerKat)

  // Update teks persentase di dalam elemen popup
  // Format ID elemen di HTML popup kamu: outKPV, outKBV, ouINVV, outFDV, outBV, outPNPV
  let keys = Object.keys(mapKategori);
  keys.forEach((k) => {
    let persen = totalSemuaOut > 0 ? Math.round((totalPerKat[k] / totalSemuaOut) * 100) : 0;
    
    // Sesuaikan mapping ID target di HTML popup kategori kamu
    let targetIdMap = {
      "KP": "outKPV",
      "KB": "outKBV",
      "INV": "ouINVV",
      "FD": "outFDV",
      "B": "outBV",
      "PNP": "outPNPV"
    };

    let el = document.getElementById(targetIdMap[k]);
    if(el) {
      el.textContent = `${persen}%`;
      if(persen === 0){
        el.style.color = "white";
      }else if(persen > 1 && persen <= 25){
        el.style.color = "green";
      }else if(persen >25 && persen <= 50){
        el.style.color = "blue";
      }else if(persen > 50 && persen <= 75){
        el.style.color = "yellow";
      }else if(persen > 75){
        el.style.color = "red";
      }
    }
  });
}
