//*** Résonance d'un pendule élastique de pulsation propre w0=2π rad/s. 
//*** méthode d'intégration : euler
//*** Pour la paramétrisation et la mise en équation voir cahier. 
// © J.Roussel 13/12/2021

// moteur
var rm;//rayon du disque moteur
var a;//amplitude de l'excentrique
var b;//rayon de la poulie
var c;//ditance excentrique-poulie
var theta;//angle de rotation de l'excentrique
var freq;//(fréquence en tours par seconde)
var L;//longueur du fil
var zC;//hauteur du point de fixation du ressort
//ressort 
var leq,l; //longueur à l'équilibre et à l'instant t du ressort 
var lambda;//coef d'amortissement
//------ intégrateur ----
var h;//pas temporel
var S=new Array(2);//vecteur d'état (S[0]=lt+zc et s[1]=dlt/dt+dzc/dt)
//------ graphe
var tmin, tmax;//range du graphe
let G=new Array();
let N;
//------ Pour le texte et les images ------
var FS1, FS2; //taille de police
// GUI
let sliderF;//slider pour régler la fréquence du moteur
let sliderLambda;//slider pour régler la fréquence du moteur
let stopButton;
let infoButton;
let info=false;
let stop=false;


function setup() {
  createCanvas(windowWidth,9*windowWidth/16);//on impose un format 16/9
  frameRate(50); // 50 frames per second
  h=.02;
  freq=.5;
  lambda=1;
  textFont('Helvetica');
  InitialiseMoteur();
  InitialiseString();
  InitialiseGraphe();
  //GUI
  sliderF = createSlider('.25', 4 , freq , '.05');
  sliderF.position(2*rm,9*rm);
  sliderF.input(changeFreq);
  sliderLambda = createSlider('.2', 2,lambda,'.05');
  sliderLambda.position(2*rm,17*rm);
  sliderLambda.input(changeLambda);
  infoButton=createButton("Infos");
  infoButton.mousePressed(toggleInfo);
  stopButton=createButton('ON/OFF');
  stopButton.style('background','#dcffdc');stopButton.style('color','#000');
  stopButton.mousePressed(toggleStop);
  saveButton=createButton("COPIE D'ÉCRAN");
  saveButton.mousePressed(toggleSave);
  infoButton.position(2*rm, 3*rm);
  stopButton.position(2*rm, 7*rm);
  saveButton.position(width/8, 3*rm);
}

function draw() {
  background(32);
  //freq=sliderF.value();
 // lambda=sliderLambda.value();
  Euler();
  displayGraphe(tmin,tmax);
  displayMoteur();
  if(!stop){
  theta+=TWO_PI*freq*h;}
  tmin+=h;
  tmax+=h;
  displayGUI();//affichage de la fenêtre de contrôles
  if (info) {displayInfo();}
}

function InitialiseMoteur(){
   FS1 = '.035' * height;
  FS2 = 16;
  rm='.02'*width;
  a='.5'*rm;
  b=a;
  c='.4'*width;
  L=c+4*rm;
  theta=HALF_PI;
}
function  InitialiseString(){
  leq=height/3;
  zC=a*cos(theta)+L-c-b*HALF_PI;
  S[0]=leq+zC;
  S[1]=0;
}
function InitialiseGraphe(){
  tmin=-20;
  tmax=2;
  N=-tmin/h;
  for (let i=0;i<N;i+=1){
    G[i]=S[0];
  }
}


//***** Intégrateur Euler explicite *****
function Euler() {
  S[0]+=h*S[1];
  S[1]+=h*(-2*lambda*S[1]-4*sq(PI)*(S[0]-leq-zC));
}

function displayGraphe(t1,t2){
  var x;
  noStroke();
  fill(220, 255, 220);
  rect(0,5*rm,width,height-10*rm);
  textAlign(LEFT, TOP);
  textSize(FS2);
  fill(128);
  for (let i=int(t1); i<=int(t2); i+=1) {
    stroke(192);strokeWeight(1);
    x=map(i,t1,t2,0,width);
    if(i%10==0){noStroke();text(i +" s",x+5,5*rm);strokeWeight(3);stroke(192);}
    line(x,5*rm,x,height-5*rm);
  }
  strokeWeight(1);
  line(0,leq+L-c-b*HALF_PI+1.5*rm,width,leq+L-c-b*HALF_PI+1.5*rm);
  for (let j=-15; j<=15; j++) {line(0,leq+L-c-b*HALF_PI+1.5*rm+j*a,width,leq+L-c-b*HALF_PI+1.5*rm+j*a);}
  G.splice(0,1);
  G.push(S[0]);
  stroke(51, 102, 153);noFill();
  beginShape();
  for (let j=0; j<=N; j++) {   
    vertex(map(j,0,N,0,width/2+c+b),G[j]+1.5*rm);
  }  
  endShape();
}


