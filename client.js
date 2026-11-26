/**
 * Aurora background — browser half.
 *
 * Paints a slowly drifting aurora on the document pseudo-elements (one layer
 * below the whole application), folds a glass token layer into the active
 * theme, and registers the "Dynamic background" row in General Settings.
 * Artwork only: no host surface is replaced, and every layer is click-through.
 */

const CSS = `
/* ============================================================
   Aurora background — plugin-owned global artwork and row chrome
   ============================================================ */

html[data-dsh-aurora] {
  background-color: transparent;
  --aurora-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)' opacity='0.16'/%3E%3C/svg%3E");
  --aurora-star-opacity: 0.24;
}

html[data-dsh-aurora] body {
  isolation: isolate;
  background-color: transparent;
}

/* Open the Conversation to the artwork: the column keeps its own veil while
   the conversation shell stops painting a second one, so the aurora reads
   behind the transcript, the blank home, and the composer. The data-phase
   attribute is the Conversation root's own contract, present in every phase. */
html[data-dsh-aurora] [data-phase='hero'],
html[data-dsh-aurora] [data-phase='settling'],
html[data-dsh-aurora] [data-phase='active'] {
  background-color: transparent;
}

html[data-dsh-aurora]::before,
html[data-dsh-aurora]::after,
html[data-dsh-aurora] body::before,
html[data-dsh-aurora] body::after {
  content: '';
  position: fixed;
  z-index: -1;
  pointer-events: none;
  background-repeat: no-repeat;
}

/* Ground: palette wash, vignette relief, and a whisper of film grain. */
html[data-dsh-aurora]::before {
  inset: 0;
  background-image: var(--aurora-base), var(--aurora-grain);
  background-repeat: no-repeat, repeat;
  background-size: cover, 180px 180px;
  background-blend-mode: normal, soft-light;
}

/* Star field: sits behind the ribbons, so the aurora reads in front of it. */
html[data-dsh-aurora]::after {
  inset: 0;
  background-image: var(--aurora-stars);
  background-size: 340px 300px;
  opacity: var(--aurora-star-opacity);
  animation: dsh-aurora-twinkle 7s ease-in-out infinite;
}

/* Curtain A: big soft ribbons swinging across the window. */
html[data-dsh-aurora] body::before {
  inset: -16vmax;
  background-image: var(--aurora-blobs-a);
  background-size: 100% 100%;
  animation: dsh-aurora-drift-a 24s ease-in-out infinite;
  will-change: transform;
}

/* Curtain B: a slow orbit carrying the bright nuclei and the sweep. */
html[data-dsh-aurora] body::after {
  inset: -24vmax;
  background-image: var(--aurora-sweep), var(--aurora-blobs-b);
  background-size: 100% 100%, 100% 100%;
  animation: dsh-aurora-orbit-b 120s linear infinite;
  will-change: transform;
}

html[data-dsh-aurora][data-dsh-aurora-scheme='dark'] body::after {
  mix-blend-mode: screen;
}

html[data-dsh-aurora][data-dsh-aurora-motion='off']::after,
html[data-dsh-aurora][data-dsh-aurora-motion='off'] body::before,
html[data-dsh-aurora][data-dsh-aurora-motion='off'] body::after {
  animation: none;
  will-change: auto;
}

/* ---------- Aurora (teal / violet / rose) ---------- */

html[data-dsh-aurora='aurora'] {
  --aurora-base:
    radial-gradient(120% 100% at 8% -18%, #dbeafe 0%, rgba(250, 248, 243, 0) 58%),
    radial-gradient(100% 90% at 96% -6%, #ede9fe 0%, rgba(250, 248, 243, 0) 54%),
    radial-gradient(130% 110% at 50% 116%, #ccfbf1 0%, rgba(250, 248, 243, 0) 60%),
    radial-gradient(140% 120% at 50% 45%, rgba(250, 248, 243, 0) 45%, rgba(78, 68, 58, 0.07) 100%),
    linear-gradient(175deg, #faf8f3 0%, #f4f1ea 55%, #fbf9f5 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 18% 26%, rgba(45, 212, 191, 0.44) 0%, rgba(45, 212, 191, 0) 100%),
    radial-gradient(50% 46% at 78% 44%, rgba(139, 92, 246, 0.38) 0%, rgba(139, 92, 246, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 60% 24%, rgba(244, 114, 182, 0.32) 0%, rgba(244, 114, 182, 0) 100%),
    radial-gradient(44% 42% at 26% 74%, rgba(56, 189, 248, 0.34) 0%, rgba(56, 189, 248, 0) 100%),
    radial-gradient(12% 11% at 30% 30%, rgba(45, 212, 191, 0.34) 0%, rgba(45, 212, 191, 0) 100%),
    radial-gradient(10% 9% at 72% 68%, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(45, 212, 191, 0.16) 24deg,
      rgba(124, 92, 255, 0.15) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(236, 72, 153, 0.12) 222deg,
      rgba(56, 189, 248, 0.14) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

html[data-dsh-aurora='aurora'][data-dsh-aurora-scheme='dark'] {
  --aurora-star-opacity: 0.8;
  --aurora-base:
    radial-gradient(120% 100% at 8% -18%, #172554 0%, rgba(7, 8, 16, 0) 56%),
    radial-gradient(100% 90% at 96% -6%, #3b0764 0%, rgba(7, 8, 16, 0) 52%),
    radial-gradient(130% 110% at 50% 118%, #042f2e 0%, rgba(7, 8, 16, 0) 58%),
    radial-gradient(150% 130% at 50% 42%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.45) 100%),
    linear-gradient(175deg, #05060c 0%, #070812 52%, #05060b 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 18% 26%, rgba(45, 212, 191, 0.62) 0%, rgba(45, 212, 191, 0) 100%),
    radial-gradient(50% 46% at 78% 44%, rgba(124, 92, 255, 0.58) 0%, rgba(124, 92, 255, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 60% 24%, rgba(236, 72, 153, 0.44) 0%, rgba(236, 72, 153, 0) 100%),
    radial-gradient(44% 42% at 26% 74%, rgba(56, 189, 248, 0.44) 0%, rgba(56, 189, 248, 0) 100%),
    radial-gradient(12% 11% at 30% 30%, rgba(140, 255, 236, 0.55) 0%, rgba(140, 255, 236, 0) 100%),
    radial-gradient(10% 9% at 72% 68%, rgba(196, 181, 253, 0.45) 0%, rgba(196, 181, 253, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(45, 212, 191, 0.26) 24deg,
      rgba(124, 92, 255, 0.24) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(236, 72, 153, 0.18) 222deg,
      rgba(56, 189, 248, 0.2) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

/* ---------- Nebula (indigo / magenta / amber) ---------- */

html[data-dsh-aurora='nebula'] {
  --aurora-base:
    radial-gradient(120% 100% at 6% -16%, #e9e2ff 0%, rgba(250, 248, 246, 0) 58%),
    radial-gradient(100% 90% at 98% -6%, #ffe4f1 0%, rgba(250, 248, 246, 0) 54%),
    radial-gradient(130% 110% at 50% 118%, #ffe9c9 0%, rgba(250, 248, 246, 0) 58%),
    radial-gradient(140% 120% at 50% 45%, rgba(250, 248, 246, 0) 45%, rgba(70, 60, 78, 0.07) 100%),
    linear-gradient(175deg, #faf9f6 0%, #f4f1f6 55%, #fbf9f6 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 20% 28%, rgba(139, 92, 246, 0.44) 0%, rgba(139, 92, 246, 0) 100%),
    radial-gradient(50% 46% at 76% 42%, rgba(217, 70, 239, 0.36) 0%, rgba(217, 70, 239, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 58% 26%, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0) 100%),
    radial-gradient(44% 42% at 24% 74%, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0) 100%),
    radial-gradient(12% 11% at 32% 30%, rgba(139, 92, 246, 0.32) 0%, rgba(139, 92, 246, 0) 100%),
    radial-gradient(10% 9% at 70% 68%, rgba(217, 70, 239, 0.28) 0%, rgba(217, 70, 239, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(139, 92, 246, 0.17) 24deg,
      rgba(217, 70, 239, 0.14) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(245, 158, 11, 0.1) 222deg,
      rgba(56, 189, 248, 0.1) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

html[data-dsh-aurora='nebula'][data-dsh-aurora-scheme='dark'] {
  --aurora-star-opacity: 0.88;
  --aurora-base:
    radial-gradient(120% 100% at 6% -16%, #2e1065 0%, rgba(5, 4, 12, 0) 56%),
    radial-gradient(100% 90% at 98% -6%, #4a044e 0%, rgba(5, 4, 12, 0) 52%),
    radial-gradient(130% 110% at 50% 118%, #0e7490 0%, rgba(5, 4, 12, 0) 56%),
    radial-gradient(150% 130% at 50% 42%, rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.5) 100%),
    linear-gradient(175deg, #05040c 0%, #070610 52%, #05040b 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 20% 28%, rgba(217, 70, 239, 0.5) 0%, rgba(217, 70, 239, 0) 100%),
    radial-gradient(52% 48% at 76% 44%, rgba(99, 102, 241, 0.62) 0%, rgba(99, 102, 241, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 58% 26%, rgba(245, 158, 11, 0.36) 0%, rgba(245, 158, 11, 0) 100%),
    radial-gradient(44% 42% at 24% 74%, rgba(34, 211, 238, 0.42) 0%, rgba(34, 211, 238, 0) 100%),
    radial-gradient(12% 11% at 32% 30%, rgba(240, 171, 252, 0.5) 0%, rgba(240, 171, 252, 0) 100%),
    radial-gradient(10% 9% at 70% 68%, rgba(99, 102, 241, 0.45) 0%, rgba(99, 102, 241, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(217, 70, 239, 0.24) 24deg,
      rgba(99, 102, 241, 0.26) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(245, 158, 11, 0.14) 222deg,
      rgba(34, 211, 238, 0.16) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

/* ---------- Sakura (rose / peach / lilac) ---------- */

html[data-dsh-aurora='sakura'] {
  --aurora-base:
    radial-gradient(120% 100% at 8% -16%, #ffe4e6 0%, rgba(255, 249, 246, 0) 58%),
    radial-gradient(100% 90% at 96% -6%, #ffe8d6 0%, rgba(255, 249, 246, 0) 54%),
    radial-gradient(130% 110% at 50% 118%, #e0f2f1 0%, rgba(255, 249, 246, 0) 58%),
    radial-gradient(140% 120% at 50% 45%, rgba(255, 249, 246, 0) 45%, rgba(90, 66, 72, 0.07) 100%),
    linear-gradient(175deg, #fff9f6 0%, #fbf1ee 55%, #fffaf7 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 18% 26%, rgba(244, 114, 182, 0.4) 0%, rgba(244, 114, 182, 0) 100%),
    radial-gradient(50% 46% at 76% 44%, rgba(251, 146, 60, 0.34) 0%, rgba(251, 146, 60, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 60% 24%, rgba(167, 139, 250, 0.3) 0%, rgba(167, 139, 250, 0) 100%),
    radial-gradient(44% 42% at 24% 74%, rgba(45, 212, 191, 0.26) 0%, rgba(45, 212, 191, 0) 100%),
    radial-gradient(12% 11% at 30% 30%, rgba(244, 114, 182, 0.32) 0%, rgba(244, 114, 182, 0) 100%),
    radial-gradient(10% 9% at 72% 68%, rgba(251, 146, 60, 0.26) 0%, rgba(251, 146, 60, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(244, 114, 182, 0.16) 24deg,
      rgba(251, 146, 60, 0.12) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(167, 139, 250, 0.12) 222deg,
      rgba(45, 212, 191, 0.1) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

html[data-dsh-aurora='sakura'][data-dsh-aurora-scheme='dark'] {
  --aurora-star-opacity: 0.72;
  --aurora-base:
    radial-gradient(120% 100% at 8% -16%, #4c0519 0%, rgba(12, 7, 16, 0) 56%),
    radial-gradient(100% 90% at 96% -6%, #1e1b4b 0%, rgba(12, 7, 16, 0) 52%),
    radial-gradient(130% 110% at 50% 118%, #164e63 0%, rgba(12, 7, 16, 0) 56%),
    radial-gradient(150% 130% at 50% 42%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.46) 100%),
    linear-gradient(175deg, #0c0710 0%, #100a14 52%, #0b0710 100%);
  --aurora-blobs-a:
    radial-gradient(46% 44% at 18% 26%, rgba(244, 114, 182, 0.6) 0%, rgba(244, 114, 182, 0) 100%),
    radial-gradient(50% 46% at 76% 44%, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 100%);
  --aurora-blobs-b:
    radial-gradient(42% 40% at 60% 24%, rgba(167, 139, 250, 0.44) 0%, rgba(167, 139, 250, 0) 100%),
    radial-gradient(44% 42% at 24% 74%, rgba(45, 212, 191, 0.32) 0%, rgba(45, 212, 191, 0) 100%),
    radial-gradient(12% 11% at 30% 30%, rgba(249, 168, 212, 0.52) 0%, rgba(249, 168, 212, 0) 100%),
    radial-gradient(10% 9% at 72% 68%, rgba(196, 181, 253, 0.4) 0%, rgba(196, 181, 253, 0) 100%);
  --aurora-sweep:
    conic-gradient(from 0deg at 52% 48%,
      rgba(0, 0, 0, 0) 0deg,
      rgba(244, 114, 182, 0.26) 24deg,
      rgba(251, 146, 60, 0.16) 52deg,
      rgba(0, 0, 0, 0) 86deg,
      rgba(0, 0, 0, 0) 190deg,
      rgba(167, 139, 250, 0.2) 222deg,
      rgba(45, 212, 191, 0.14) 254deg,
      rgba(0, 0, 0, 0) 288deg);
}

/* Star field: light schemes keep only a faint dusting. */
html[data-dsh-aurora] {
  --aurora-stars:
    radial-gradient(1.5px 1.5px at 28px 42px, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1.1px 1.1px at 118px 24px, rgba(200, 225, 255, 0.8), rgba(200, 225, 255, 0) 100%),
    radial-gradient(1.2px 1.2px at 206px 96px, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1px 1px at 300px 58px, rgba(190, 215, 255, 0.65), rgba(190, 215, 255, 0) 100%),
    radial-gradient(1.4px 1.4px at 62px 168px, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1px 1px at 158px 208px, rgba(215, 230, 255, 0.7), rgba(215, 230, 255, 0) 100%),
    radial-gradient(1.3px 1.3px at 262px 178px, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1px 1px at 330px 236px, rgba(200, 220, 255, 0.6), rgba(200, 220, 255, 0) 100%),
    radial-gradient(1.2px 1.2px at 96px 268px, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1px 1px at 18px 220px, rgba(205, 225, 255, 0.6), rgba(205, 225, 255, 0) 100%),
    radial-gradient(1.5px 1.5px at 178px 130px, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 100%),
    radial-gradient(1px 1px at 244px 262px, rgba(220, 235, 255, 0.6), rgba(220, 235, 255, 0) 100%);
}

@keyframes dsh-aurora-drift-a {
  0%, 100% { transform: translate3d(-6%, -2%, 0) rotate(-5deg) scale(1.02); }
  50% { transform: translate3d(6%, 3%, 0) rotate(7deg) scale(1.16); }
}

@keyframes dsh-aurora-orbit-b {
  from { transform: rotate(0deg) scale(1.07); }
  to { transform: rotate(360deg) scale(1.07); }
}

@keyframes dsh-aurora-twinkle {
  0%, 100% { opacity: calc(var(--aurora-star-opacity) * 0.45); }
  50% { opacity: var(--aurora-star-opacity); }
}

/* ---------- Hero whale: an occasional leap ---------- */

/* Independent transform properties on purpose: the host's hover swim animates
   transform on the same mark, so a leap composes with a swim instead of
   replacing it. The hitbox stays put, keeping hover detection stationary. */
@keyframes dsh-whale-leap {
  0%, 36% { translate: 0 0; rotate: 0deg; scale: 1; }
  38% { translate: 0 2px; rotate: 0deg; scale: 1.04 0.9; }
  42% { translate: -2px -30px; rotate: -14deg; scale: 0.98 1.05; }
  46% { translate: -6px -36px; rotate: -2deg; scale: 1; }
  50% { translate: 2px -18px; rotate: 12deg; scale: 1; }
  53% { translate: 4px 0; rotate: 0deg; scale: 1.04 0.9; }
  56%, 100% { translate: 0 0; rotate: 0deg; scale: 1; }
}

html[data-dsh-aurora] [data-slot='conversation.hero.brand.mark'] > svg {
  animation: dsh-whale-leap var(--dsh-whale-cycle, 17s) cubic-bezier(0.36, 0.07, 0.19, 0.97) var(--dsh-whale-delay, 0s) infinite;
  will-change: translate, rotate, scale;
}

html[data-dsh-aurora][data-dsh-aurora-motion='off'] [data-slot='conversation.hero.brand.mark'] > svg {
  animation: none;
  will-change: auto;
}

/* ---------- General Settings row ---------- */

.dsh-aurora {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
}

.dsh-aurora-title {
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.dsh-aurora-description {
  margin-top: 4px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

.dsh-aurora-options {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 8px;
}

.dsh-aurora-chip {
  box-sizing: border-box;
  flex: 1 1 108px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

@media (hover: hover) {
  .dsh-aurora-chip:hover:not(.dsh-aurora-chip-selected) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

.dsh-aurora-chip-selected {
  border-color: var(--dsw-alias-border-selected);
  background: var(--dsw-alias-bg-module-platform);
}

.dsh-aurora-chip-art {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: var(--dsw-radius-sm);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.18);
}

.dsh-aurora-chip-art[data-variant='aurora'] {
  background-image: linear-gradient(135deg, #0b1b2e 0%, #12796f 42%, #6d4bff 76%, #ff5ca8 100%);
}

.dsh-aurora-chip-art[data-variant='nebula'] {
  background-image: linear-gradient(135deg, #0a0618 0%, #3b1e8f 42%, #c026d3 78%, #f59e0b 100%);
}

.dsh-aurora-chip-art[data-variant='sakura'] {
  background-image: linear-gradient(135deg, #2a0f1a 0%, #c2476b 44%, #f7a8b8 78%, #ffd9c2 100%);
}

.dsh-aurora-chip-art[data-variant='off'] {
  background-image: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
}

.dsh-aurora-chip-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-aurora-motion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

.dsh-aurora-switch {
  position: relative;
  flex: none;
  box-sizing: content-box;
  width: 32px;
  height: 16px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  background: var(--dsw-alias-border-l3);
  cursor: pointer;
  transition: background var(--ds-transition-duration) var(--ds-ease-in-out);
}

.dsh-aurora-switch:focus-visible {
  outline-offset: 2px;
}

.dsh-aurora-switch[aria-checked='true'] {
  background: var(--dsw-alias-brand-primary);
}

.dsh-aurora-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-switch-thumb);
  transition: transform var(--ds-transition-duration) var(--ds-ease-in-out);
}

.dsh-aurora-switch[aria-checked='true'] .dsh-aurora-knob {
  transform: translateX(16px);
}

@media (max-width: 767px) {
  .dsh-aurora-chip {
    flex: 1 1 0;
    padding: 8px 6px;
    gap: 6px;
    font-size: 12px;
  }
}
`

