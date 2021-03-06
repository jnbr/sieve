/*
 * The contents of this file are licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

/* global Components */
/* global document */
/* global window */
/* global SieveOverlayManager */
/* global SieveAbstractChannel */
/* global SieveConnections */

"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("chrome://sieve/content/modules/overlays/SieveOverlayManager.jsm");

SieveOverlayManager.requireModule("./sieve/SieveConnectionManager.jsm", window);
const { SieveAccountManager } = require("./settings/SieveMozAccounts.js");


function errorhandler(msg, url, line) {
  alert(msg + "\n" + url + "\n" + line);
  Cu.reportError(msg + "\n" + url + "\n" + line);
}

window.onerror = errorhandler;


// TODO möglichkeit bauen einen FilterList Dialog an die GUI zu binden bzw.
// davon zu befreien. Dadurch wird garantiert dass immer nur die aktuelle
// Session angezeigt wird.


function SieveFilterListDialog() {
  SieveAbstractChannel.call(this);
  this._script = "Thunderbird Mailfilters";
}

SieveFilterListDialog.prototype = Object.create(SieveAbstractChannel.prototype);
SieveFilterListDialog.prototype.constructor = SieveFilterListDialog;


SieveFilterListDialog.prototype.onListScriptResponse
  = function (response) {
    let scripts = response.getScripts();

    for (let i = 0; i < scripts.length; i++) {
      if (!scripts[i].active)
        continue;

      this._script = scripts[i].script;

      this.getScript(this._script);
      return;
    }

    try {

      let capabilities = SieveConnections
        .getChannel(this._sid, this._cid).getExtensions();

      document.getElementById("sivContent")
        .contentWindow.setSieveScript("", capabilities);

      this.onStatusChange(0);
    }
    catch (ex) {
      alert(ex);
    }
  };

SieveFilterListDialog.prototype.onGetScriptResponse
  = function (response) {
    try {

      let capabilities = SieveConnections
        .getChannel(this._sid, this._cid).getExtensions();

      document.getElementById("sivContent")
        .contentWindow.setSieveScript(response.getScriptBody(), capabilities);
    }
    catch (ex) {
      alert(ex);
    }

    this.onStatusChange(0);
  };



SieveFilterListDialog.prototype.onChannelClosed
  = function () {
    // a channel is usually closed when a child window is closed.
    // it might be a good idea to check if the script was changed.
  };


SieveFilterListDialog.prototype.onChannelReady
  = function (cid) {
    // We observe only our channel...
    if (cid !== this._cid)
      return;

    this.listScript();

    // Step 1: List script

    // get active if any
  };

SieveFilterListDialog.prototype.onStatusChange
  = function (state, message) {
    // Script ready
    if (state === 0) {
      document.getElementById("sivStatus").setAttribute('hidden', 'true');
      document.getElementById('sivContent').removeAttribute('hidden');
      return;
    }

    // The rest has to be redirected to the status window...
    // document.getElementById('sivExplorerTree').setAttribute('collapsed','true');
    document.getElementById("sivStatus").contentWindow.onStatus(state, message);
    document.getElementById("sivStatus").removeAttribute('hidden');
    document.getElementById('sivContent').setAttribute('hidden', 'true');
  };


let gSFLD = new SieveFilterListDialog();


/* function onCanChangeAccount(key)
{
  if (!gSFLD)
    return true;

  if (gSFLD._key != key)
    return true;

  return false;
}*/

function onLoad() {
  let key = window.frameElement.getAttribute("key");

  let account = SieveAccountManager.getAccountByName(key);

  document.getElementById("sivStatus").contentWindow
    .onAttach(account, function () { onLoad(); });

  // the content is heavy weight javascript. So load it lazily
  let iframe = document.getElementById("sivContent");

  if (iframe.hasAttribute("src"))
    iframe.contentWindow.location.reload();
  else
    iframe.setAttribute("src", "chrome://sieve/content/libs/libSieve/SieveSimpleGui.html");

  if ((!account.isEnabled()) || account.isFirstRun()) {
    account.setFirstRun();
    gSFLD.onStatusChange(8);

    return;
  }

  gSFLD.onStatusChange(3, "progress.connecting");

  gSFLD.connect(account);

}

window.onunload = function () {
  if (gSFLD)
    gSFLD.disconnect();
};



/*
 * StartUp...
 *
 * Step 1
 * 0. Connect
 * 1. Get Scripts
 *
 * 2. Script Active?
 *   2a. No create a new Filter named "Thunderbird"
 *   2b. Make Filter Active
 *
 * 3. Get Active Script
 *
 * 4. pass script to iframe
 *
 *
 * On Change:
 * 1. is script empty?
 *  1a delete
 *  1b stop;
 *
 * 2. put script
 *
 *
 * On Close
 *   Disconnect...
 *
 */

