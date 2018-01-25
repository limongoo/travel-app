import Template from '../Template';
import html from './app.html';
import './app.css';
import Header from '../header/Header';
import Home from '../home/Home';
import Footer from '../footer/Footer.js';

const template = new Template(html);

export default class App {

  render() {
    const dom = template.clone();   
      
    dom.querySelector('header').appendChild(new Header().render());
    dom.querySelector('main').appendChild(new Home().render());
    dom.querySelector('footer').appendChild(new Footer().render());

    return dom;
  }
}