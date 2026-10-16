# Space Exploration Quiz

A dependency-free, browser-based quiz about space exploration. Answer 10
randomly ordered questions, learn a fact after each answer, and review missed
answers on the results screen.

The app supports keyboard controls, light and dark color schemes, and reduced
motion preferences. Its HTML, CSS, question data, and JavaScript all live in
`index.html`; no installation or build step is required.

## Play online

Visit **https://gangcat96.github.io/space-quiz/**.

## Run locally

Open `index.html` directly in a modern browser.

Alternatively, with Python installed, run this command from the repository root:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. Stop the server with `Ctrl+C`.

## Controls

- Click an answer or press `A`-`D` / `1`-`4`.
- Use the up and down arrow keys to move between answers.
- Press `Enter` to activate the focused button and advance after answering.
- Select **Play again** on the results screen to restart.

## Deployment

GitHub Pages uses **GitHub Actions** as its publishing source under
**Settings > Pages > Build and deployment**.

The workflow in `.github/workflows/pages.yml` checks that `index.html` is
nonempty and packages it on pull requests targeting `main`. After a push or
merge to `main`, it uploads only the website file and deploys it to the
`github-pages` environment. It can also be run manually from the Actions tab
with `main` selected. Pull requests never deploy the live site.

No framework build, package installation, or custom deployment secret is needed.
Deployment uses the workflow's short-lived `GITHUB_TOKEN` and OIDC permissions.
