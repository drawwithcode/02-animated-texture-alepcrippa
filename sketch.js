let angle=3.31;
let W,H;
let k=2;
let w;
let change=1; //to change the shape of the fractal
let tex=1; //to show the text
const MAX_ITER = 100;
let title; //text
let description; //text
const colorsRed = [];
const colorsGreen = [];
const colorsBlue = [];

function setup() {
  // frameRate(20);
  pixelDensity(1);
  createCanvas(windowWidth,windowHeight)
  colorMode(HSB, 1);
  W=floor(width/k);
  H=floor(height/k);

// Creating the colors
  for (let n = 0; n < MAX_ITER; n++) {
    let hu = sqrt(n / MAX_ITER);
    let col = color(hu, 255, 150);
    colorsRed[n] = red(col);
    colorsGreen[n] = green(col);
    colorsBlue[n] = blue(col);
  }

//zoom slider
  let zoom = createDiv('<h2>zoom</h2>');
      zoom.style('color', 'SpringGreen')
      zoom.position(width - width/6, height / 2);
      zoom.size(width/6 / 3);

      zoomSlider = createSlider(1.5, 5, 4, 1);
      zoomSlider.size(width/ 6/3);
      // repeatSlider.position(width - wUnit, height / 2)
      zoomSlider.parent(zoom);

//repeat slider
  let repeat = createDiv('<h2>repeat</h2>');
      repeat.style('color', 'SpringGreen')
      repeat.position(width - width/6, height / 2 + 80);
      repeat.size(width/6 / 3);

      repeatSlider = createSlider(1, 5, 1, 1);
      repeatSlider.size(width/ 6/3);
      // repeatSlider.position(width - wUnit, height / 2)
      repeatSlider.parent(repeat);

}

function draw() {
background(0)
w=zoomSlider.value(); // A different range will allow us to "zoom" in or out on the fractal
k=repeatSlider.value();
W=floor(width/k);
H=floor(height/k);

if (change==1)
angle=map(pmouseX+pmouseY,0,width+height,1.6,4);

for (let i=0; i<k; i++)
  for (let j=0; j<k; j++)
    juliaSet(i,j);
// juliaSet(0,0)
// angle += 0.02


//text
if (tex==1){
  textSize(40);
  stroke("white")
  fill("fuchsia")
  text("2020: 45th anniversary of Mandelbrot fractals!", 60,60,500,500);

  textSize(20)
  fill("SpringGreen");
  strokeWeight(0)
  textStyle(NORMAL);
  text('Move your mouse to change the shape and click to fix it',60, 200,400,500)
  }
}


function juliaSet(iter_x, iter_y){ //set of z_0 such that z_(k+1)=(z_k)^2+c is bounded, for c fixed
  let rho=0.7885;
  let ca = rho*cos(angle * 1);//real part of the new z
  let cb = rho*sin(angle);  //imaginary part of the new z

  // Establish a range of values on the complex plane

  //w is above
  let h = (w * height) / width;
  let xmin = -w / 2;
  let ymin = -h / 2;

  loadPixels();

  // x goes from xmin to xmax
  let xmax = xmin + w;
  // y goes from ymin to ymax
  let ymax = ymin + h;

  // amount we increment x,y for each pixel
  let dx = (xmax - xmin) / W;
  let dy = (ymax - ymin) / H;

  // Start y
  let y = ymin;
  for (let j = 0+H*iter_y; j < H+H*iter_y; j++) { //along y-axis
    // Start x
    let x = xmin;
    for (let i = 0+W*iter_x; i < W+W*iter_x; i++) { //along x-axis
      // Now we test, as we iterate z = z^2 + c, is z bounded? (absolute value < 2)
      let a = x;
      let b = y;
      let n = 0; //number of iterations to get absolute value of z_k > 2, for each pixel
      while (n < MAX_ITER) {
        let aa = a * a;
        let bb = b * b;
        if (aa + bb > 4.0) { // abslute value < 2
          break;
        }
        let twoab = 2.0 * a * b;
        a = aa - bb + ca;
        b = twoab + cb;
        n++;
      }

      // We color each pixel based on how many iterations it takes to have absolute value > 2
      let pix = (i + j * width) * 4;
      if (n == MAX_ITER) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
      } else if (n>MAX_ITER/10) {
        pixels[pix + 0] = colorsRed[n];
        pixels[pix + 1] = colorsGreen[n];
        pixels[pix + 2] = colorsBlue[n];
      } else {
        pixels[pix +0] = 0;
        pixels[pix +1] = 0;
        pixels[pix +2] = 0;
      }
      x += dx;
    }
    y += dy;
  }
  updatePixels();
}

function mouseClicked(){ // remove text and fix the angle if mouse is clicked
  if (change==1) change=0;
  else if (change==0) change=1;
  tex=0;
}
