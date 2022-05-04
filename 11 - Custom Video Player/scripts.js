// get our elements
const player = document.querySelector('.player');
const video = document.querySelector('.viewer');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const toggle = document.querySelector('.toggle');
const skipButtons = document.querySelectorAll('[data-skip]');
const ranges = document.querySelectorAll('.player__slider');
const screenChange = document.querySelector('.screen__button');


// build out functions
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
  /*
  if (video.paused) {  // ►(player__button toggle)が停止状態だったら再生に、再生だったら停止に
    video.play();
  } else {
    video.pause();
  }
  */
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚'; // 停止してたらtrueの►
  console.log(icon);
  toggle.textContent = icon;
  // console.log('Update the button');
}

function skip() {
  // console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip); // parseFloat()は引数を解釈し浮動小数点値を返す
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  // console.log(this.name);
  // console.log(this.value);
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;  // elementでpropertiesを見るとwidthがわかる
  video.currentTime = scrubTime;
  console.log(e);
}

// 自学習 フルスクリーンボタンを追加
function changeScreen() {
  if(player.style.minWidth === `100%` && player.style.minHeight === `100vh`) {
    player.style.minWidth = null;
    player.style.minHeight = null;
  } else {
    player.style.minWidth = `100%`;
    player.style.minHeight = `100vh`;
  }
}


// hook up the event listners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
screenChange.addEventListener('click', changeScreen);