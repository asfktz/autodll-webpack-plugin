import 'font-awesome/css/font-awesome.css';
import other from './some/other/module';

export default () => {
  console.log(other);
  var rootElm = document.createElement('div');

  rootElm.innerHTML = `
    <h1>Test inherit</h1>
    <h2>Font Awesome <i class="fa fa-bath"></i></h2>
  `;

  return rootElm;
};

