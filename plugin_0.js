//https://github.com/vecta-io/plugins/blob/main/plugin_0.js
// console.log('Hello world');

var shape = Vecta.activePage.drawRect(50, 50, 800, 100);

shape.fill('#66ccff');
shape.text('Hello ' +  $.doc().creator() + '!');
shape.fontSize(60);