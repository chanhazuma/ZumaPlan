let footerBtn = {
  "homePage": document.getElementById("footerBtnHome"),
  "pindahPage": document.getElementById("footerBtnPindah"),
  "outPage": document.getElementById("footerBtnOut"),
  "inPage": document.getElementById("footerBtnIn"),
  "addPage": document.getElementById("footerBtnAdd")
};
let userData = JSON.parse(localStorage.getItem("ZumaPlan")) || {};
function updateCache(){
localStorage.setItem("ZumaPlan", JSON.stringify(userData));
};
function resetCache(){
  userData = JSON.parse(localStorage.getItem("ZumaPlan")) || {};
}
let popupRegist = document.querySelector(".popupRegist");
let regSession = userData["regSession"] || false;
let popupBg = document.querySelector(".popupBg");
let popupSaldo = document.querySelector(".popupSaldo");
let popupKategori = document.querySelector(".popupKategori");
let allPage = {
  
};
Object.keys(footerBtn).forEach((i)=>{
  allPage[i] = document.querySelector(`.${i}`);
});

Object.keys(footerBtn).forEach((i)=>{
  footerBtn[i].addEventListener("click", function(){
    Object.values(allPage).forEach((p)=>{
      if(!p.classList.contains("hidden")){
        p.classList.add("hidden");
      }
    });
    allPage[i].classList.remove("hidden");

    Object.values(footerBtn).forEach((fb)=>{
      if(fb.classList.contains("footerClicked")){
        fb.classList.remove("footerClicked")
      }
    });
    footerBtn[i].classList.add("footerClicked");
  })
});

popupBg.addEventListener("click", function(){
  if(!popupBg.classList.contains("hidden")){
    popupBg.classList.add("hidden");
  };
  if(!popupSaldo.classList.contains("hidden")){
    popupSaldo.classList.add("hidden");
  };
  if(!popupKategori.classList.contains("hidden")){
    popupKategori.classList.add("hidden");
  };
})
document.getElementById("homeBtnVSaldo").addEventListener("click", function(){
  if(popupBg.classList.contains("hidden")){
    popupBg.classList.remove("hidden");
  };
  if(popupSaldo.classList.contains("hidden")){
    popupSaldo.classList.remove("hidden");
  };
})
document.getElementById("detailKategori").addEventListener("click", function(){
  if(popupBg.classList.contains("hidden")){
    popupBg.classList.remove("hidden");
  };
  if(popupKategori.classList.contains("hidden")){
    popupKategori.classList.remove("hidden");
  };
})