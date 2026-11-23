# Nikayel Jamal — portfolio

Static HTML and CSS, ready for GitHub Pages. No install or build step is needed.

## Preview locally

Run `python3 -m http.server 8000` in this directory, then visit
`http://localhost:8000/case-study.html`.

## Pilet case study

`case-study.html` is the Pilet case study from SI 511. Its source documents live in
`source-docs/`, which is gitignored because it holds interview notes and recordings.
Don't publish anything from that folder.

To add the demo video, put the files in `assets/`, uncomment the `<video>` in the
`DEMO` comment in `case-study.html`, and remove the `hidden` attribute from its figure.
Add the remaining teammates and their portfolio links in the Team fact and the Credits block.
