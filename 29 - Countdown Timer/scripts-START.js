let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now(); // 1970/1/1/0/0/0から現在までの経過時間をミリ秒で返す
  const then = now + seconds * 1000;
  // console.log({now, then});
  displayTimerLeft(seconds);
  displayEndTime(then); // 何時にタイマーが切れるか
 
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // console.log(secondsLeft);
    displayTimerLeft(secondsLeft);
  }, 1000);
}

function displayTimerLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
  document.title = display;
  // console.log(seconds);
  console.log({minutes, remainderSeconds});
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  // const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  // console.log(this);
  // console.log(this.dataset, this.dataset.time);
  const seconds = parseInt(this.dataset.time); // stringからnumberへ変換
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault(); // defaultの動作を止める
  const mins = this.minutes.value; // htmlのテキスト入力フォームのnameをminutesにしてるから
  // console.log(mins);
  timer(mins * 60);
  this.reset();
})