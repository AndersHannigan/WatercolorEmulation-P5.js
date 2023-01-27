let noiseOffset = 0;
let colors = []
let rad = 0;
let deviate = 800

// Toggle complete random scatter mode
let randScatter = 1

//PICK COLOURPALLETE
let colorpal = 2
//Polygon number of sides
let nVertices = 8;
//Polygon subdevisions on each side
let nbetween = 4
//random length of each side
let rlength = 50
//Random placement of brush around origin
let rplacement = 100
//Number of brushstrokes per color (Lower is more)
let nStrokes = 50
//Number of polygons per brushstroke
let nBrush = 100
//Opacity of the brushes, higher == More intense colors
let opacity = 5


//NOISE TEXTURE
let noiseTextureSize = 1
let noiseOpacity = 10
///LINE TEXTURE:
lineTexturecolor = 255
let textureOpacity1 = 5 
let textureOpacity2 = 10 
let nTextureLines = 10000
let textureLength1 = 50
let textureLength2 = 100

function setup() {

createCanvas(1000, 600);
angleMode(DEGREES);
nbetween +=1
noLoop()

noStroke()
  let color1 = color(0)
  let color2 = color(0)
  let color3 = color(0)
  let color4 = color(0)
  let color5 = color(0)
if (colorpal == 1){ //Earthy forest
  background("#D3EBB8")
  color1 = color("#61764B")
  color2 = color("#9BA17B")
  color3 = color("#CFB997")
  color4 = color("#FAD6A5")
  color5 = color("#EAC27E")
} else if (colorpal == 2){ //Purple sky
  background("#DEE9FF")
  color1 = color("#B1B2FF")
  color2 = color("#AAC4FF")
  color3 = color("#EFCBFF")
  color4 = color("#C0CBFF")
  color5 = color("#BCF2F6")
} 


colors = [color1,color2,color3,color4,color5];

}


function draw() {  
//RANDOM SCATTER MODE---------------------
if (randScatter == 1){
  background("white")
  nBrush = 10;
  opacity = 5;
        for (let y = 0; y<colors.length;y++){
      for (let x = 0; x<nStrokes; x++){

          let xPlace = random(width)
          let yPlace = random(height)
          for (let i = 0; i<nBrush; i++){

            colors[y].setAlpha(opacity)

            
            rad = rad+(70/nBrush)
            fill(colors[y])
            brush(xPlace,yPlace,rad, nVertices, nbetween, rlength)
            }
        rad = 0;
      }
    }
  
} else{ 
//SCATTER ALONG NOISE CURVES MODE---------------------
push()
    for (let y = 0; y<colors.length ; y++){
      noiseOffset=0
      let xoff = random(-50,50)
      for (let x = -width; x<width+500; x+=nStrokes){
          let xPlace = x+xoff
          let yPlace = noise(noiseOffset)*deviate + (y*(height/colors.length))+y*60-80
        //Tegn brushstrokes basert på hvor mange polygons per punkt
              for (let i = 0; i<nBrush; i++){

                colors[y].setAlpha(opacity)
                rad = rad+(70/nBrush)
                fill(colors[y])
                brush(xPlace,yPlace,rad, nVertices, nbetween, rlength)

                }
        noiseOffset+=0.8005
        rad = 0;
      }
    }
pop()
    }


//TEXTURE LINE GRAINS------------------
let strokeColor = color(lineTexturecolor)
for(let i = 0; i<nTextureLines;i++){
    push()
    blendMode(OVERLAY)
    strokeColor.setAlpha(random(textureOpacity1,textureOpacity2))
    stroke(strokeColor)
    translate(random(0,width), random(-100,height+100))
    let v = p5.Vector.fromAngle(radians(random(80,100)))
    v.setMag(random(textureLength1,textureLength2))
    line(0,0, v.x,v.y)
    pop()
}

//NOISE TEXTURE OVERLAY------------------
 for(let x = 0; x<width; x+= noiseTextureSize ){
  for (let y = 0; y<height; y+=noiseTextureSize){
    push()
    let graincolor = color(random(255))
    graincolor.setAlpha(noiseOpacity)
    stroke(graincolor)
    strokeWeight(noiseTextureSize)
    point(x,y)
    pop()
  }
}
}


// BRUSH FUNCTION ------------------
function brush(x, y, rad, nVertices, nbetween, rlength){
push()
translate(random(rplacement)+x,random(rplacement)+y)
let incr = 360/nVertices;
let k1,k2;
let pcos, psin;
let ccos, csin;
beginShape()
for (let i = 0; i<=360; i += incr){
  if (i<1){
    vertex(cos(i)*rad,sin(i)*rad)
    pcos = cos(i)*rad
    psin = sin(i)*rad
  } else{ 
    for (let a = 1; a < nbetween; a++){ 
      ccos = cos(i)*rad
      csin = sin(i)*rad
      k1 = (ccos - pcos)/nbetween
      k2 = (csin - psin)/nbetween
      let rlength2 = randomGaussian(rlength,rlength/5)

      let v1 = p5.Vector.fromAngle(radians((i-incr/2)+random(nbetween*5)), rlength2)
      vertex((pcos + k1*a)+v1.x, (psin + k2*a)+v1.y)
    }
    vertex(cos(i)*rad,sin(i)*rad)
    pcos = cos(i)*rad
    psin = sin(i)*rad
  }
}
endShape()
pop()
}