function displayMoteur() {
  var epsilon,xcontact,ycontact;//point de contact au niveau de la poulie
  var xA,yA;
  push();
  translate(width/2,1.5*rm);//origine au centre de la roue à excentrique
  stroke(200);fill(124);strokeWeight(1);
  rect(-5*rm,-1.5*rm,6.5*rm,3*rm);
  fill(255,255,255);
  circle(0,0,2*rm);
  push();
  rotate(-theta);
  fill(0);
  line(-rm,0,rm,0);
  circle(a,0,7);
  pop();
  strokeWeight(2);
  stroke(124);
  if(stop){fill(200);}else{fill(220, 255, 220);}
  rect(-'4.5'*rm, -'.75'*rm, 3*rm,1.5*rm);
  fill(51, 102, 153);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(FS2);
  text(nf(freq, 1, 2) +" Hz",-3*rm,0);
  //poulie
  translate(c,0);//origine au centre de la poulie
  epsilon=(-a*sin(theta)+b)/(c-a*cos(theta));
  fill(255);stroke(200);
  circle(0,0,2*b);
  line(-b,0,b,0);
  //calcul du contact avec la poulie
  xcontact=-b*sin(epsilon);
  ycontact=-b*cos(epsilon);
  xA=-c+a*cos(theta);
  yA=-a*sin(theta);
  //calcul de la position de l'extrémité C du fil
  zC=L-c-b*HALF_PI+ a*cos(theta);
  stroke(100);strokeWeight(2);
  line(xcontact,ycontact,xA,yA);
  arc(0,0,2*b,2*b,-HALF_PI-epsilon,0);
  line(b,0,b,zC);  
  ellipse(b,zC,4,4);
  displayRessort(b,zC,b,S[0]-zC,20);
  pop();
}


//représente un ressort de longueur lS dont l'extrémité haute se situe en (xS,yS)
function displayRessort(xS,yS,rayon,lS,Nspires){
  stroke(100);strokeWeight(2);fill(100);circle(xS,yS+lS,20);
  noFill();
  let thetamax=Nspires*TWO_PI;
  beginShape();
  for (let x=0; x<=thetamax; x+=.1) {   
    vertex(xS+rayon*sin(x),yS+(lS-20)*x/thetamax+.5*rayon*(1-cos(x)));
  }  
  endShape();
  line(xS,yS+lS,xS,yS+lS-20);
  stroke(51, 102, 153);strokeWeight(5);
  point(xS,yS+lS);
}


function displayInfo() {
  fill(0,180);
  push();
  translate(width/2, 0);
  rect(-width/4, 0, width/2, height);
  textSize(FS1);
  textAlign(CENTER, TOP);
  fill(255, 255);
  textLeading(FS1);
  text("PENDULE ÉLASTIQUE EN RÉGIME SINUSOÏDAL", 0, rm);
  fill(30, 134, 193);
  text("femto-physique.fr",0, 4*rm);
  fill(255);
  textSize(FS2);
  text("© Jimmy Roussel, 2022", 0, 3*rm);
  text("Un pendule élastique de fréquence propre fixée à 1 Hz\n est mis en oscillation forcée à l'aide d'un moteur à excentrique.\n L'équation différentielle du mouvement est du type \n X'' + 2\u03BB X'+ 4π^2 X = 4π^2 e(t)",0,7*rm)
  text("Interactions au clavier :\n  I pour afficher/cacher ces informations\n  P pour mettre en pause\n  O pour allumer/éteindre le moteur\n \S pour sauvegarder une image jpg", 0, 13*rm);
  pop();
}


function displayGUI() {
  fill(0,180);rect(0,0,width/4,height);
  textSize(FS1);
  fill(255);
  textAlign(LEFT, TOP);
  text("CONTROLES", 2*rm, rm);
  textSize(FS2);
  //textAlign(CENTER, CENTER);
  text('EXCITATION',2*rm,6*rm);
  text('Fréquence excitatrice\n f = '+nf(freq,1,2)+' Hz', sliderF.x, sliderF.y+rm);
  text('RESONATEUR',2*rm,13*rm);
  text('Fréquence de résonance\n f0 = 1.00 Hz', sliderF.x, 14*rm);
  text('Amortissement \u03BB = '+nf(lambda,1,2)+' Hz', sliderLambda.x, sliderLambda.y+rm);
}

function keyPressed() {
  if (key =='i' || key == 'I') {toggleInfo();}
  if (key =='s' || key == 'S') {toggleSave();}
  if (key =='p' || key == 'P') {noLoop();}
  if (key =='o' || key == 'O') {toggleStop();}
}
function toggleInfo() {info=!info;}
function toggleStop() {
  stop=!stop;
  if(stop){stopButton.style('background','#333');stopButton.style('color','#fff');}
  else{stopButton.style('background','#dcffdc');stopButton.style('color','#000');}
}
function toggleSave() {save('myCanvas.jpg');}
function changeFreq() {freq=sliderF.value();}
function changeLambda() {lambda=sliderLambda.value();}
function windowResized() {
  resizeCanvas(windowWidth, 9*windowWidth/16);
  InitialiseMoteur();
  InitialiseString();
  InitialiseGraphe();
  InitialiseGUI();
}

function keyReleased() {
  loop();
}
