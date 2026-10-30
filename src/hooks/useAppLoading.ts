import { useState, useEffect, useCallback, useRef } from 'react';
import { ISLANDS } from '../data/islands';
import { navigationConfig } from '../data/navigationConfig';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import { experiences } from '../data/experience';
import { achievements } from '../data/achievements';
import { educations } from '../data/education';
import { journalArticles } from '../data/journal';

export interface LoadingStageInfo {
  id: string;
  label: string;
  description: string;
}

export const LOADING_STAGES: LoadingStageInfo[] = [
  {
    id: 'cloud-env',
    label: 'Preparing Cloud Environment',
    description: 'Initializing GPU WebGL context and atmospheric rendering pipeline',
  },
  {
    id: 'building-islands',
    label: 'Building Islands',
    description: 'Constructing Colombo Home Island, Lotus Tower, and 10 themed celestial bases',
  },
  {
    id: 'navigation',
    label: 'Setting Up Navigation',
    description: 'Calibrating orbital camera targets, top HUD, and bottom dock waypoints',
  },
  {
    id: 'portfolio-data',
    label: 'Loading Portfolio Data',
    description: 'Verifying software engineering projects, AWS leadership, and publications',
  },
  {
    id: 'almost-there',
    label: 'Almost There...',
    description: 'Performing final rendering checks and preparing entrance into Pamuda’s World',
  },
];

export interface AppLoadingState {
  progress: number;
  currentStageIndex: number;
  isReady: boolean;
  webGLSupported: boolean;
  error: string | null;
  retry: () => void;
}

export function useAppLoading(): AppLoadingState {
  const [progress, setProgress] = useState<number>(12);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const highestProgressRef = useRef<number>(12);

  const updateProgress = useCallback((val: number) => {
    // Strictly monotonic: progress never moves backwards
    if (val > highestProgressRef.current) {
      highestProgressRef.current = Math.min(100, Math.round(val));
      setProgress(highestProgressRef.current);
    }
  }, []);

  const runLoadingSequence = useCallback(async () => {
    try {
      setError(null);
      highestProgressRef.current = 10;
      setProgress(10);
      setCurrentStageIndex(0);
      setIsReady(false);

      // ==================== STAGE 1: PREPARING CLOUD ENVIRONMENT ====================
      // 1. Hardware WebGL Acceleration Check
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');

      if (!gl) {
        setWebGLSupported(false);
        setError('WebGL 3D hardware acceleration is unavailable in your browser.');
        return;
      }
      setWebGLSupported(true);
      updateProgress(18);

      // 2. Preload critical visual assets
      await Promise.allSettled([
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = '/cinematic_loading_bg.jpg';
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Non-blocking fallback
        }),
        new Promise<void>((resolve) => {
          const logo = new Image();
          logo.src = '/favicon.png';
          logo.onload = () => resolve();
          logo.onerror = () => resolve();
        }),
      ]);
      updateProgress(26);

      // Transition to Stage 2
      setCurrentStageIndex(1);

      // ==================== STAGE 2: BUILDING ISLANDS ====================
      // Verify all 11 islands exist with correct coordinates and 3D configuration
      if (!Array.isArray(ISLANDS) || ISLANDS.length < 11) {
        throw new Error('Celestial archipelago configuration incomplete.');
      }
      // Brief yield to allow browser layout & GPU shader pipeline initialization
      await new Promise((r) => setTimeout(r, 220));
      updateProgress(48);

      // Verify Home Island & Colombo Lotus Tower data integrity
      const homeIsland = ISLANDS.find((i) => i.id === 'home');
      if (!homeIsland) {
        throw new Error('Home Island (Colombo, Sri Lanka) configuration missing.');
      }
      updateProgress(58);

      // Transition to Stage 3
      setCurrentStageIndex(2);

      // ==================== STAGE 3: SETTING UP NAVIGATION ====================
      // Validate Top Navigation & Bottom Dock configs
      if (!navigationConfig || !navigationConfig.top || !navigationConfig.bottom) {
        throw new Error('Navigation HUD architecture corrupted.');
      }
      await new Promise((r) => setTimeout(r, 180));
      updateProgress(74);

      // Transition to Stage 4
      setCurrentStageIndex(3);

      // ==================== STAGE 4: LOADING PORTFOLIO DATA ====================
      // Validate full verified portfolio datasets
      const dataVerified =
        Array.isArray(projects) && projects.length > 0 &&
        typeof skills === 'object' && Object.keys(skills).length > 0 &&
        Array.isArray(experiences) && experiences.length > 0 &&
        Array.isArray(achievements) && achievements.length > 0 &&
        Array.isArray(educations) && educations.length > 0 &&
        Array.isArray(journalArticles) && journalArticles.length > 0;

      if (!dataVerified) {
        throw new Error('Portfolio record datasets failed to initialize.');
      }
      await new Promise((r) => setTimeout(r, 180));
      updateProgress(89);

      // Transition to Stage 5
      setCurrentStageIndex(4);

      // ==================== STAGE 5: ALMOST THERE... ====================
      updateProgress(96);
      await new Promise((r) => setTimeout(r, 200));
      updateProgress(100);

      // Allow visitor a moment to view the 100% completion state before smooth transition
      await new Promise((r) => setTimeout(r, 250));
      setIsReady(true);
    } catch (err: unknown) {
      console.error('Pamuda’s World loading error:', err);
      setError(err instanceof Error ? err.message : 'Unknown initialization error occurred.');
    }
  }, [updateProgress]);

  useEffect(() => {
    runLoadingSequence();
  }, [runLoadingSequence]);

  return {
    progress,
    currentStageIndex,
    isReady,
    webGLSupported,
    error,
    retry: runLoadingSequence,
  };
}
