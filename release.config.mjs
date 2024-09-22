export default {
  branches: ['feature/semantic-release', 'main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [{ path: 'CHANGELOG.md', label: 'Changelog' }]
      }
    ]
  ]
};
