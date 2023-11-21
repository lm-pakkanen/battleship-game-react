import { SoundEffect } from "../enums/SoundEffect";

const SOUNDS_BASE_PATH = "/sound-effects";

const __load = (src: string, volume: number): undefined | HTMLAudioElement => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.load();
    return audio;
  } catch (err) {
    // no-op
  }
};

const AUDIO_FILES: Record<SoundEffect, undefined | HTMLAudioElement> = {
  [SoundEffect.GUESS_HIT]: __load(`${SOUNDS_BASE_PATH}/hit.wav`, 0.1),
  [SoundEffect.GUESS_MISS]: __load(`${SOUNDS_BASE_PATH}/miss.wav`, 0.12),
  [SoundEffect.TURN_START]: __load(`${SOUNDS_BASE_PATH}/turn-start.wav`, 0.04),
  [SoundEffect.GAME_OVER]: __load(`${SOUNDS_BASE_PATH}/game-over.wav`, 0.05),
};

export const playSound = async (soundEffect: SoundEffect): Promise<void> => {
  try {
    const audio = AUDIO_FILES[soundEffect];

    if (!audio) {
      throw new Error("Invalid sound effect");
    }

    // Clone audio element to be able to overlap sounds
    const cloneAudio = audio.cloneNode() as HTMLAudioElement;
    cloneAudio.volume = audio.volume;

    await cloneAudio.play();
  } catch (err) {
    // no-op
  }
};
