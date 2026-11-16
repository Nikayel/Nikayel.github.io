# Nikayel Jamal — portfolio

Static HTML and CSS, ready for GitHub Pages. No install or build step is needed.

## Preview locally

Run `python3 -m http.server 8000` in this directory, then visit
`http://localhost:8000/case-study.html`.

## Add the Pilet case study content

Edit `case-study.html`. All seven requested sections are in order, with stable
anchor links. Search for `data-placeholder` to find the copy to replace. Remove
that attribute from each element after adding your final text; this gives final
copy the regular text color. Update the role, team, and timeline near the top.

Search for `FINAL CONCEPT`, `PROTOTYPES`, and `DEMO` for the media slots:

- Replace a `.media-placeholder` element with an image. Keep its surrounding
  figure and caption. Add descriptive alt text and explicit dimensions.
- For example: `<img src="assets/pilet-final.webp" alt="Describe the actual screen" width="1440" height="900">`.
- Use `loading="lazy"` for prototype images below the first screenshot.
- Replace the demo placeholder with a native `<video controls preload="metadata" playsinline>`
  element, a local `<source src="assets/pilet-demo.mp4" type="video/mp4">`, a
  poster image, and a captions track when the video contains speech.
- Replace the captions and remove the `caption-status` span once the media is added.
- Duplicate the `decision-trail` list to document additional
  assumption → finding → decision examples.
- Remove the `draft-note` paragraph when the case study is ready.

The case study preserves the homepage hero's Helvetica Neue / Avenir Next font
stack. Its CSS is scoped to `.case-page` and the new page's component classes.
The shared homepage styles remain unchanged.

`case-study.js` adds an active chapter indicator and optional, brief entrance
animations using the pinned Motion mini 14.11.1 CDN module. The page, links, and
content work without JavaScript or CDN access. Reduced-motion preferences disable
the animations. See the [Motion documentation](https://motion.dev/docs/wordpress)
for the mini entry point.
