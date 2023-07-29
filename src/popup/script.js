const extensionSwitch = getElementByIdOrThrow("extensionSwitch");

if (!(extensionSwitch instanceof HTMLInputElement)) {
  throw new Error("extensionSwitch is not an input.");
}

/** Sets extension status storage from popup checkbox.*/
function updateExtensionStatus() {
  browser.storage.local.set({ videoShortcutsOn: this.checked }).catch((error) => {
    console.error(`Error saving videoShortcutsOn status: ${error}`);
  });
}

extensionSwitch.addEventListener("change", updateExtensionStatus);

browser.storage.local.get(["videoShortcutsOn"]).then(({ videoShortcutsOn }) => {
  if (typeof videoShortcutsOn === "boolean") {
    extensionSwitch.checked = videoShortcutsOn;
  } else {
    updateExtensionStatus.call(extensionSwitch);
  }
});

/**
 * Gets an element by ID or throws an error if is not found.
 * @param {string} id - Element ID
 * @returns {HTMLElement} - The HTML Element
 */
function getElementByIdOrThrow(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Could not find element with id ${id}`);
  }
  return element;
}