const PLUGIN_ID = 'dsh-aurora-background'
const NS = 'settings.aurora'
const VARIANT_KEY = 'dsh.aurora.variant'
const MOTION_KEY = 'dsh.aurora.motion'
const VARIANTS = ['aurora', 'nebula', 'sakura', 'off']

/** Glass token layer folded over whatever base palette the user selected. */
const TOKENS = {
  '--dsw-alias-bg-base': { light: 'rgba(250, 248, 243, 0.66)', dark: 'rgba(9, 11, 20, 0.55)' },
  '--dsw-alias-bg-layer-1': { light: '#fbf9f4', dark: '#10131f' },
  '--dsw-alias-bg-layer-2': { light: '#f5f2ea', dark: '#151928' },
  '--dsw-alias-bg-layer-3': { light: '#eeeae0', dark: '#1b2034' },
  '--dsw-alias-bg-overlay': { light: '#fbfaf6', dark: '#141828' },
  '--dsw-specific-sidebar-fill': { light: 'rgba(250, 248, 242, 0.62)', dark: 'rgba(10, 12, 21, 0.62)' },
  '--dsw-specific-sidebar-tint': { light: 'rgba(250, 248, 242, 0.62)', dark: 'rgba(9, 11, 19, 0.55)' },
  '--dsw-specific-input-major': { light: '#fffdf9', dark: '#151a2b' },
  '--dsw-specific-bubble': { light: 'rgba(219, 232, 255, 0.66)', dark: 'rgba(32, 39, 62, 0.62)' },
  '--dsw-specific-bubble-highlight': { light: 'rgba(96, 134, 214, 0.22)', dark: 'rgba(96, 134, 214, 0.35)' },
  '--dsw-alias-markdown-code-block': { light: 'rgba(246, 243, 236, 0.88)', dark: 'rgba(13, 16, 27, 0.86)' },
  '--dsw-alias-markdown-code-block-banner': { light: 'rgba(238, 234, 224, 0.9)', dark: 'rgba(22, 26, 42, 0.86)' },
  '--dsw-alias-markdown-inline-code': { light: 'rgba(233, 228, 216, 0.7)', dark: 'rgba(34, 39, 58, 0.62)' },
  '--dsw-alias-border-l1': { light: 'rgba(40, 50, 70, 0.07)', dark: 'rgba(150, 180, 255, 0.08)' },
  '--dsw-alias-border-l2': { light: 'rgba(40, 50, 70, 0.11)', dark: 'rgba(150, 180, 255, 0.14)' },
  '--dsw-alias-border-l3': { light: 'rgba(40, 50, 70, 0.15)', dark: 'rgba(160, 190, 255, 0.18)' },
  '--dsw-alias-border-l4': { light: 'rgba(40, 50, 70, 0.2)', dark: 'rgba(170, 200, 255, 0.24)' },
  '--dsw-alias-interactive-bg-hover': { light: 'rgba(40, 50, 70, 0.06)', dark: 'rgba(150, 185, 255, 0.1)' },
}

