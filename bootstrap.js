/* eslint-disable no-unused-vars */
/* global Zotero, Services */

var PLUGIN_ID = "zotero-scihub@ethanwillis.github.io";
var pluginRootURI = null;
var addedElementIDs = [];

function log(msg) {
  Zotero.debug("Sci-Hub Plugin: " + msg);
}

function install() {
  log("Installed");
}

async function startup({ id, version, rootURI }) {
  log("Starting");

  pluginRootURI = rootURI;

  // Register preferences pane
  Zotero.PreferencePanes.register({
    pluginID: PLUGIN_ID,
    src: rootURI + "content/preferences.xhtml",
    scripts: [rootURI + "content/preferences.js"],
    label: "Zotero Scihub",
    image: rootURI + "skin/default/sci-hub-logo.svg",
  });

  // Load main plugin script
  Services.scriptloader.loadSubScript(rootURI + "content/scihub.js");

  // Initialize the plugin
  Zotero.Scihub.load();

  // Add menu items to all already-open windows
  addToAllWindows();
}

function onMainWindowLoad({ window }) {
  addMenuItems(window);
}

function onMainWindowUnload({ window }) {
  removeMenuItems(window);
}

function shutdown() {
  log("Shutting down");

  removeFromAllWindows();

  if (Zotero.Scihub) {
    Zotero.Scihub.unload();
  }

  pluginRootURI = null;
}

function uninstall() {
  log("Uninstalled");
}

function addToAllWindows() {
  var windows = Zotero.getMainWindows();
  for (var win of windows) {
    if (!win.ZoteroPane) continue;
    addMenuItems(win);
  }
}

function removeFromAllWindows() {
  var windows = Zotero.getMainWindows();
  for (var win of windows) {
    if (!win.ZoteroPane) continue;
    removeMenuItems(win);
  }
}

function addMenuItems(window) {
  var doc = window.document;
  var iconURI = pluginRootURI + "skin/default/sci-hub-logo.svg";

  // Add "Update Scihub PDF" to item context menu
  var itemMenuPopup = doc.getElementById("zotero-itemmenu");
  if (itemMenuPopup) {
    var itemMenuSep = doc.createXULElement("menuseparator");
    itemMenuSep.id = "zotero-scihub-itemmenu-separator";
    itemMenuPopup.appendChild(itemMenuSep);
    addedElementIDs.push(itemMenuSep.id);

    var itemMenu = doc.createXULElement("menuitem");
    itemMenu.id = "zotero-itemmenu-scihub";
    itemMenu.classList.add("menuitem-iconic");
    itemMenu.setAttribute("image", iconURI);
    itemMenu.setAttribute("label", "Update Scihub PDF");
    itemMenu.addEventListener("command", function () {
      Zotero.Scihub.ItemPane.updateSelectedItems().catch(function (err) {
        log("Error updating selected items: " + err);
      });
    });
    itemMenuPopup.appendChild(itemMenu);
    addedElementIDs.push(itemMenu.id);
  } else {
    log("Warning: zotero-itemmenu element not found");
  }

  // Add "Update Collection Scihub PDFs" to collection context menu
  var collMenuPopup = doc.getElementById("zotero-collectionmenu");
  if (collMenuPopup) {
    var collMenuSep = doc.createXULElement("menuseparator");
    collMenuSep.id = "zotero-scihub-collectionmenu-separator";
    collMenuPopup.appendChild(collMenuSep);
    addedElementIDs.push(collMenuSep.id);

    var collMenu = doc.createXULElement("menuitem");
    collMenu.id = "zotero-collectionmenu-scihub";
    collMenu.classList.add("menuitem-iconic");
    collMenu.setAttribute("image", iconURI);
    collMenu.setAttribute("label", "Update Collection Scihub PDFs");
    collMenu.addEventListener("command", function () {
      Zotero.Scihub.ItemPane.updateSelectedEntity().catch(function (err) {
        log("Error updating collection items: " + err);
      });
    });
    collMenuPopup.appendChild(collMenu);
    addedElementIDs.push(collMenu.id);
  } else {
    log("Warning: zotero-collectionmenu element not found");
  }

  // Add "Update All Scihub PDFs" to Tools menu
  var toolsMenuPopup = doc.getElementById("menu_ToolsPopup");
  if (toolsMenuPopup) {
    var toolsMenuSep = doc.createXULElement("menuseparator");
    toolsMenuSep.id = "zotero-scihub-tools-separator";
    toolsMenuPopup.appendChild(toolsMenuSep);
    addedElementIDs.push(toolsMenuSep.id);

    var toolsMenu = doc.createXULElement("menuitem");
    toolsMenu.id = "zotero-scihub-tools-updateall";
    toolsMenu.classList.add("menuitem-iconic");
    toolsMenu.setAttribute("image", iconURI);
    toolsMenu.setAttribute("label", "Update All Scihub PDFs");
    toolsMenu.addEventListener("command", function () {
      Zotero.Scihub.ToolsPane.updateAll().catch(function (err) {
        log("Error updating all items: " + err);
      });
    });
    toolsMenuPopup.appendChild(toolsMenu);
    addedElementIDs.push(toolsMenu.id);
  } else {
    log("Warning: menu_ToolsPopup element not found");
  }
}

function removeMenuItems(window) {
  var doc = window.document;
  for (var id of addedElementIDs) {
    var elem = doc.getElementById(id);
    if (elem) {
      elem.remove();
    }
  }
  addedElementIDs = [];
}
