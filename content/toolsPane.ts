import type { ZoteroItem, IZotero } from '../typings/zotero'
import { ZoteroUtil } from './zoteroUtil'

declare const Zotero: IZotero

class ToolsPane {
  public async updateAll(): Promise<void> {
    try {
      Zotero.debug('scihub: updating all items')

      const allItems = await Zotero.Items.getAll()
      const items = allItems.filter(item => {
        const libraryId = item.getField('libraryID')
        const isProcessable = item.isRegularItem() && !item.isCollection()
        const isEditable: boolean = libraryId === null || libraryId === '' || Zotero.Libraries.isEditable(libraryId)

        return isProcessable && isEditable
      }) as [ZoteroItem]

      await Zotero.Scihub.updateItems(items)
    } catch (error) {
      Zotero.debug(`scihub: error updating all items: ${error}`)
      ZoteroUtil.showPopup('Update Failed', `An error occurred: ${error}`, true)
    }
  }
}

export { ToolsPane }
