import type { IZotero } from '../typings/zotero'
import { ZoteroUtil } from './zoteroUtil'
declare const Zotero: IZotero

class ItemPane {
  public async updateSelectedEntity(): Promise<void> {
    try {
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
    } catch (error) {
      Zotero.debug(`scihub: error updating selected entity: ${error}`)
      ZoteroUtil.showPopup('Update Failed', `An error occurred: ${error}`, true)
    }
  }

  public async updateSelectedItems(): Promise<void> {
    try {
      const ZoteroPane = Zotero.getActiveZoteroPane()
      Zotero.debug('scihub: updating selected items')
      const items = ZoteroPane.getSelectedItems()
      await Zotero.Scihub.updateItems(items)
    } catch (error) {
      Zotero.debug(`scihub: error updating selected items: ${error}`)
      ZoteroUtil.showPopup('Update Failed', `An error occurred: ${error}`, true)
    }
  }
}

export { ItemPane }
