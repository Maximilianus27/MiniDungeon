//Get elements
var hp = document.querySelector(".healthIndex"),
    exp = document.querySelector(".expIndex"),
    pot = document.querySelector(".potionIndex"),
    damage = document.querySelector(".damageIndex"),
    status = document.querySelector(".params"),
    log = document.querySelector(".logs")
    
//Button Element
var atk = document.querySelector(".atk");
var start = document.querySelector(".start");
var run = document.querySelector(".run");
var heal = document.querySelector(".heal");
var exUp = document.querySelector(".up");
var exLeft = document.querySelector(".left");
var exRight= document.querySelector(".right");
var open = document.querySelector(".open");
    
//Player default
const player = {
  health : 10,
  power: 25,
  attack: 5,
  experience: 0,
  potion: 0
}

//Monster Default
const mob = [
   {
      name: "Rat",
      health : 5,
      attack: 3
   },
   {
      name: "Lucas",
      health : 7,
      attack: 1
   },
   {
      name: "Lu",
      health : 10,
      attack: 2
   },
   {
      name: "King Rat",
      health : 10,
      attack: 8
   }
]

//Dungeon Room
const  rooms = [
   {
      floor: "A1",
      key: false
   }
]

var condition = "idle";
var isDoor = 0.78; //random == find Door = ++path
var pathCount = 0;
var gameOver = 0;
var randDropMob;
var prevHealthMob;
var randPath;
var path;
var randDoor;

exUp.addEventListener("click", explorers);
exLeft.addEventListener("click", explorers);
exRight.addEventListener("click", explorers);
open.addEventListener("click", explorers);

function battle(){
   if(player.health <= 0){
      log.innerHTML += `<p> \n ${mob[monsters].name} berhasil mengalahkan mu `;
      log.innerHTML += `<p> \n Game Over \n`
      conditions("over");
   }
   
   monsters = Math.floor(Math.random()*mob.length);
   log.innerHTML += `<p> \n Kamu bertemu dengan monster ${mob[monsters].name}`;
   log.innerHTML += `<p> \n ${mob[monsters].name} \nHealth : ${mob[monsters].health} \n`;
   prevHealthMob = mob[monsters].health;
   conditions();
   
   run.onclick = function runAway(){
      conditions("idle")
      log.innerText += "Berhasil melarikan diri."
      
   };
   
   atk.onclick = function attackPlayer(){
      let randDmgPlayer = Math.floor(Math.random() * (player.attack - 1)) + 1;
      randDropMob = Math.random();
      mob[monsters].health -= randDmgPlayer;
      log.innerHTML += `<p> \n Kamu menyerang monster ${mob[monsters].name} dengan point kerusakan sebesar ${randDmgPlayer}`;
      log.innerHTML += `<p> \n ${mob[monsters].name} \nHealth : ${mob[monsters].health} \n`;
      
      if(mob[monsters].health <= 0){
         log.innerHTML += `<p> \n Kamu berhasil mengalahkan monster ${mob[monsters].name} \n`;
         log.innerHTML += `<p> \n [+1 Attack]; \n`;
         
         if(randDropMob < 0.9){
            player.potion++;
            log.innerHTML += `<p> \n [+1 potion]; \n`;
         }
         
         mob[monsters].health = prevHealthMob + 1;
         
         player.attack ++;
         conditions("idle");
      }else{
         player.health -= mob[monsters].attack;
         log.innerHTML += `<p> \n ${mob[monsters].name} menyerang mu dengan point kerusakan sebesar ${mob[monsters].attack} \n`;
         hp.innerText = `${player.health}`;
         
         if(player.health <= 0){
            log.innerHTML += `<p> \n ${mob[monsters].name} berhasil mengalahkan mu `;
         }
         
         playerUpdate();
      }
      log.scrollTop = log.scrollHeight;
   };
   
   heal.onclick = function healPlayer(){
      let randHeal = Math.floor(Math.random()*(10-1))+1;
      
      if(player.potion > 0){
         log.innerHTML += `<p style="background:lightpink"> \n Kamu meminum potion dan menambahkan kesehatan sebesar ${randHeal}, sisa potion ${player.potion}. \n </p>`
         player.health += randHeal;
         player.potion --;
      }else{
         log.innerHTML += `<p style="background:crimson"> \n Kamu tidak memiliki potion! sisa potion ${player.potion}. \n </p>`
      }
      log.scrollTop = log.scrollHeight;
   }
   
   
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

function conditions(c){
   if(c == "idle"){
      atk.style.display = "none";
      heal.style.display = "none";
      run.style.display = "none";
      
      start.style.display = "none";
      
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
      
      gameOver++;
   }
   
   log.scrollTop = log.scrollHeight;
   
}

function conditionPath(){
   var path = Math.floor(Math.random() * (3-1)) + 1;//1 jalur, 2 jalur, 3 jalur, ..
   // var randDoor = Math.random();
   randPath = Math.random();
   
   
   switch(path){
      case 1:
         exUp.style.display = "block";
         exLeft.style.display = "none";
         exRight.style.display = "none";
         log.innerHTML += `<p> \n ↑ Kamu berjalan si satu arah. \n`
         break;
      case 2:
         if(randPath < 0.5 && randPath > 0.2){
            exUp.style.display = "block";
            exLeft.style.display = "block";
            exRight.style.display = "none";
            
            log.innerHTML += `<p> \n ←↑ Kamu menemukan ruangan di sebelah Kiri. \n`
         }else if(randPath > 0.5){
            exUp.style.display = "block";
            exLeft.style.display = "none";
            exRight.style.display = "block";
            
            log.innerHTML += `<p> \n ↑→ Kamu menemukan ruangan di sebelah Kanan. \n`
         }else if(randPath < 0.2){
            exUp.style.display = "block";
            exLeft.style.display = "block";
            exRight.style.display = "block";
            
            log.innerHTML += `<p> \n ←↑→Kamu menemukan 2 jalur terpisah. \n`
         }
         break;
   }
   
}

function playerUpdate(){
   hp.innerText = player.health;
   exp.innerText = player.experience;
   pot.innerText = player.potion;
   damage.innerText = player.attack;
   
   if(player.health <= 0){
      //log.innerHTML += `<p> \n ${mob[monsters].name} berhasil mengalahkan mu `;
      log.innerHTML += `<p> \n \t\t GAME OVER \n`;
      conditions("over");
   }
}

window.onload = function opening (){
   conditions("over");
   log.innerHTML += `<p> \n Kamu terbangun di sebuah ruangan yang tampak asing bagimu.
                     \nKamu melihat tas di samping mu dan setelah dibuka kamu menemukan sebuah pedang.
                     \n[+5 Attack]\n`
   
   start.onclick = function start(){
      
      if(gameOver > 0){
         log.innerText = "";
         opening();
         
         player.health = 10;
      }
      conditions("idle");
      playerUpdate();
   }
};