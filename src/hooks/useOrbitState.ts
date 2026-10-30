import { useSyncExternalStore } from 'react';

// Shared state for the orbital rotation of surrounding islands
let currentAngle = 0;
let targetAngle = 0;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const orbitStore = {
  getAngle: () => currentAngle,
  getTargetAngle: () => targetAngle,
  setAngle: (angle: number) => {
    currentAngle = angle;
    emitChange();
  },
  setTargetAngle: (target: number) => {
    targetAngle = target;
    emitChange();
  },
  rotateDelta: (delta: number) => {
    targetAngle += delta;
    emitChange();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useOrbitAngle(): number {
  return useSyncExternalStore(orbitStore.subscribe, orbitStore.getAngle);
}

export function useOrbitTarget(): number {
  return useSyncExternalStore(orbitStore.subscribe, orbitStore.getTargetAngle);
}

// Shared state for interactive overview world zooming
let overviewZoomDist = 51.0;
let targetZoomDist = 51.0;
const zoomListeners = new Set<() => void>();

function emitZoomChange() {
  for (const listener of zoomListeners) {
    listener();
  }
}

export const zoomStore = {
  getZoomDist: () => overviewZoomDist,
  getTargetZoomDist: () => targetZoomDist,
  setZoomDist: (dist: number) => {
    overviewZoomDist = dist;
    emitZoomChange();
  },
  setTargetZoomDist: (dist: number) => {
    targetZoomDist = dist;
    emitZoomChange();
  },
  zoomDelta: (delta: number) => {
    // delta > 0: zoom out, delta < 0: zoom in
    targetZoomDist = Math.max(22, Math.min(78, targetZoomDist + delta));
    emitZoomChange();
  },
  subscribe: (listener: () => void) => {
    zoomListeners.add(listener);
    return () => {
      zoomListeners.delete(listener);
    };
  },
};

export function useWorldZoom(): number {
  return useSyncExternalStore(zoomStore.subscribe, zoomStore.getZoomDist);
}

