//Get elements
var hp         = document.querySelector(".healthIndex"),
    times        = document.querySelector(".timeIndex"),
    exp        = document.querySelector(".expIndex"),
    pot        = document.querySelector(".potionIndex"),
    damage     = document.querySelector(".damageIndex"),
    status     = document.querySelector(".params"),
    log        = document.querySelector(".logs"),
    screen     = document.querySelector(".screen"),
    monsterIcon= document.querySelector(".monsterIcon"),
    monsterStat= document.querySelector(".monsterStat")
    
//Button Element
var atk     = document.querySelector(".atk");
var start   = document.querySelector(".start");
var run     = document.querySelector(".run");
var heal    = document.querySelector(".heal");
var exUp    = document.querySelector(".up");
var exLeft  = document.querySelector(".left");
var exRight = document.querySelector(".right");
var open    = document.querySelector(".open");
    
//Player default
const player = {
  health    : 10,
  power     : 25,
  attack    : 5,
  potion    : 0,
  exp       : 0,
  time      : "[0:0:0]",
  status    : [],
}

//Monster Default
const mob = [
   {
      name     : "Rat",
      health   : 5,
      attack   : 3,
      icon     : "🐭"
   },
   {
      name     : "Spider",
      health   : 7,
      attack   : 1,
      icon     : "🕷️"
   },
   {
      name     : "Mutant",
      health   : 10,
      attack   : 2,
      icon     :"🎅"
   },
   {
      name     : "Mutant 2.0",
      health   : 10,
      attack   : 8,
      icon     : "💀"
   }
]

//Dungeon Room
const  rooms = [
   {
      floor : "A1",
      key   : false
   }
]

//Log array
const chatLog     =[];
const battleLog   =[];
const journeyLog  =[];

var timeS   = 0;
var timeH   = 0;
var timeM   = 0;
var timeHM;
setInterval(function() {
        if(timeS >= 60)
        {
          timeM++;
          timeS = 0;
          
          if(timeM >= 60)
          {
            timeH++;
          }
        }
        timeS++;
        playerUpdate();
        player.time  = `[${timeH}:${timeM}:${timeS}]`;
   }, 1100);


var condition     = "idle";
var pathCount     = 0;
var gameOver      = 0;
var isDoor        = 0.78; //random == find Door = ++path

var prevHealthMob;
var randDropMob;
var randPath;
var randDoor;
var path;

exRight.addEventListener("click", explorers);
exLeft.addEventListener("click", explorers);
exUp.addEventListener("click", explorers);
open.addEventListener("click", explorers);


