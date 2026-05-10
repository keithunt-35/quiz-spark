// Meeting audio recording and transcription service
export type MeetingRecording = {
  id: string;
  audioBlob: Blob;
  transcript: string;
  startTime: number;
  endTime: number;
};

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export async function startMeetingRecording(): Promise<{ success: boolean; error?: string }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start(1000); // Collect data every second
    return { success: true };
  } catch (error) {
    return { success: false, error: "Microphone access denied" };
  }
}

export async function stopMeetingRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!mediaRecorder) {
      resolve(null);
      return;
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioChunks = [];
      
      // Stop all tracks
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
      
      resolve(audioBlob);
    };

    mediaRecorder.stop();
  });
}

export function isRecording(): boolean {
  return mediaRecorder !== null && mediaRecorder.state === "recording";
}
