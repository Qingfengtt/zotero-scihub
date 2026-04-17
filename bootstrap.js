/* eslint-disable no-unused-vars */
/* global Zotero, Services */

var PLUGIN_ID = "zotero-scihub@ethanwillis.github.io";
var ZoteroScihub;
var registeredMenuIDs = [];
var addedElementIDs = [];
var useMenuManager = false;

function log(msg) {
  Zotero.debug("Sci-Hub Plugin: " + msg);
}

function install() {
  log("Installed");
}

async function startup({ id, version, rootURI }) {
  log("Starting");

  try {
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
    ZoteroScihub = Zotero.Scihub;
    ZoteroScihub.rootURI = rootURI;

    // Use Zotero.MenuManager API if available (Zotero 7.1+)
    if (Zotero.MenuManager && typeof Zotero.MenuManager.registerMenu === "function") {
      useMenuManager = true;
      registerMenus(rootURI);
      log("Menus registered via MenuManager API");
    } else {
      log("MenuManager not available, will use DOM manipulation in onMainWindowLoad");
    }
  } catch (e) {
    log("Error during startup: " + e);
    Zotero.logError(e);
  }
}

function registerMenus(rootURI) {
  var icon = rootURI + "skin/default/sci-hub-logo.svg";

  // Item context menu
  var itemMenuID = Zotero.MenuManager.registerMenu({
    pluginID: PLUGIN_ID,
    target: "main/library/item",
    menus: [
      {
        menuType: "menuitem",
        label: "Update Scihub PDF",
        icon: icon,
        onCommand: function () {
          Zotero.Scihub.ItemPane.updateSelectedItems();
        },
      },
    ],
  });
  if (itemMenuID) {
    registeredMenuIDs.push(itemMenuID);
  } else {
    log("Warning: Failed to register item context menu");
  }

  // Collection context menu
  var collMenuID = Zotero.MenuManager.registerMenu({
    pluginID: PLUGIN_ID,
    target: "main/library/collection",
    menus: [
      {
        menuType: "menuitem",
        label: "Update Collection Scihub PDFs",
        icon: icon,
        onCommand: function () {
          Zotero.Scihub.ItemPane.updateSelectedEntity();
        },
      },
    ],
  });
  if (collMenuID) {
    registeredMenuIDs.push(collMenuID);
  } else {
    log("Warning: Failed to register collection context menu");
  }

  // Tools menu
  var toolsMenuID = Zotero.MenuManager.registerMenu({
    pluginID: PLUGIN_ID,
    target: "main/menubar/tools",
    menus: [
      {
        menuType: "menuitem",
        label: "Update All Scihub PDFs",
        icon: icon,
        onCommand: function () {
          Zotero.Scihub.ToolsPane.updateAll();
        },
      },
    ],
  });
  if (toolsMenuID) {
    registeredMenuIDs.push(toolsMenuID);
  } else {
    log("Warning: Failed to register tools menu");
  }
}

function onMainWindowLoad({ window }) {
  // Only use DOM manipulation if MenuManager is not available
  if (!useMenuManager) {
    try {
      addMenuItems(window);
      log("Menus added via DOM manipulation");
    } catch (e) {
      log("Error adding menu items: " + e);
      Zotero.logError(e);
    }
  }
}

function onMainWindowUnload({ window }) {
  if (!useMenuManager) {
    removeMenuItems(window);
  }
}

function shutdown() {
  log("Shutting down");

  // Unregister menus registered via MenuManager
  if (useMenuManager && Zotero.MenuManager) {
    for (var menuID of registeredMenuIDs) {
      try {
        Zotero.MenuManager.unregisterMenu(menuID);
      } catch (e) {
        log("Error unregistering menu: " + e);
      }
    }
    registeredMenuIDs = [];
  }

  if (Zotero.Scihub) {
    Zotero.Scihub.unload();
  }
  ZoteroScihub = undefined;
  useMenuManager = false;
}

function uninstall() {
  log("Uninstalled");
}

// Fallback DOM manipulation for Zotero versions without MenuManager
function addMenuItems(window) {
  var doc = window.document;

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
    itemMenu.setAttribute(
      "image",
      ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
    );
    itemMenu.setAttribute("label", "Update Scihub PDF");
    itemMenu.addEventListener("command", function () {
      Zotero.Scihub.ItemPane.updateSelectedItems();
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
    collMenu.setAttribute(
      "image",
      ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
    );
    collMenu.setAttribute("label", "Update Collection Scihub PDFs");
    collMenu.addEventListener("command", function () {
      Zotero.Scihub.ItemPane.updateSelectedEntity();
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
    toolsMenu.setAttribute(
      "image",
      ZoteroScihub.rootURI + "skin/default/sci-hub-logo.svg"
    );
    toolsMenu.setAttribute("label", "Update All Scihub PDFs");
    toolsMenu.addEventListener("command", function () {
      Zotero.Scihub.ToolsPane.updateAll();
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
