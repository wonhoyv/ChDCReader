cd ..
cordova-hcp build && git add . && git commit -m "Update Resources" && git push github master
python RefreshGithubCachePage.py
pause
