/* eslint-disable no-undef */
/* global Zotero, document */

// Initialize preferences UI from stored values
// Note: defaults here must match those in prefs.js to handle first-run initialization
function initScihubPreferences() {
  var DEFAULT_SCIHUB_URL = "https://sci-hub.ru/";
  var DEFAULT_AUTOMATIC_PDF_DOWNLOAD = true;

  var automaticPdfDownloadCheckbox = document.getElementById(
    "id-zoteroscihub-automatic-pdf-download"
  );
  var currentAutoDownload = Zotero.Prefs.get(
    "zoteroscihub.automatic_pdf_download"
  );
  if (currentAutoDownload === undefined) {
    Zotero.Prefs.set(
      "zoteroscihub.automatic_pdf_download",
      DEFAULT_AUTOMATIC_PDF_DOWNLOAD
    );
    currentAutoDownload = DEFAULT_AUTOMATIC_PDF_DOWNLOAD;
  }
  automaticPdfDownloadCheckbox.checked = currentAutoDownload;
  automaticPdfDownloadCheckbox.addEventListener("change", function () {
    Zotero.Prefs.set(
      "zoteroscihub.automatic_pdf_download",
      this.checked
    );
  });

  var sciHubUrlInput = document.getElementById("id-zoteroscihub-scihub-url");
  var currentUrl = Zotero.Prefs.get("zoteroscihub.scihub_url");
  if (currentUrl === undefined) {
    Zotero.Prefs.set("zoteroscihub.scihub_url", DEFAULT_SCIHUB_URL);
    currentUrl = DEFAULT_SCIHUB_URL;
  }
  sciHubUrlInput.value = currentUrl;
  sciHubUrlInput.addEventListener("change", function () {
    Zotero.Prefs.set("zoteroscihub.scihub_url", this.value);
  });
}

initScihubPreferences();
