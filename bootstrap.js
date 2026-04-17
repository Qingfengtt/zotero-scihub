/* eslint-disable no-unused-vars */
/* global Zotero, Services */

var ZoteroScihub;
var addedElementIDs = [];

function log(msg) {
  Zotero.debug("Sci-Hub Plugin: " + msg);
}

function install() {
  log("Installed");
}

async function startup({ id, version, rootURI }) {
  log("Starting");

  // Register preferences pane
  Zotero.PreferencePanes.register({
    pluginID: "zotero-scihub@ethanwillis.github.io",
    src: rootURI + "content/preferences.xhtml",
    scripts: [rootURI + "content/preferences.js"],
    label: "Zotero Scihub",
    image: rootURI + "skin/default/sci-hub-logo.svg",
  });

  // Load main plugin script
  Services.scriptloader.loadSubScript(rootURI + "content/scihub.js");

  // Initialize the plugin
  Zotero.Scihub.load();
  ZoteroScihub = Zotero.Scihub;
  ZoteroScihub.rootURI = rootURI;
}

function onMainWindowLoad({ window }) {
  addMenuItems(window);
}

function onMainWindowUnload({ window }) {
  removeMenuItems(window);
}

function shutdown() {
  log("Shutting down");
  if (Zotero.Scihub) {
    Zotero.Scihub.unload();
  }
  ZoteroScihub = undefined;
}

function uninstall() {
  log("Uninstalled");
}

function addMenuItems(window) {
  var doc = window.document;

  // Add "Update Scihub PDF" to item context menu
  var itemMenuSep = doc.createXULElement("menuseparator");
  itemMenuSep.id = "zotero-scihub-itemmenu-separator";
  doc.getElementById("zotero-itemmenu").appendChild(itemMenuSep);
  addedElementIDs.push(itemMenuSep.id);

  var itemMenu = doc.createXULElement("menuitem");
  itemMenu.id = "zotero-itemmenu-scihub";
  itemMenu.classList.add("menuitem-iconic");
  itemMenu.setAttribute(
    "image",
    ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
  );
  itemMenu.setAttribute("label", "Update Scihub PDF");
  itemMenu.addEventListener("command", function () {
    Zotero.Scihub.ItemPane.updateSelectedItems();
  });
  doc.getElementById("zotero-itemmenu").appendChild(itemMenu);
  addedElementIDs.push(itemMenu.id);

  // Add "Update Collection Scihub PDFs" to collection context menu
  var collMenuSep = doc.createXULElement("menuseparator");
  collMenuSep.id = "zotero-scihub-collectionmenu-separator";
  doc.getElementById("zotero-collectionmenu").appendChild(collMenuSep);
  addedElementIDs.push(collMenuSep.id);

  var collMenu = doc.createXULElement("menuitem");
  collMenu.id = "zotero-collectionmenu-scihub";
  collMenu.classList.add("menuitem-iconic");
  collMenu.setAttribute(
    "image",
    ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
  );
  collMenu.setAttribute("label", "Update Collection Scihub PDFs");
  collMenu.addEventListener("command", function () {
    Zotero.Scihub.ItemPane.updateSelectedEntity();
  });
  doc.getElementById("zotero-collectionmenu").appendChild(collMenu);
  addedElementIDs.push(collMenu.id);

  // Add "Update All Scihub PDFs" to Tools menu
  var toolsMenuSep = doc.createXULElement("menuseparator");
  toolsMenuSep.id = "zotero-scihub-tools-separator";
  doc.getElementById("menu_ToolsPopup").appendChild(toolsMenuSep);
  addedElementIDs.push(toolsMenuSep.id);

  var toolsMenu = doc.createXULElement("menuitem");
  toolsMenu.id = "zotero-scihub-tools-updateall";
  toolsMenu.classList.add("menuitem-iconic");
  toolsMenu.setAttribute(
    "image",
    ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
  );
  toolsMenu.setAttribute("label", "Update All Scihub PDFs");
  toolsMenu.addEventListener("command", function () {
    Zotero.Scihub.ToolsPane.updateAll();
  });
  doc.getElementById("menu_ToolsPopup").appendChild(toolsMenu);
  addedElementIDs.push(toolsMenu.id);
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
