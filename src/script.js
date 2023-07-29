let notificationTimeout = -1;
const notification = createNotification();

document.addEventListener("keydown", async ({ key }) => {
  const { videoShortcutsOn = true } = await browser.storage.local.get("videoShortcutsOn");

  if (!videoShortcutsOn) {
    return;
  }

  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
    return;
  }
  if (key === "[") {
    loopVideos((video) => {
      video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
      notify(`${video.playbackRate}`, "background: #8b000088;");
    });
  } else if (key === "]") {
    loopVideos((video) => {
      video.playbackRate = Math.min(video.playbackRate + 0.25, 10);
      notify(`${video.playbackRate}`, "background: #00640088;");
    });
  }
});


/**
 * Loops through all HTMLVideoElement elements on the page and applies a function to each of them
 * @param {Parameters<NodeListOf<HTMLVideoElement>["forEach"]>} args - The arguments to be passed to the forEach method.
 * @example
 * // Apply a function to all video elements, making them loop indefinitely:
 * loopVideos(video => { video.loop = true; });
 * @example
 * // Pause all video elements on the page:
 * loopVideos(video => { video.pause(); });
 */
function loopVideos(...args) {
  document.querySelectorAll("video").forEach(...args);
}

/**
 *
 * @param {string} message - Notification text
 * @param {string} css - Notification style
 */
function notify(message, css) {
  clearNotification();
  notification.innerText = message;
  notification.style.cssText = css;
  showNotification();
}

/**
 * Creates notification element and attaches it's styles
 * @returns {HTMLDivElement} - The notification element
 */
function createNotification() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.dataset.videoShortcutsStyles = "";
  link.href = browser.extension.getURL("src/style.css");
  document.head.appendChild(link);

  const notification = document.createElement("div");
  notification.classList.add("VideoShortcuts__notification");
  return notification;
}

/** Clears notification timeout and appends it to the current fullscreen element or root */
function clearNotification() {
  clearTimeout(notificationTimeout);
  notification.ontransitionend = null;
  notification.remove();
  (document.fullscreenElement || document.documentElement).append(notification);
}

/** Shows notification and make sure it plays the enter and exit transition */
function showNotification() {
  requestAnimationFrame(() =>
    setTimeout(() => {
      notification.classList.add("shown");
    }));
  notificationTimeout = setTimeout(() => {
    notification.classList.remove("shown");
    notification.ontransitionend = () => notification.remove();
  }, 2e3);
}
