/*
 * The content of this file is licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

(function (exports) {

  "use strict";

  /* global $ */
  /* global SieveTemplateLoader */

  /**
     * A UI renderer for the sieve settings dialog
     */
  class SieveServerSettingsUI {

    /**
     * Initializes the settings
     * @param {SieveAccount} account
     *   the account for which the settings edited.
     */
    constructor(account) {
      this.account = account;
    }

    /**
     * Sets the account's human readable display name
     * @param {String} name
     *   the name which should be set.
     * @returns {SieveServerSettingsUI}
     *  a self reference
     */
    setDisplayName(name) {
      this.getDialog().find(".sieve-settings-displayname").val(name);
      return this;
    }

    /**
     * Gets the account'S human readable display name
     * @returns {SieveServerSettingsUI}
     *   a self reference
     */
    getDisplayName() {
      return this.getDialog().find(".sieve-settings-displayname").val();
    }

    setHostname(hostname) {
      this.getDialog().find(".sieve-settings-hostname").val(hostname);
    }

    getHostname() {
      return this.getDialog().find(".sieve-settings-hostname").val();
    }

    setPort(port) {
      this.getDialog().find(".sieve-settings-port").val(port);
    }

    getPort() {
      return this.getDialog().find(".sieve-settings-port").val();
    }

    setFingerprint(fingerprint) {
      this.getDialog().find(".sieve-settings-fingerprint").val(fingerprint);
    }

    getFingerprint() {
      return this.getDialog().find(".sieve-settings-fingerprint").val();
    }

    /**
     * Enabled or disables th keep alive button in the ui
     *
     * @param {boolean} enabled
     *   set to true in case the keep alive is enabled otherwise set to false
     * @returns {SieveServerSettingsUI}
     *   a self reference
     */
    setKeepAliveEnabled(enabled) {
      let parent = this.getDialog();

      // reset the toggle button status...
      parent.find(".sieve-settings-keepalive .active").removeClass("active");

      if (enabled === false)
        parent.find(".sieve-settings-keepalive-disabled").button('toggle');
      else
        parent.find(".sieve-settings-keepalive-enabled").button('toggle');

      return this;
    }

    /**
     * Returns the keep alive status
     * @returns {boolean}
     *   true in case keep alive is enabled otherwise false.
     */
    isKeepAliveEnabled() {
      let active = this.getDialog().find(".sieve-settings-keepalive .active");

      if (active.hasClass("sieve-settings-keepalive-disabled"))
        return false;

      return true;
    }

    /**
     * Sets the keep alive interval
     * @param {int} interval
     *  the keep alive interval in ms
     * @returns {SieveServerSettingsUI}
     *   a self reference
     */
    setKeepAliveInterval(interval) {
      // convert to seconds
      interval = interval / (1000 * 60);
      this.getDialog().find(".sieve-settings-keepalive-interval").val(interval);
      return this;
    }

    /**
     * Gets the keep alive interval
     *
     * @returns {int}
     *   the keep alive interval
     */
    getKeepAliveInterval() {
      let interval = this.getDialog().find(".sieve-settings-keepalive-interval").val();
      return interval * 1000 * 60;
    }

    /**
     * Shows the advanced setting
     * @returns {void}
     */
    showAdvanced() {
      let parent = this.getDialog();

      parent.find(".siv-settings-advanced").show();
      parent.find(".siv-settings-show-advanced").hide();
      parent.find(".siv-settings-hide-advanced").show();
    }

    /**
     * Hides the advanced settings
     * @returns {void}
     */
    hideAdvanced() {
      let parent = this.getDialog();

      parent.find(".siv-settings-advanced").hide();
      parent.find(".siv-settings-show-advanced").show();
      parent.find(".siv-settings-hide-advanced").hide();
    }


    /**
     * Shows the settings dialog
     * @returns {Promise<boolean>}
     *   false in case the dialog was dismissed otherwise true.
     */
    async show() {

      this.render();
      return await new Promise((resolve) => {

        let dialog = this.getDialog();

        dialog.modal('show')
          .on('hidden.bs.modal', () => {
            // dialog.remove();
            resolve(false);
          })
          .find(".sieve-settings-apply").off().click(async () => {
            await this.save();
            resolve(true);
            // ... now trigger the hidden listener it will cleanup
            // it is afe to do so due to promise magics, the first
            // alway resolve wins and all subsequent calls are ignored...
            dialog.modal("hide");
          });
      });
    }

    /**
     * Validates and saves the setting before closing the dialog.
     * In case the settings are invalid an error message is displayed.
     * @return {void}
     */
    async save() {

      let server = {
        displayName: this.getDisplayName(),
        hostname: this.getHostname(),
        port: this.getPort(),
        fingerprint: this.getFingerprint()
      };

      await this.account.send("account-set-server", server);

      let general = {
        keepAliveEnabled: this.isKeepAliveEnabled(),
        keepAliveInterval: this.getKeepAliveInterval()
      };

      await this.account.send("account-set-general", general);

    }

    /**
     * Retruns the currents diaogs UI Element.
     *
     * @return {Object}
     *   the dialogs UI elements.
     */
    getDialog() {
      return $("#sieve-dialog-settings");
    }

    /**
     * Renders the UI element into the dom.
     * @returns {void}
     */
    async render() {
      let parent = this.getDialog();

      let loader = new SieveTemplateLoader();

      // Load all subsectionss...
      parent.find(".modal-body").empty()
        .append(await loader.load("./ui/settings/settings.server.tpl"));

      let server = await this.account.send("account-get-server");

      this.setDisplayName(server.displayName);
      this.setHostname(server.hostname);
      this.setPort(server.port);
      this.setFingerprint(server.fingerprint);

      let general = await this.account.send("account-get-general");
      this.setKeepAliveEnabled(general.keepAliveEnabled);
      this.setKeepAliveInterval(general.keepAliveInterval);

      parent.find(".siv-settings-show-advanced").off().click(() => { this.showAdvanced(); });
      parent.find(".siv-settings-hide-advanced").off().click(() => { this.hideAdvanced(); });

      this.hideAdvanced();
    }
  }
  if (typeof (module) !== "undefined" && module !== null && module.exports)
    module.exports = SieveServerSettingsUI;
  else
    exports.SieveServerSettingsUI = SieveServerSettingsUI;

})(this);
