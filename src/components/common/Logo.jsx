/**
 * Listo brand mark — a blue circle with a white check, matching the favicon.
 */

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Renders the Listo logo mark, optionally followed by the wordmark text.
 *
 * @param {Object} props - Component props.
 * @param {number} [props.size=32] - Diameter of the circular mark in pixels.
 * @param {boolean} [props.withWordmark=false] - Whether to render the "Listo"
 *   wordmark next to the mark.
 * @param {string} [props.wordmarkVariant="h6"] - MUI typography variant for
 *   the wordmark when `withWordmark` is enabled.
 * @returns {JSX.Element} The logo element.
 */
export default function Logo({
  size = 32,
  withWordmark = false,
  wordmarkVariant = "h6",
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
        role="img"
      >
        <circle cx="24" cy="24" r="22" fill="#1a73e8" />
        <path
          d="M15 24.5l6.5 6.5L33 19.5"
          stroke="#fff"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <Box component="span" sx={{ display: "inline-block" }}>
          <Typography variant={wordmarkVariant} sx={{ fontWeight: 500 }}>
            Listo
          </Typography>
        </Box>
      )}
    </span>
  );
}
