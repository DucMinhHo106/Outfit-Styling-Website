# StyleMIX on Cloudflare Pages

Production URL: https://stylemix.pages.dev/
Cloudflare Pages project: stylemix; production branch: main.
Source remains in the original GitHub repository. Deploy only root HTML and assets; do not upload Git metadata, docs or tests.

The site is buildless. Prepare a runtime directory containing root HTML and assets, then run:

```powershell
wrangler pages deploy <runtime-directory> --project-name stylemix --branch main
```

Check the deployment result and production HTML/photos after publishing. Both portfolio demo links use the Cloudflare URL. GitHub source links remain repository links.
