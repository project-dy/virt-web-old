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
import '@material/web/icon/icon.js';
import '@material/web/fab/fab.js';
import '@material/web/divider/divider.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-tonal-button.js';

window.isSelectedList = [];

fetch('/api/list', {cache: "no-store"}).then((response) => {
  return response.json();
}).then((data) => {
  listing(data);
  check();
});

setInterval(() => {
  fetch('/api/list', {cache: "no-store"}).then((response) => {
    return response.json();
  }).then((data) => {
    listing(data);
    check();
  });
}, 1000);

function listingInit(data) {
  console.log(data);
  const list = document.createElement('md-list');
  data.forEach((vm, index) => {
    const div = document.createElement('div');
    let state = '';
    if (vm.domain.State === 'running') {
      state = `<md-icon slot="icon">devices</md-icon>`;
    } else if (vm.domain.State == 'shut off') {
      state = `<md-icon slot="icon">devices_off</md-icon>`;
    }
    console.log(vm);
    /*if (window.isSelectedList[index] == undefined) {
      window.isSelectedList[index] = false;
    };*/
    window.isSelectedList[index] = false;
    div.innerHTML = `
      <md-list-item index="${vm.domain.UUID}">
        <md-checkbox class="list-item-button"></md-checkbox>
        <span id="vmUUID">${vm.domain.UUID}</span>
        <span id="vmName">${vm.domain.Name}</span>
        <span class="list-item-icon">${state}</span>
        <!--<md-switch></md-switch>-->
      </md-list-item>
      <md-divider></md-divider>
    `;/**//*
    const listItem = document.createElement('md-list-item');
    const checkbox = document.createElement('md-checkbox');
    const id = document.createElement('span');
    const state = document.createElement('span');
    const status = document.createElement('span');
    const switcher = document.createElement('md-switch');
    id.innerHTML = vm.id;
    state.innerHTML = vm.domain;
    status.innerHTML = vm.status;
    listItem.appendChild(checkbox);
    listItem.appendChild(id);
    listItem.appendChild(state);
    listItem.appendChild(status);
    listItem.appendChild(switcher);
    div.appendChild(listItem);/**/
    list.appendChild(div);
  });
  console.log(list);
  document.getElementById('info').innerHTML = '';
  document.getElementById('info').appendChild(list);
  /*const applyButton = document.createElement('md-filled-button');
  applyButton.innerHTML = 'Apply';
  document.getElementById('info').appendChild(applyButton);*/
};

function listing(data) {
  const list = document.getElementById('info').getElementsByTagName('md-list')[0];
  if (list) {
    if (list.childElementCount != data.length) {
      document.getElementById('vmChangedReload').setAttribute('open', 'true');
    }
    const listItems = list.getElementsByTagName('md-list-item');
    if (listItems.length != data.length) {
      document.getElementById('vmChangedReload').setAttribute('open', 'true');
    }

    Array.prototype.slice.call(listItems).forEach((listItem) => {
      const index = listItem.getAttribute('index');
      if (window.isSelectedList[index]) {
        listItem.getElementsByTagName('md-checkbox')[0].setAttribute('checked', 'true');
      } else {
        listItem.getElementsByTagName('md-checkbox')[0].removeAttribute('checked');
      }
      console.log(data, index);
      //const state = listItem.getElementsByTagName('span')[2];
      // const vm = data[index];
      const vm = data.filter((vm) => {
        return vm.domain.UUID === index;
      })[0];
      // console.log(vm);
      if (vm == undefined) {
        listItem.remove();
        return;
      }
      if (vm.domain.State === 'running') {
        //state.innerHTML = 'running';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'devices';
      } else if (vm.domain.State == 'shut off') {
        //state.innerHTML = 'shut off';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'devices_off';
      }
      // listItem.getElementsByTagName('span')[0].innerHTML = vm.domain.UUID;
      // listItem.getElementsByTagName('span')[1].innerHTML = vm.domain.Name;
      console.log(listItem);
      listItem.querySelector('#vmUUID').innerHTML = vm.domain.UUID;
      listItem.querySelector('#vmName').innerHTML = vm.domain.Name;
      console.log(index);
    });
  } else {
    listingInit(data);
  }
}

function check() {
  Array.prototype.slice.call(document.getElementsByTagName('md-checkbox')).forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      console.log(checkbox.checked);
      console.log(checkbox.parentNode.getAttribute('index'));
      window.isSelectedList[checkbox.parentNode.getAttribute('index')] = checkbox.checked;
    });
  });
}

document.getElementById('tools').addEventListener('click', (event) => {
  const tools = document.getElementById('tools');
  if (tools.getAttribute('open') == 'true') {
    tools.setAttribute('open', 'false');
  } else {
    tools.setAttribute('open', 'true');
  }
});