function battle(){
   
   if(player.health <= 0)
   {
      logsUpdate(`\n ${mob[monsters].name} telah membunuh mu`, "txt");
      logsUpdate(`\n Game Over \n`, "over")
      conditions("over");
   }
   
   monsters      = Math.floor(Math.random()*mob.length);
   //log.innerText = "";
   prevHealthMob = mob[monsters].health;
   
   logsUpdate(`Kamu bertemu dengan monster ${mob[monsters].name}`, "battle");
   screenData(mob[monsters], "mob");
   screenData(`${mob[monsters].name} \n 💟 ${mob[monsters].health}`, "mobHealth");
   conditions();
   
   
   atk.onclick    = function attackPlayer()
   {
      let randDmgPlayer        = Math.floor(Math.random() * (player.attack - 1)) + 1;
          randDropMob          = Math.random();
          mob[monsters].health-= randDmgPlayer;
          
      logsUpdate(`Kamu menyerang monster ${mob[monsters].name} dengan point kerusakan sebesar ${randDmgPlayer}`,"battle");
      screenData( mob[monsters],"mob");
      
      if(mob[monsters].health <= 0)
      {
         logsUpdate(`Kamu berhasil mengalahkan monster ${mob[monsters].name}`,"battle");
         logsUpdate(`[+1 Attack]`, "green");
         logsUpdate(`[+1 Exp]`, "green");
         
         if(randDropMob < 0.9)
         {
            player.potion++;
            logsUpdate(`[+1 potion]`,"green");
         }
         
         mob[monsters].health = prevHealthMob + 1;
         player.experience    ++;
         player.attack        ++;
         //log.innerText        = "";
         
         screenData("","mob");
         conditions("idle");
      }
      else
      {
         player.health -= mob[monsters].attack;
         
         logsUpdate(`${mob[monsters].name} menyerang mu! point kerusakan sebesar ${mob[monsters].attack}`,"battle");
         playerUpdate();
         
         if(player.health <= 0)
         {
            logsUpdate(`\n ${mob[monsters].name} telah membunuh mu`, "battle");
            logsUpdate(`\n Game Over \n`, "over")
            conditions("over");
         }
         
      }
      conditions("idle");
      playerUpdate();
      log.scrollTop = log.scrollHeight;
   };
   heal.onclick   = function healPlayer()
   {
      let randHeal      = Math.floor(Math.random()*(10-1))+1;
      
      if(player.potion  > 0)
      {
         player.potion --;
         player.health += randHeal;
         
         logsUpdate(`[++] Kamu menggunakan kristal penyembuhan dan menambahkan kesehatan sebesar ${randHeal}.`,"green");
      }
      else
      {
         logsUpdate(`<b> \n Kamu tidak memiliki potion! sisa potion ${player.potion}.</b>`,"battle")
      }
      log.scrollTop     = log.scrollHeight;
   };
   run.onclick    = function runAway()
   {
      screenData("","mob");//Means Clear Screen.
      logsUpdate(`Dengan gerakan yang hebat, kamu berhasil melarikan diri dari ${mob[monsters].name}.`, "battle");
      conditions("idle");
   };
   
}

function explorers(){
   let route = Math.random();
   let cBattle = 0.6;
   let cRoom = 0.5;
   pathCount++;
   
   if(route >= cBattle && route < 0.7){
      conditions("danger")
   }else if(player.health <= 0){
      conditions("over")
   }else{
      conditions("idle");
   }
}

function screenData(data, type){
   
   switch(type){
      case "txt":
         screen.style.fontSize = "5rem";
         screen.style.color = "white"
         screen.innerText = data;
         break;
      case "mob":
        if(data == "")
        {
          monsterIcon.innerHTML= "";
          monsterStat.innerHTML= "";
        }
        else
        {
          monsterIcon.innerHTML = `<span>${data.icon}</span>`
          monsterStat.innerHTML = `<span>💟${data.health}</span>`
        }
         break;
      case "imgPath":
         screen.style.backgroundImage = `url('/img/background/${data}.jpg')`;
         break;
   }
}

function conditions(c){
   if(c == "idle"){
      start.style.display  = "none";
      heal.style.display   = "none";
      atk.style.display    = "none";
      run.style.display    = "none";
      
      conditionPath();
   }else if(c == "danger"){
      atk.style.display = "block";
      heal.style.display = "block";
      run.style.display = "block";
      
      exUp.style.display = "none";
      exLeft.style.display = "none";
      exRight.style.display = "none";
      battle();
   }else if(c == "over"){
      start.style.display = "block";
      
      atk.style.display = "none";
      heal.style.display = "none";
      run.style.display = "none";
      open.style.display = "none";
      exUp.style.display = "none";
      exLeft.style.display = "none";
      exRight.style.display = "none";
      
      //gameOver++;
   }
   
   log.scrollTop = log.scrollHeight;
   
}

