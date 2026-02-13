module.exports = {
	branches: [
		'main',
		{
			name: 'develop',
			prerelease: true,
		},
	],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		[
			'@semantic-release/changelog',
			{
				changelogFile: 'CHANGELOG.md',
			},
		],
		[
			'@semantic-release/npm',
			{
				npmPublish: false,
			},
		],
		[
			'@semantic-release/github',
			{
				successComment: false,
				failComment: false,
				releasedLabels: false,
			},
		],
		[
			'@semantic-release/git',
			{
				assets: ['CHANGELOG.md', 'dist/**'],
				message:
					'chore(release): set `package.json` to ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
	],
};
