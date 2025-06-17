
const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');

buttons.forEach((item) => {
  item.onclick = () => {
    if (item.id === 'c') {
      display.innerText = '';
    } else if (item.id === '<') {
      let string = display.innerText.toString();
      display.innerText = string.slice(0, -1); // backspace
    } else if (display.innerText !== '' && item.id === 'equal') {
      try {
        display.innerText = eval(display.innerText);
      } catch {
        display.innerText = 'Error';
      }
    } else if (item.id !== 'equal') {
      display.innerText += item.id;
    }
  };
});
