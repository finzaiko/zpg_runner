const _startTime = new Date();

const startLoading = (text) => {
  let frames = [text, `${text}.`, `${text}..`, `${text}...`, `${text}....`];
  let i = 0;
  const tmr = setInterval(() => {
    const fr = frames[i++ % frames.length];
    process.stdout.write(`\r${fr}`);
  }, 200);
  return tmr;
};

const stopLoading = (tmr, textDone) => {
  setTimeout(() => {
    clearInterval(tmr);
    const endTime = new Date() - _startTime;
    console.log(
      `\r${textDone}.... ${_millisToMinutesAndSeconds(endTime)} [done]`
    );
  }, 3500);
};

const _millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  if (minutes > 0) {
    return minutes + "m" + (seconds < 10 ? "0" : "") + seconds + "s";
  } else {
    return (seconds < 10 ? "0" : "") + seconds + "s";
  }
};

module.exports = {
  startLoading,
  stopLoading,
};
