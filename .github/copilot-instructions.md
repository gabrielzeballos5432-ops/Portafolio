# Copilot Instructions

## Project structure

This is a single-page portfolio site. `index.html` owns the Spanish page content and section anchors, `style.css` provides the presentation and responsive visual effects, and `script.js` provides the small set of browser interactions. Keep these responsibilities aligned: use section IDs and links in the HTML for in-page navigation, styles in the stylesheet, and behavior in the script.

## Build and validation

There is no configured build, test, or lint command. The site is served directly from `index.html`; changes can be checked in a browser. Keep the existing relative references to `style.css` and `script.js` working.

## Conventions

- Keep visitor-facing content and navigation labels in Spanish.
- Technology badges use SVG logos from Devicon's pinned CDN and Simple Icons for Wireshark, with visible text labels and empty image alt text. Keep the labels readable if external images are unavailable.
- The HTML calls `scrollToProjects()` and `mensaje()` through inline button handlers; preserve these function names and their availability in `script.js` when changing those controls.
- The card reveal effect depends on `.card` elements in the HTML, the `.visible` state in `style.css`, and the scroll listener in `script.js`; update the connected pieces together if changing that behavior.
