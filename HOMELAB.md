# Jellyfish homelab checkout

This branch is the editable Jellyfin Web source used by the homelab media
stack. The source is kept separate from the Jellyfin Server configuration and
database. Build and deployment are handled by the homelab helper documented in
`/opt/media-stack/README.md` and do not recreate the server configuration.

Keep credentials, API keys, generated `dist/` output, and machine-specific
configuration out of this repository. The normal workflow is:

```text
edit source -> git diff -> /opt/media-stack/scripts/rebuild-jellyfish.sh
-> verify -> git commit -> git push origin custom-ui
```

The official Jellyfin Web repository remains configured as the `upstream`
remote so updates can be reviewed and merged explicitly.