const ZH = {
  'title': '动态背景',
  'description': '在界面下方绘制缓慢流动的极光，并让侧栏与会话呈现半透明的玻璃质感；输入框保持不透明，方便书写。',
  'group.label': '背景样式',
  'variant.aurora': '极光',
  'variant.nebula': '星云',
  'variant.sakura': '樱花',
  'variant.off': '关闭',
  'motion.label': '缓慢流动',
}

const EN = {
  'title': 'Dynamic background',
  'description': 'Paints a slowly drifting aurora behind the interface and gives the sidebar and conversation a translucent glass finish; the composer stays opaque for writing.',
  'group.label': 'Background style',
  'variant.aurora': 'Aurora',
  'variant.nebula': 'Nebula',
  'variant.sakura': 'Sakura',
  'variant.off': 'Off',
  'motion.label': 'Slow drift',
}

window.__ModuleLoader__.load({
  id: PLUGIN_ID,
  factory(require) {
    const React = require('react')

    /** Read a persisted value, tolerating a disabled or unavailable storage. */
    function readStored(key) {
      try {
        const value = window.localStorage.getItem(key)
        return typeof value === 'string' ? value : undefined
      } catch {
        return undefined
      }
    }

    /** Persist a preference without letting a storage failure break the UI. */
    function writeStored(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        /* storage may be disabled; the choice stays for this page session */
      }
    }

    const storedVariant = readStored(VARIANT_KEY)
    const prefersReducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // macOS "Reduce transparency": keep the host's opaque surfaces and let the
    // artwork show only where the shell is already transparent.
    const prefersReducedTransparency = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    const storedMotion = readStored(MOTION_KEY)

    const state = {
      variant: VARIANTS.includes(storedVariant)
        ? storedVariant
        : (prefersReducedTransparency ? 'off' : 'aurora'),
      motion: storedMotion === undefined ? !prefersReducedMotion : storedMotion === 'on',
    }

    const listeners = new Set()
    let ctx
    let disposeTokens

    /** Publish the current state to the document and the theme token layer. */
    function refresh() {
      const root = document.documentElement
      if (state.variant === 'off' || ctx === undefined) {
        if (disposeTokens !== undefined) {
          disposeTokens()
          disposeTokens = undefined
        }
        delete root.dataset.dshAurora
        delete root.dataset.dshAuroraScheme
        delete root.dataset.dshAuroraMotion
        return
      }
      root.dataset.dshAurora = state.variant
      root.dataset.dshAuroraScheme = ctx.theme.getTheme().active.colorScheme
      root.dataset.dshAuroraMotion = state.motion ? 'on' : 'off'
      if (!prefersReducedTransparency && disposeTokens === undefined) {
        disposeTokens = ctx.theme.overrideTokens(PLUGIN_ID, TOKENS)
      }
    }

    /** Notify the mounted settings row. */
    function notify() {
      for (const listener of listeners) listener()
    }

    function setVariant(id) {
      if (!VARIANTS.includes(id) || state.variant === id) return
      state.variant = id
      writeStored(VARIANT_KEY, id)
      refresh()
      notify()
    }

    function setMotion(enabled) {
      if (state.motion === enabled) return
      state.motion = enabled
      writeStored(MOTION_KEY, enabled ? 'on' : 'off')
      refresh()
      notify()
    }

    /** The General Settings row: variant chips plus the motion switch. */
    function AuroraRow({ t }) {
      const [version, setVersion] = React.useState(0)
      React.useEffect(() => {
        const bump = () => { setVersion(value => value + 1) }
        listeners.add(bump)
        return () => { listeners.delete(bump) }
      }, [])
      void version
      return React.createElement('div', { className: 'dsh-aurora' },
        React.createElement('div', null,
          React.createElement('div', { className: 'dsh-aurora-title' }, t('title')),
          React.createElement('div', { className: 'dsh-aurora-description' }, t('description')),
        ),
        React.createElement('div', {
          className: 'dsh-aurora-options',
          role: 'group',
          'aria-label': t('group.label'),
        }, VARIANTS.map(id => React.createElement('button', {
          key: id,
          type: 'button',
          'aria-pressed': state.variant === id,
          className: `dsh-aurora-chip${state.variant === id ? ' dsh-aurora-chip-selected' : ''}`,
          onClick: () => { setVariant(id) },
        },
        React.createElement('span', {
          className: 'dsh-aurora-chip-art', 'data-variant': id, 'aria-hidden': true,
        }),
        React.createElement('span', { className: 'dsh-aurora-chip-label' }, t(`variant.${id}`)),
        ))),
        state.variant === 'off' ? null : React.createElement('div', { className: 'dsh-aurora-motion' },
          React.createElement('span', null, t('motion.label')),
          React.createElement('button', {
            type: 'button',
            role: 'switch',
            'aria-checked': state.motion,
            'aria-label': t('motion.label'),
            className: 'dsh-aurora-switch',
            onClick: () => { setMotion(!state.motion) },
          }, React.createElement('span', { className: 'dsh-aurora-knob', 'aria-hidden': true })),
        ),
      )
    }

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(clientCtx) {
        ctx = clientCtx

        clientCtx.effect(() => {
          const style = document.createElement('style')
          style.dataset.plugin = PLUGIN_ID
          style.dataset.pluginCss = `${PLUGIN_ID}/aurora.css`
          style.textContent = CSS
          document.head.appendChild(style)
          return () => { style.remove() }
        }, 'aurora-background: artwork stylesheet')

        clientCtx.effect(() => clientCtx.locale.register(NS, { zh: ZH, en: EN }),
          'aurora-background: row dictionaries')

        clientCtx.effect(() => {
          // Random cadence for the hero whale: a different rhythm each load.
          const whaleCycle = 14 + Math.random() * 8
          document.documentElement.style.setProperty('--dsh-whale-cycle', `${whaleCycle.toFixed(2)}s`)
          document.documentElement.style.setProperty(
            '--dsh-whale-delay', `${(Math.random() * whaleCycle * 0.5).toFixed(2)}s`)
          refresh()
          const offTheme = clientCtx.on('theme/change', (snapshot) => {
            if (state.variant === 'off') return
            document.documentElement.dataset.dshAuroraScheme = snapshot.active.colorScheme
          })
          return () => {
            offTheme()
            if (disposeTokens !== undefined) {
              disposeTokens()
              disposeTokens = undefined
            }
            ctx = undefined
            const root = document.documentElement
            root.style.removeProperty('--dsh-whale-delay')
            root.style.removeProperty('--dsh-whale-cycle')
            delete root.dataset.dshAurora
            delete root.dataset.dshAuroraScheme
            delete root.dataset.dshAuroraMotion
          }
        }, 'aurora-background: artwork layers and glass tokens')

        clientCtx.slots.inject('settings.general.item', () => clientCtx.slots.register({
          name: 'settings.general.item',
          id: 'aurora-background',
          order: 12,
          locale: NS,
        }, AuroraRow))
      },
    }
  },
})
