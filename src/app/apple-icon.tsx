import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const MARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<path fill="#f3ecde" d="M 47.5 14.9 L 36.84 51.03 L 23.9 86.4 L 34.56 50.27 Z"/>` +
    `<path fill="#f3ecde" d="M 47.5 14.9 L 62.72 50.21 L 75.7 86.4 L 60.48 51.09 Z"/>` +
    `<path fill="#f3ecde" d="M 62.5 31.3 L 63.4 54.2 L 61.3 84.0 L 61.6 54.2 Z"/>` +
    `<path fill="#f3ecde" d="M 47.4 54.2 L 62.5 53.5 L 80.1 54.2 L 62.5 54.9 Z"/>` +
    `</svg>`
)}`;

// iOS home-screen / share icon. A static PNG is required (iOS ignores SVG
// favicons), so we render the brand A-mark on the Ink Navy background.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121933",
        }}
      >
        <img src={MARK_DATA_URI} width={120} height={120} alt="" />
      </div>
    ),
    { ...size }
  );
}
