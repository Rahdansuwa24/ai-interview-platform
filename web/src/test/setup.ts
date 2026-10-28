import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Automatically cleanup DOM after each test
afterEach(() => {
    cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock AudioContext for Web Audio tests
class MockAudioContext {
    state = "running";
    currentTime = 0;
    destination = {};
    sampleRate = 16000;
    audioWorklet = {
        addModule: vi.fn().mockResolvedValue(undefined),
    };
    createOscillator() {
        return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            frequency: { setValueAtTime: vi.fn() },
        };
    }
    createGain() {
        return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            gain: { setValueAtTime: vi.fn() },
        };
    }
    createAnalyser() {
        return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            fftSize: 256,
            frequencyBinCount: 128,
            getByteFrequencyData: vi.fn(),
        };
    }
    createMediaStreamSource() {
        return {
            connect: vi.fn(),
            disconnect: vi.fn(),
        };
    }
    createBuffer() {
        return {
            duration: 1,
            copyToChannel: vi.fn(),
        };
    }
    createBufferSource() {
        return {
            buffer: null,
            connect: vi.fn(),
            disconnect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
        };
    }
    resume = vi.fn().mockResolvedValue(undefined);
    suspend = vi.fn().mockResolvedValue(undefined);
    close = vi.fn().mockResolvedValue(undefined);
}

// @ts-ignore
window.AudioContext = MockAudioContext;
// @ts-ignore
window.webkitAudioContext = MockAudioContext;
