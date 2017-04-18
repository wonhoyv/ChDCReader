cd /d %~dp0

cd ..
set branch=master
set url=https://raw.githubusercontent.com/ChDC/ChDCNovelReader/master/
echo Branch on %branch% with url %url%

git checkout %branch% && git merge dev && python tools/ChangeEnv.py -e release && npm run build && python tools/ReplaceCRLFtoLF.py -d www && cordova-hcp build && git add . && git commit -m "Update Resources" && git push github %branch% && python tools/RefreshGithubURL.py -d www -u %url%