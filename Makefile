publish:
	@npm run build
	@git add dist/assets
	@git add dist/index.html
	@git add dist/companion.png
	@git add dist/wall.png
	@git commit -m "publish gh-pages"
	@git subtree push --prefix dist origin gh-pages

