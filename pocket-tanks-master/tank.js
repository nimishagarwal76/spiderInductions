document.addEventListener('DOMContentLoaded', function (){
var chanceLeft= 1;
var canvas= document.querySelector('canvas');
var c = canvas.getContext("2d");
var anime = 0, bx, by, g = 0.15, pow = 0.75, ang = Math.PI/3;
// setting up canvas width and height
canvas.width= window.innerWidth;
canvas.height= window.innerHeight*0.85;
var l = canvas.width;
// using equation of motion for trajectory to make power value independent of screen size
var muzzle = -Math.sqrt((g * l * l) / (2 * Math.cos(ang) * Math.cos(ang) * (l * Math.tan(ang)-3 * canvas.height / 10)));
var b;
var dx = muzzle * Math.cos(ang) * pow;
var dy = -muzzle * Math.sin(ang) * pow;
var reference = dy;
var pause = 0;
var weapon;



// reloading if screen is resized
window.addEventListener('resize',function(e){
  document.location.reload();

})


// displacement per animation frame
var dx;
var dy = -muzzle * Math.sin(ang) * pow;
var reference = dy;






////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//generating of terrain procedural programming

var base = canvas.height*0.75;// minimum line from which terrain should start
var roughness =  0.4;
var iterations =  5;
var p;
var points =  [];

var Point =  function(x,y)
 {
  this.x =  x;
  this.y =  y;

}
var midpoint =  function(p1, p2) 
  {
	return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }

function generatePoints(width) 
{
  var displacement = 250;//mxm height of mountain to be displaced above base line
  points =  [];
  var temp =  [];
  points[0] =  new Point(0, 0 + base);
  points[1] =  new Point(width, 0 + base);

  for(var i =  0; i < iterations; i++) 
  {
    temp =  [];
    for(var j =  0; j < points.length - 1; j++)
     {
      var p1 =  points[j];
      var p2 =  points[j+1];
      var mid =  midpoint(p1, p2);
      if(mid.x > canvas.width / 3 && mid.x < canvas.width * 0.66)
      {
        mid.y += randomInRange( -displacement, -displacement / 2);
      }
      else
      {
        mid.y += randomInRange(-displacement / 10, -displacement / 25);}
        temp.push(p1, mid);
      }
      temp.push(points[points.length - 1]);
      displacement *=  roughness;
      points =  temp;
	}

  return points;
}

var  len =  points.length;
function main() {
   p =  generatePoints(l);
    len =  points.length;
}




function randomInRange(min,max)
{
  	var r =  Math.floor(Math.random()*(max-min))+min; 
    return r;
}

main();
// array containing boundary of mountain points
var mountain =  [];
var t = 0;

for(var i =  1; i < len; i++) 
  {    
    var m= (points[i].y-points[i-1].y)/(points[i].x-points[i-1].x);
     t= 0;
     for(var j= points[i-1].x; j < points[i].x; ++j)
     {
     temp= new Point(Math.floor(j),Math.floor(points[i-1].y+m*(t++)));
      mountain.push(temp);
     }
     
  
     
  }
mountain.push(points[len-1]);
   var cols =  canvas.width;
   var rows =  canvas.height;


function modifyTerrain()
{
    for ( var i =  0; i < cols; i++ ) 
    {
      c.beginPath();
      c.fillStyle =  "green";
      c.fillRect(i,Math.floor(mountain[i].y),1,800);
      c.closePath();            
    }
}

modifyTerrain();
// for(i= 0;i<mountain.length;++i)
// {
//      c.beginPath();
// c.fillStyle =  "black";
// console.log(Math.floor(mountain[i].x));
// c.fillRect(i,Math.floor(mountain[i].y),1,1);
//  c.closePath();
// }
   


function tankPosition(t)
{
  var temp;
  temp.a= t.a;
  temp.b= mountain[t.a].y;

}

var score;
// object declaration
lefttank= {a:window.innerWidth*0.1, b:mountain[Math.floor(window.innerWidth*0.1)].y, angle:Math.PI/3,power:pow,score:0,bullets:10,weapon:"bullet"};
righttank= {a:window.innerWidth*0.9,b:mountain[Math.floor(window.innerWidth*0.1)].y,angle:2*Math.PI/3,power:pow,score:0,bullets:10,weapon:"bullet"};

var tankLength= 10;

var img =  new Image();
img.src="tankydf.png";

function drawTank(t)
{
  c.beginPath();
  var a =  t.a;
  var b =  t.b - 20;
  c.moveTo(t.a,t.b - 20);
  c.lineTo(t.a+30*Math.cos(t.angle),t.b-20-30*Math.sin(t.angle));
  c.strokeStyle= "rgba(" +[0,0,0,0.5].join(',')+")";
  c.stroke();
  c.fillRect(a,b,tankLength,tankLength);
// sprites added

  if(!img.complete)
  {
    // checking if image is completely loaded
    setTimeout(function()
    {
      drawTank(t);
    },10)
  }
  
    c.drawImage(img, a, b,10,10);
    


}
drawTank(lefttank);
drawTank(righttank);

function drawBullet(x,y)
{
    c.beginPath();
    if(weapon == "bullet")
    {
      c.fillStyle = "gold";
      radius = 5;
    }
    else
    {
      c.fillStyle = "grey";
      radius = 10;
    }
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
}


function result(){
 anime = 0;
        if(lefttank.score > righttank.score)
        {
          window.alert("GAME OVER \n Lefttank WINS!");
        }
         else if(lefttank.score < righttank.score)
        {
          window.alert("GAME OVER \n Righttank WINS!");
        }
        else if(lefttank.score == righttank.score)
        {
          window.alert("GAME OVER \n TIE!");
        }
        window.location.reload();


}


/////////////////////////////////////////////////////////////


// to print score on screen
function score()
{
  c.font =  "20px Arial";
  c.fillStyle = "black"; 
  c.fillText(lefttank.score,canvas.width / 30,canvas.height / 20);
  c.fillText(righttank.score,27 * canvas.width / 30,canvas.height / 20);

  c.fillStyle = "red";
  c.fillText(lefttank.bullets,canvas.width / 30,canvas.height / 10);
  c.fillText(righttank.bullets,27 * canvas.width / 30,canvas.height / 10);
  
}

score();




//firing of bullet
function fire(tank)
{
    bx = tank.a + 30 * Math.cos(tank.angle);
    by = tank.b - 30 * Math.sin(tank.angle)-20;
    animateBullet();
}


function animateBullet()
{
   if(!pause)
   {
    var collide= 0;
    if(anime)
    {
      c.clearRect(0,0,canvas.width,canvas.height);
      
      if(by + 10 > mountain[Math.floor(bx)].y)
      {
        collide= 1;
        anime= 0;
        var collidex= Math.floor(bx);
        var collidey= Math.floor(by)+10;

        // motion of tank downwards on destruction of terrain
        if(chanceLeft)
         {

           var min= mountain[Math.floor(lefttank.a)].y;
           var start= Math.floor(lefttank.a);
           console.log(start);
            for(i= start;i<start+10;++i)
            {
              console.log(mountain[i].y);
              if(mountain[i].y>min)
              {
                min= mountain[i].y;
              }
            }
//             console.log("min",min);
            lefttank.b= min;

         }
         else
         {
            var min= mountain[Math.floor(righttank.a)].y;
           var start= Math.floor(righttank.a);

            for(i= start;i<start+10;++i)
            {
              console.log(mountain[i].y);
                 if(mountain[i].y>min)
              {
                min= mountain[i].y;
              }              
            }
            console.log("min",min);
            righttank.b= min;
         }

        // scoring on the basis of damage
        var damageRadius;
        if(weapon=="bullet")
        {
          damageRadius=10;
        }
        else
        {
          damageRadius=20;
        }
        for(i = 0; i <= 2 * Math.PI; i = i + 2 * Math.PI / 180)
        {
         if(Math.floor(collidex+damageRadius*Math.cos(i))>0 && Math.floor(collidex+damageRadius*Math.cos(i))<canvas.width && collidey+damageRadius*Math.sin(i)>mountain[Math.floor(collidex+damageRadius*Math.cos(i))].y  )
         {
           mountain[Math.floor(collidex+damageRadius*Math.cos(i))].y= collidey+damageRadius*Math.sin(i);
         }
        }


        var distancel= (collidey-righttank.b)*(collidey-righttank.b)+(collidex-righttank.a)*(collidex-righttank.a);
        var distancer= (collidey-lefttank.b)*(collidey-lefttank.b)+(collidex-lefttank.a)*(collidex-lefttank.a);
        if(collide && !chanceLeft && (distancel)<1600)
         {
           anime = 0;
           if(weapon=="bullet" && distancel<400)
           {
             lefttank.score += Math.floor(200 - distancel / 2);
           }
           else if(weapon=="bomb")
           {
             lefttank.score += Math.floor(100 - distancel / 16);
           }
           collide= 0;
         }
        else if(collide && chanceLeft && (distancer) < 1600)
         {
           anime = 0;
           if(weapon=="bullet" && distancer<400)
           {
             righttank.score += Math.floor(200 - distancer / 2);
           }
           else if(weapon=="bomb")
           {
             righttank.score += Math.floor(100 - distancer / 16);
           }
           collide = 0;
         }


    }
  
    bx += dx;
    by += dy;
    dy += g;
    if(anime)
    {
      drawBullet(bx, by);
    }
    drawAll();

    if(bx > canvas.width || bx < 0 || by > canvas.height)
    {
        anime = 0;
    }
	requestAnimationFrame(animateBullet);
    }



     if(!righttank.bullets && !anime && !collide)//bullets finished
      {
        setTimeout(result,500); 
      }

 }
    else
    {
      requestAnimationFrame(animateBullet);
    }
  score();

}

function drawAll(){
   modifyTerrain();
    drawTank(lefttank);
    drawTank(righttank);
    score();
}

/////////////////////////////////////////////////////////////



// queryselector of buttons
var fireBtn= document.querySelector('#firebtn');

var angleBtn = document.querySelector('#anglebtn');
var angleMenu = document.querySelector('#angle');
var angleValue = document.querySelector("#inputangle");
var tickangle = document.querySelector('#anglesave');

var powerBtn = document.querySelector('#powerbtn');
var powerMenu = document.querySelector('#power');
var powerValue = document.querySelector("#inputpower");
var tickpower = document.querySelector('#powersave');

var controlMenu = document.querySelector('#control');

var pauseBtn = document.querySelector('#pause');
var playBtn = document.querySelector('#play');
var restartBtn = document.querySelector('#restart');

var instructionBtn=document.querySelector('#instruction');



instructionBtn.addEventListener('click',function(e){
  window.alert("Each player will get 10 projectiles to shoot.\nA player can select either of two projectile\n\n BOMB:Range of damage is higher but damage is average\n BULLET:Range of damage is lower but damage is high");
})

pauseBtn.addEventListener('click',function(e)
{
  pause ^= 1; //toggling pause
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";

})

playBtn.addEventListener('click',function(e)
{
  pause ^= 1; //toggling pause
  pauseBtn.style.display = "inline-block";
  playBtn.style.display = "none";

})

restartBtn.addEventListener('click',function(e){
  
  document.location.reload();

  
})

//initial checking of radio button
document.getElementById('bullet').checked="checked";

// starting animation on clicking fire btn fire(tank)
fireBtn.addEventListener('click',function(e){ 
  if(pause)
  {
    window.alert("GAME IS PAUSED");
  }
  if(!pause && !anime)
  {
    if(chanceLeft)
    {
      // taking a component of velocity
      dx= -muzzle * Math.cos(lefttank.angle)*lefttank.power;
      //initial y component
      reference = muzzle * Math.sin(lefttank.angle) * lefttank.power;
      dy = reference;
      anime = 1;    
      lefttank.bullets--; 
      //keeping an option in weapons checked
      if (document.getElementById('bullet').checked)
      {
        lefttank.weapon = document.getElementById('bullet').value;
      }
      else if (document.getElementById('bomb').checked) 
      {
        lefttank.weapon = document.getElementById('bomb').value;
      }
      weapon=lefttank.weapon;
      fire(lefttank);
      chanceLeft = 0;
     }
    else
    {
      dx = -muzzle * Math.cos(righttank.angle) * righttank.power;
      reference = muzzle * Math.sin(righttank.angle) * righttank.power;
      dy = reference;
      anime = 1;
      righttank.bullets--;
       if (document.getElementById('bullet').checked)
      {
        righttank.weapon = document.getElementById('bullet').value;
      }
      else if (document.getElementById('bomb').checked) 
      {
        righttank.weapon = document.getElementById('bomb').value;
      }
      weapon=righttank.weapon;
      fire(righttank);
      chanceLeft = 1;    
    }

  }

})


// anglebutton to adjust power
angleBtn.addEventListener('click',function(e)
{
  if(!anime && !pause)
  {
    angleMenu.style.display = 'block';
    controlMenu.style.display = 'none';


    if(chanceLeft)
    {
      angleValue.value = Math.ceil(lefttank.angle * 180 / Math.PI);
   
    }
    else
    {
      angleValue.value = Math.ceil(righttank.angle * 180 / Math.PI);
    }
  }

})

// powerbutton to adjust power
powerBtn.addEventListener('click',function(e)
{
  if(!anime && !pause)
 {
    powerMenu.style.display = 'block';
    controlMenu.style.display = 'none';
    if(chanceLeft)
    {
      powerValue.value = lefttank.power * 100;
    }
    else
    {
      powerValue.value = righttank.power * 100;
    }
 }

})


// tickangle btn to save angle for a tank
tickangle.addEventListener('click',function(e){
  ang = angleValue.value * Math.PI / 180;
  if(chanceLeft)
  {
    lefttank.angle = ang;
  }
  else
  {
    righttank.angle = ang;
  }
  angleMenu.style.display= 'none';
  control.style.display= 'block';

})

// tickbutton to save power
tickpower.addEventListener('click',function(e){
  pow = powerValue.value / 100;
  if(chanceLeft)
  {
    lefttank.power = pow;
  }
  else
  {
    righttank.power = pow;
  }
  powerMenu.style.display = 'none';
  control.style.display = 'block';


})




})

























