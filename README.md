# Aurora background

A dynamic background theme for the DeepSeek Harness Web GUI: slowly drifting
aurora ribbons behind the interface, a translucent glass finish on the sidebar
and the conversation, an opaque composer that stays easy to write in, and an
occasional leap from the hero whale on the blank home.

Animated aurora background for DSH / DSH 的动态极光背景主题。

## What it does

- Paints three switchable palettes behind the whole window:
  **Aurora** (teal / violet / rose), **Nebula** (indigo / magenta / amber),
  **Sakura** (rose / peach / lilac). Each has its own light and dark artwork.
- Keeps the artwork in motion: one ribbon curtain swings on a 24s curve, a
  second orbits on a 120s turn with bright nuclei and a conic sweep, and the
  star field twinkles on a 7s cycle.
- Folds a glass token layer over the active palette, so the sidebar,
  conversation, bubbles, code blocks, and cards read as translucent surfaces.
  The composer and the other input-like surfaces (attachment cards, approval
  panels) stay opaque so text on them always keeps full contrast.
- Leaps the hero whale once every 14–22 seconds (randomised per page load) on
  the blank home; it composes with the host's hover swim.
- Adds one row to **Settings → General → Dynamic background**: three style
  chips, an Off chip, and a **Slow drift** switch.

## Install

The package declares a DSH bundle patch, so any of these work:

1. **Web GUI**: open **Plugins**, use **Add plugin**, and pick the packed
   `*.tgz` (or the extracted package directory).
2. **Agent / tool**: call `plugin_manager` with `action: "install_bundle"` and
   the absolute path of the `.tgz` (or of this directory).
3. **Registry**: publish the package to an npm registry you can reach, then
   install it by name through the same flow.

No dependency install, build step, or Host-side code is required: the bundle
ships plain files, and the browser half is loaded from `client.js`.

Refresh the page after installing (a new client module is read at page load).
If the settings row does not appear, restart the Desktop app.

## Install from the plugin market

DSH's **Discover** tab installs bundles from *plugin indexes*: format-1 JSON
documents that anyone can host on a static https host. This repository is both
the package and its index.

1. Open **Plugins**, switch on **Custom plugin indexes** under experimental
   plugins, and select **Discover**.
2. **Add index source** with:
   `https://raw.githubusercontent.com/hippone/dsh-aurora-background/main/market/index.json`
3. Install the **Aurora background** entry and confirm its source.

The index pins the Git commit it was generated from, so a published version
keeps installing the same code. [`market/README.zh.md`](market/README.zh.md)
documents hosting it elsewhere, regenerating it for a new version
(`node market/build-index.mjs`), and switching the entry to an npm source after
`npm publish`.

## Use

- **Settings → General → Dynamic background** chooses the style or turns the
  background off.
- **Slow drift** stops the animation but keeps the artwork.
- Choices are remembered per browser (`localStorage`), and the theme is on by
  default after install.
- The theme follows the light/dark appearance; it starts **off** when the OS
  asks for reduced transparency, and starts **static** when the OS asks for
  reduced motion. The switch still lets you override both.
- Turning the background off restores the default DSH appearance immediately
  and releases every token override and timer it registered.

## Notes and limitations

- The artwork is painted on document pseudo-elements below the application, so
  it never intercepts clicks and never replaces a host surface.
- The opened conversation shows the artwork through the frame's veil; with that
  much transparency, scrolled text is faintly visible under the composer fade
  and under sticky headers. Raise `--dsw-alias-bg-base` in `TOKENS` (in
  `client.js`) for a more opaque conversation, or lower it for more artwork.
- Third-party theme registration remains an in-process extension: this bundle
  contributes artwork plus an alias-token layer, not a new entry in the
  built-in Light/Dark/System picker.

## Package layout

| Path | Role |
|---|---|
| `package.json` | Manifest, `dsh.bundle.patch`, `dsh.client` entry, packaged files |
| `cordis.patch.yml` | Inserts the `aurora-background` row |
| `index.js` | Host half (empty; the Client owns the artwork) |
| `client.js` | Browser half: artwork CSS, theme token layer, settings row, whale leap |
| `locale/{zh,en}.json` | Plugin Manager title, description, detail document |
| `docs/DETAIL*.md`, `docs/preview.svg` | Feature image for the bundle detail page |
| `icon.svg` | Plugin row icon |
| `LICENSE` | MIT |
| `market/` | Plugin index, its icon, the generator, and the publishing guide |

## Uninstall

Remove the bundle from **Plugins** (or `plugin_manager` `remove_bundle`). All
styles, attributes, and token overrides are disposed with the plugin.
