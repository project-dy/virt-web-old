/**
 * @license
 * Copyright (C) 2023 noneinfo01
 * SPDX-License-Identifier: GPL-2.0
 */

import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/switch/switch.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

fetch('/api/list').then((response) => {
  return response.json();
}).then((data) => {
  console.log(data);
  const list = document.createElement('md-list');
  data.forEach((vm) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <md-list-item>
        <md-checkbox></md-checkbox>
        <span>${vm.id}</span>
        <span>${vm.state}</span>
        <span>${vm.status}</span>
        <md-switch></md-switch>
      </md-list-item>
    `;
    list.appendChild(div);
  });
  console.log(list);
  document.getElementById('info').appendChild(list);
});