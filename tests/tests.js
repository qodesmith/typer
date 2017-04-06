const div = document.querySelector('#test');
const image = `<img src="https://goo.gl/pjyWVe" style="width: 20px;border:2px solid black;">`;

function contentCheck(selector, contents, checkHTML) {
  const el = document.querySelector(selector);
  const text = el.textContent;
  const html = el.innerHTML;

  const textMatch = text === contents;
  const htmlMatch = html === contents;

  return checkHTML ? htmlMatch : textMatch;
}

typer('#test')
  .cursor()
  .line('Line 1', 1)
  .line(`Line 2${image}`, 1)
  // .back(0) - **FIX** THIS STOPS THE PROCESS FROM CONTINUING WITHOUT ANY ERRORS **FIX**
  .pause(1000)
  .back(2)
  .run((el) => {
    console.log('RUNNING TEST')
    const length = div.querySelectorAll('div').length;
    const text1 = contentCheck('#test div:nth-child(1)', 'Line 1');
    const text2 = contentCheck('#test div:nth-child(2)', 'Line 2');
    const html1 = contentCheck('#test div:nth-child(1)', 'Line 1', true);
    const html2 = contentCheck('#test div:nth-child(2)', 'Line 2<br>', true);


    console.log('Should contain 2 divs:', length === 2);
    console.log('1st div text check:', text1);
    console.log('1st div html check:', html1);
    console.log('2nd div text check:', text2);
    console.log('2nd div html check:', html2);
  });
