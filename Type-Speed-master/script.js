document.addEventListener('DOMContentLoaded', function (){
var i=0;  
var timer =0;  //to make sure timer initiates once
var backspace=1;
var green="";
var red="";
var temp;
var black="A worm hole can connect two different part of Universe but is a hypothetical concept.";
var text="A worm hole can connect two different part of Universe but is a hypothetical concept.";
var l=text.length;
var typed=document.querySelector('#type-area');
var result =document.querySelector('#result');

// three arrays are formed ;
// black contains the initial text and on correct input element gets removed and added to green
// red is used for incorrect characters

g=document.getElementById('green');
r=document.getElementById('red');
b=document.getElementById('black');

b.textContent=black;

typed.addEventListener('keydown',function(e){

if(!timer)
{
	// getting the starting time of character press
	startTimer = new Date();
	timer++;
}
if(e.key == 'CapsLock' || e.key == 'Shift')
{
  // preventing capslock and shift key to be accounted as character
  e.preventDefault();
}
else
{ 
// if a correct character is pressed cursor will move forward and will look for new text;
// if character is wrong it will not move more than one step
// untill the character is erased cursor will not take any input 


  if(backspace && e.key!='Backspace' )
    {
      if(e.key==text[i] )
  	  {
        green+=text[i];
        // removing a character from black
        black=black.slice(1,l);
        g.textContent=green;
        b.textContent=black;
		    backspace=1;//backspace prevented
        i++;

          if(i==text.length)
          {
        	  endTimer = new Date();
        	  const timeTaken = (endTimer.getTime() - startTimer.getTime()) / 1000;
        	  const speed= text.length/timeTaken;
            result.innerHTML= speed; 
          }
	    }
      else
      {
    	  backspace=0;
        black=black.slice(1,l);
        red=text[i];
        r.textContent=red;
        b.textContent=black;
      }
    }
  else
    {
	    if(e.key=='Backspace' && backspace==0)
	      {
      		backspace=1;
          black=red+black;
          red="";
          r.textContent=red;
      		b.textContent=black;
	      }
    	else 
	      {
		      e.preventDefault();
	      }
	  }
}

}



	)})