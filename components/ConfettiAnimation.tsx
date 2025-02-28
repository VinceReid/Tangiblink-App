import LottieView from "lottie-react-native";
import React, { useRef, useEffect } from "react";
import { create } from "zustand";

// ConfettiState type
export type ConfettiState = {
  playConfetti: boolean;
  setPlayConfetti: (value: boolean) => void;
};

// Zustand store for ConfettiState
export const useConfettiStore = create<ConfettiState>((set) => ({
  playConfetti: false,
  setPlayConfetti: (value) => set({ playConfetti: value }),
}));

export const ConfettiAnimation = () => {
  const confettiRef = useRef<LottieView>(null);
  const playConfetti = useConfettiStore((state) => state.playConfetti);
  const setPlayConfetti = useConfettiStore((state) => state.setPlayConfetti);

  function triggerConfetti() {
    confettiRef.current?.play(0);
  }

  useEffect(() => {
    if (playConfetti) {
      triggerConfetti();
    }
  }, [playConfetti]);
  

  return (
    playConfetti && <LottieView
      ref={confettiRef}
      source={require("@/assets/lottie/confetti.json")}
      onAnimationFinish={() => setPlayConfetti(false)}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 100_001,
      }}
      resizeMode="cover"
      loop={false}
    />
  );
};
