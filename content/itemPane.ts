import type { IZotero } from '../typings/zotero'
declare const Zotero: IZotero

class ItemPane {
  public async updateSelectedEntity(): Promise<void> {
    const ZoteroPane = Zotero.getActiveZoteroPane()
    Zotero.debug('scihub: updating items in selected collection')
    if (!ZoteroPane.canEdit()) {
      ZoteroPane.displayCannotEditLibraryMessage()
      return
    }

    const collection = ZoteroPane.getSelectedCollection(false)
    if (collection) {
      const items = collection.getChildItems(false, false)
      await Zotero.Scihub.updateItems(items)
    }
  }

  public async updateSelectedItems(): Promise<void> {
    const ZoteroPane = Zotero.getActiveZoteroPane()
    Zotero.debug('scihub: updating selected items')
    const items = ZoteroPane.getSelectedItems()
    await Zotero.Scihub.updateItems(items)
  }
}

export { ItemPane }
