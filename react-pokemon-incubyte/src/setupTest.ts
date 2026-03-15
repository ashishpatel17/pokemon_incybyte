import '@testing-library/jest-dom';
import { vi } from "vitest";

vi.spyOn(console, "warn").mockImplementation((msg: string) => {
  if (msg.includes("React Router Future Flag Warning")) return;
  console.warn(msg);
});