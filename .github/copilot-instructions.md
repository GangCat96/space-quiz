# Repository instructions

## Run and validate

- This is a dependency-free static page. Open `index.html` directly in a browser to run it.
- Alternatively, from the repository root, run `python -m http.server 8000` and open `http://localhost:8000`.
- There is no build, test, or lint configuration, and therefore no automated or single-test command. Validate changes in a browser; exercise answering, next-question and restart flows, keyboard controls, and the reduced-motion and color-scheme preferences when those behaviors are affected.

## Architecture

- The app is intentionally implemented in one file, `index.html`: document structure, CSS, question data, quiz logic, and canvas effects are colocated. There is no framework or module/build pipeline.
- `QUESTIONS` is the quiz source of truth. Each entry has `q` (prompt), `a` (ordered answer strings), `c` (zero-based correct-answer index), and `f` (feedback fact).
- Quiz state (`idx`, `score`, `answered`, and `history`) is managed by the page script. `renderQuestion()` replaces the card contents and binds handlers; `choose()` locks and marks answers, updates score/feedback/progress; `next()` advances or calls `renderResults()`. Restart resets state and renders the first question.
- The starfield is a separate immediately invoked function that owns canvas sizing, drawing, and its animation loop. The rest of the visual effects are CSS animations, with the results screen optionally adding confetti.

## Codebase conventions

- Keep the no-dependency, browser-native implementation unless a requested change requires a different architecture. Put new quiz content in `QUESTIONS` and preserve its existing entry shape and zero-based answer indexing.
- Keep presentation in the embedded stylesheet and use the existing CSS custom properties for theme colors. Dark mode and reduced motion are driven by `prefers-color-scheme` and `prefers-reduced-motion`; preserve those behaviors for new visual effects.
- Preserve accessible interaction patterns: semantic buttons, visible focus styling, focus movement after answering and between questions, keyboard shortcuts (A–D/1–4, arrow keys, Enter), and reduced-motion handling.
- The page builds portions of the card with template strings and `innerHTML`. Those interpolated values currently come from the hard-coded `QUESTIONS` data; do not place user-controlled or external content in these templates without safely escaping it or rendering it as text.
