/**
 * @license
 * Copyright (C) 2023 noneinfo01
 * SPDX-License-Identifier: GPL-2.0
 */

/*import '@material/web/button/filled-button.js';
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
import '@material/web/progress/circular-progress.js';*/
import '@material/web/all';
// import Toastify from 'toastify-js'

document.getElementsByTagName('body')[0].style.display = 'block';

window.isSelectedList = [];

function autoFetch () {
  fetch('/api/list', { cache: "no-store" }).then((response) => {
    return response.json();
  })
  .catch((err) => {
    // console.error(err);
    clearInterval(autoFetchInterval);
    document.getElementById('err-vmFetch').setAttribute('open', 'true');
    return null;
  })
  .then((data) => {
    if (data == null) {
      return;
    }
    listing(data);
    check();
    document.getElementById('refreshStatusIcon').outerHTML = '<md-icon slot="icon" id="refreshStatusIcon">refresh</md-icon>';
  });
}
autoFetch();

window.autoFetchInterval = setInterval(() => {autoFetch()}, 400);

window.autoFetch = autoFetch;
let autoFetchInterval = window.autoFetchInterval;

function listingInit(data) {
  console.log(data);
  let button = document.createElement('md-text-button');
  button.id = 'refreshStatus';
  button.innerHTML = `<md-icon slot="icon" id="refreshStatusIcon">refresh</md-icon>Refresh Status`;
  document.getElementById('info').innerHTML = '';
  document.getElementById('info').appendChild(button);
  button = document.getElementById('refreshStatus');
  button.addEventListener('click', (event) => {
    // document.getElementById('refreshStatusIcon').deleteAttribute('slot');
    document.getElementById('refreshStatusIcon').outerHTML = '<md-circular-progress indeterminate id="refreshStatusIcon"></md-circular-progress>';
    /*fetch('/api/list', { cache: "no-store" }).then((response) => {
      return response.json();
    }).then((data) => {
      listing(data);
      check();
      // document.getElementById('refreshStatusIcon').setAttribute('slot', 'icon');
      // document.getElementById('refreshStatusIcon').innerHTML = 'refresh';
      document.getElementById('refreshStatusIcon').outerHTML = '<md-icon slot="icon" id="refreshStatusIcon">refresh</md-icon>';
    });*/
    window.autoFetchInterval = setInterval(() => {autoFetch()}, 400);
  });
  const list = document.createElement('md-list');
  data.forEach((vm, index) => {
    if (vm.domain.UUID == undefined || vm.domain.error) {
      return;
    }
    const div = document.createElement('div');
    let state = '<md-circular-progress indeterminate></md-circular-progress>';
    /*if (vm.domain.State === 'running') {
      state = `<md-icon slot="icon">devices</md-icon>`;
    } else if (vm.domain.State == 'shut off') {
      state = `<md-icon slot="icon">devices_off</md-icon>`;
    }*/
    // console.log(vm);
    /*if (window.isSelectedList[index] == undefined) {
      window.isSelectedList[index] = false;
    };*/
    // window.isSelectedList[index] = false;
    div.innerHTML = `
      <md-list-item index="${vm.domain.UUID}">
        <md-checkbox class="list-item-button"></md-checkbox>
        <span id="vmUUID">${vm.domain.UUID}</span>
        <span id="vmName">${vm.domain.Name}</span>
        <span class="list-item-icon"><md-icon slot="icon"></md-icon></span>
        <!--${state}-->
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
  // console.log(list);
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

    Array.prototype.slice.call(listItems).forEach((listItem, num) => {
      const index = listItem.getAttribute('index');
      listItem.setAttribute('num', num);
      if (window.isSelectedList[index]) {
        listItem.getElementsByTagName('md-checkbox')[0].setAttribute('checked', 'true');
      } else {
        listItem.getElementsByTagName('md-checkbox')[0].removeAttribute('checked');
      }
      // console.log(data, index);
      //const state = listItem.getElementsByTagName('span')[2];
      // const vm = data[index];
      const vm = data.filter((vm) => {
        return vm.domain.UUID === index;
      })[0];

      if (vm.domain.UUID == undefined || vm.domain.error) {
        return;
      }

      // console.log(vm);
      if (vm == undefined) {
        document.getElementById('vmChangedReload').setAttribute('open', 'true');
        listItem.remove();
        return;
      }
      // console.log(listItem);
      if (vm.domain.State === 'running') {
        //state.innerHTML = 'running';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'devices';
      } else if (vm.domain.State == 'shut off') {
        //state.innerHTML = 'shut off';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'devices_off';
      } else if (vm.domain.State == 'paused') {
        //state.innerHTML = 'paused';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'autopause';
      } else if (vm.domain.State == 'crashed') {
        //state.innerHTML = 'crashed';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'error';
      } else if (vm.domain.State == 'pmsuspended') {
        //state.innerHTML = 'pmsuspended';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'bedtime';
      } else if (vm.domain.State == 'in shutdown') {
        //state.innerHTML = 'inshutdown';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'settings_power';
      } else if (vm.domain.State == 'idle') {
        //state.innerHTML = 'idle';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'bed';
      } else {
        //state.innerHTML = 'unknown';
        listItem.getElementsByTagName('md-icon')[0].innerHTML = 'question_mark';
      }
      // listItem.getElementsByTagName('span')[0].innerHTML = vm.domain.UUID;
      // listItem.getElementsByTagName('span')[1].innerHTML = vm.domain.Name;
      // console.log(listItem);
      listItem.querySelector('#vmUUID').innerHTML = vm.domain.UUID;
      listItem.querySelector('#vmName').innerHTML = vm.domain.Name;
      // console.log(index);
    });
  } else {
    listingInit(data);
  }
}

function check() {
  Array.prototype.slice.call(document.getElementsByTagName('md-checkbox')).forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      // console.log(checkbox.checked);
      // console.log(checkbox.parentNode.getAttribute('index'));
      // console.log(checkbox.parentNode.getAttribute('num'));
      window.isSelectedList[checkbox.parentNode.getAttribute('num')] = [checkbox.parentNode.getAttribute('index'), checkbox.parentNode];
      let selected = '';
      window.isSelectedList.forEach((isSelected, index) => {
        if (isSelected) {
          // console.log(isSelected);
          window.temp = isSelected;
          selected += `<span class="list-item-icon"><md-icon slot="icon">devices</md-icon><span>${isSelected[1].getElementsByTagName('span')[1].innerHTML}<br> `;
        }
      });
      document.getElementById('toolsConfirmDialog-Form-Selected-vmName').innerHTML = selected;
    });
  });
}

document.getElementById('tools').addEventListener('click', (event) => {
  const tools = document.getElementById('toolsDialog');
  if (tools.getAttribute('open') == 'true') {
    tools.setAttribute('open', 'false');
  } else {
    tools.setAttribute('open', 'true');
  }
});

Array.prototype.slice.call(document.getElementsByClassName('toolsDialog-Form-Radio')).forEach((radio) => {
  radio.addEventListener('change', (event) => {
    console.log(radio.value);
    window.taskToPerform = radio.value;
    window.taskToPerformRadio = radio;
    document.getElementById('toolsConfirmDialog-Form-Task').innerHTML = radio.value;
  });
});

document.getElementById('toolsConfirmDialog-Form-ConfirmButton').addEventListener('click', (event) => {
  const taskToPerform = window.taskToPerform;
  const isSelectedList = window.isSelectedList;
  for (let i = 0; i < window.isSelectedList.length; i++) {
    fetch(`/api/${window.taskToPerformRadio.getAttribute('apiPath').slice(' ').toLowerCase()}/${window.isSelectedList[i][0]}`, { cache: "no-store" }).then((response) => {
      // console.log(response.json());
      return response.text();
    }).then((dataJSON) => {
      // dataJSON.replaceAll(/'/g, '"');
      dataJSON.replaceAll('\n', '\\n');
      console.log(dataJSON.replaceAll('\n', '\\n'));
      const data = JSON.parse(dataJSON.replaceAll('\n', '\\n'));
      console.log(data);
      console.log(1);
      if (data.status == 'success') {
        // document.getElementById('toolsConfirmDialog-Form-Result').innerHTML = 'Success';
        Toastify({
          text: `Success to perform ${taskToPerform} Task on ${isSelectedList[i][1].childNodes[5].innerHTML}!`,
          duration: 3000,
          // destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            // background: "linear-gradient(to right, #00b09b, #96c93d)",
            background: "var(--md-filled-tonal-button-container-color, var(--md-sys-color-secondary-container, #e8def8))",
            color: "var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20))",
          },
          onClick: function(){} // Callback after click
        }).showToast();
      } else {
        Toastify({
          text: `Fail to perform ${taskToPerform} Task on ${isSelectedList[i][1].childNodes[5].innerHTML}!`,
          duration: 3000,
          // destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            // background: "linear-gradient(to right, #00b09b, #96c93d)",
            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
        // document.getElementById('toolsConfirmDialog-Form-Result').innerHTML = 'Failed';
      }
      document.getElementById('toolsConfirmDialog-Form-Result').innerHTML += `<br>${data.message}`;
      // document.getElementById('toolsConfirmDialog-Form-ConfirmButton').remove();
    });
  }

  const toolsConfirmDialog = document.getElementById('toolsConfirmDialog');
  toolsConfirmDialog.removeAttribute('open');
});