function conditionPath(){
   var path = Math.floor(Math.random() * (4-1)) + 1;//1 jalur, 2 jalur, 3 jalur, ..
   // var randDoor = Math.random();
   randPath = Math.random();
   
   
   switch(path){
      case 1:
         if(randPath > 0.7){
            exUp.style.display = "block";
            exLeft.style.display = "none";
            exRight.style.display = "none";
            
            screenData("F0-0", "imgPath");
            logsUpdate(`\n Kamu berjalan di satu arah.`, "txt");
         }
         else if(randPath < 0.35 && randPath > 0.01)
         {
            exUp.style.display = "none";
            exLeft.style.display = "block";
            exRight.style.display = "none";
            
            screenData("F0-2","imgPath");
            logsUpdate(`Kamu menemukan ruangan di sebelah Kiri. `, "txt");
         }
         else if(randPath > 0.35 && randPath < 0.7)
         {
            exUp.style.display = "none";
            exLeft.style.display = "none";
            exRight.style.display = "block";
            
            screenData("F0-6", "imgPath");
            logsUpdate(`Kamu menemukan ruangan di sebelah Kanan.`, "txt");
         }
         break;
      case 2:
         if(randPath < 0.5 && randPath > 0.2)
         {
            exUp.style.display = "block";
            exLeft.style.display = "block";
            exRight.style.display = "none";
            
            screenData("F0-4", "imgPath");
            logsUpdate(`Kamu menemukan ruangan di sebelah Kiri.`, "txt")
         }
         else if(randPath > 0.5)
         {
            exUp.style.display = "block";
            exLeft.style.display = "none";
            exRight.style.display = "block";
            
            screenData("F0-9", "imgPath");
            logsUpdate(`Kamu menemukan ruangan di sebelah Kanan.`, "txt");
         }
         else if(randPath < 0.1)
         {
            exUp.style.display = "none";
            exLeft.style.display = "block";
            exRight.style.display = "block";
            
            screenData("F0-5", "imgPath");
            logsUpdate(`Kamu menemukan 2 jalur terpisah.`, "txt");
         }
         break;
      case 3:
         exUp.style.display = "block";
         exLeft.style.display = "block";
         exRight.style.display = "block";
         
         screenData("F0-3", "imgPath");
         logsUpdate(`Perempatan`, "txt");
         break;
   }
   
}

function playerUpdate(){
   hp.innerText = player.health;
   exp.innerText = player.exp;
   pot.innerText = player.potion;
   times.innerText = player.time;
   damage.innerText = player.attack;
   
   if(player.health <= 0){
      //log.innerHTML += `<p> \n ${mob[monsters].name} berhasil mengalahkan mu `;
      logsUpdate("Game Over","over");
   }
}

function logsUpdate(c, type){
   
   switch(type)
   {
      case "txt":
         log.innerHTML += `<p style="color: white;">> ${c} \n</p>`;
         break;
      case "over":
         log.innerHTML += `<b style="text-align:center; color:crimson;">${c}</b>`;
         break;
      case "green":
         log.innerHTML += `<i style="color:#00ee6d;">${c}</i>`;
         break;
      case "battle":
         log.innerHTML += `<p style='color:pink;'>[!] ${c}</p>`;
         break;
   }
}

window.onload = function opening (){
   conditions("over");
   
   start.onclick = function start(){

       // chatLog        = [];
       // battleLog      = [];
       // journeyLog     = [];
       log.innerText  = "";
       timeS   = 0;
       timeH   = 0;
       timeM   = 0;
       logsUpdate(`Kamu terbangun di sebuah ruangan yang tampak asing bagimu.`,"txt");
       logsUpdate(`Kamu melihat tas di samping mu dan setelah dibuka kamu menemukan sebuah pedang.`,"txt");
       logsUpdate(`[+5 Attack]`,"green");
       
       player.health = 10;

      conditions("idle");
      screenData("" , "mob")
      playerUpdate();
   }
};



var contOpt = document.querySelector(".contOption");
var btn = document.querySelector(".btn");
var num = 0;
btn.addEventListener("click", toogle)
function toogle(){
   if(num%2 == 1){
      btn.style.bottom = "50vh"
      contOpt.style.bottom = "-0vh"
   }else{
      
      btn.style.bottom = "0vh"
      contOpt.style.bottom = "-50vh"
   }
   num++
}
