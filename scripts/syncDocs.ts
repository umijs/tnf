import 'zx/globals';

const DOCS_DIR = path.join(__dirname, '../third-party-docs');
const DOCS_MAP = {
  mako: {
    repo: 'umijs/mako',
    branch: 'master',
    docsDir: 'docs',
    paths: ['config.md'],
  },
  tanstackRouter: {
    repo: 'tanstack/router',
    branch: 'main',
    docsDir: 'docs/framework/react',
    paths: ['api/router.md'],
  },
};

(async () => {
  for (const [pkg, info] of Object.entries(DOCS_MAP)) {
    console.log(`Syncing docs for ${pkg}...`);
    const { repo, branch, docsDir, paths } = info;
    const repoDir = path.join(DOCS_DIR, pkg);
    for (const p of paths) {
      console.log(`Syncing ${p}...`);
      // e.g.
      // https://raw.githubusercontent.com/umijs/mako/refs/heads/master/docs/config.md
      const url = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${docsDir}/${p}`;
      const content = await fetch(url).then((res) => res.text());
      const filePath = path.join(repoDir, p);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);
    }
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
