publish:
	@npm run build
	@git add dist/assets
	@git add dist/index.html
	@git add dist/companion.png
	@git add dist/wall.png
	@git commit -m "publish gh-pages"
	@git subtree split --prefix dist -b gh-pages-deploy
	@git push origin gh-pages-deploy:gh-pages --force
	@git branch -D gh-pages-deploy

