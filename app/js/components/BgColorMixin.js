import React from 'react';
import $ from 'jquery';

const BgColorMixin = {
  colorClass: 'yf-bg-gray',

  componentDidMount() {
    $('body').addClass(this.colorClass);
  },

  componentWillUnmount() {
    $('body').removeClass(this.colorClass);
  },

  addBgColor() {
	$('body').addClass(this.colorClass);
  },

  removeBgColor() {
  	$('body').removeClass(this.colorClass);
  },
}

export default BgColorMixin;