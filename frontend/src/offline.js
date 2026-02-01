const KEY = "ai_tracker_days";

export function loadLocal() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveLocal(days) {
  localStorage.setItem(KEY, JSON.stringify(days));
}