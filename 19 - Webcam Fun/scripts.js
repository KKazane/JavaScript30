const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
   .then(localMediaStream => {
     console.log(localMediaStream);
    //  video.src = window.URL.createObjectURL(localMediaStream);
    video.srcObject = localMediaStream;
     video.play();
   })
   .catch(err => {
     console.error(`OH NO!!`, err);
   });

}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // console.log(width, height);
  canvas.width = width;
  canvas.height = height;
  // webcamから16ミリ秒ごとくらいに画像を取得してcanvasに入れる
  // ctx.drawImage(image, sx, sy, sw, sh)で引数(sx, sy)は使用範囲の開始座標、引数(sw, sh)はその座標からの幅と高さを指す
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // pixelsを取り出す
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);
    // debugger;
    // pixelsを変える
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    pixels = greenScreen(pixels);
    // できたpixelsをアウトプットする
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // 音が出る
  snap.currentTime = 0;
  snap.play(); 

  // canvasからデータを取る
  const data = canvas.toDataURL('image/jpeg');
  // console.log(data); // 写真データの文字でのデータが出る
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'realWorld');
  // link.textContent = 'Download Image'; // 一枚ずつダウンロードされる
  link.innerHTML = `<img src="${data}" alt="RealWorld Photo" />`; // 写真が画面上に並び、選べる
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.lenght; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.lenght; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels);

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // 取り出す
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);