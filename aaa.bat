@echo off
SET SERVER_IP=192.168.0.14
SET USERNAME=hwangwh
SET LOCAL_BUILD_DIR=d:\hwhgit\HWH_BLOG\dist\
SET REMOTE_WEB_DIR=/var/www/html
SET NGINX_CONFIG=default.conf
SET REMOTE_NGINX_CONFIG=/etc/nginx/sites-available/default
SET EXPRESS_SERVER_SCRIPT=server.js
SET REMOTE_TMP_DIR=/tmp/hwh_upload

echo ===============================
echo Deployment started...
echo ===============================

:: 1️⃣ Vue/React 프로젝트 빌드
echo [1/7] Running build process...
CALL npm run build

:: 2️⃣ 파일 업로드 전, 원격 폴더 생성 및 권한 설정
echo [2/7] Preparing remote permissions and folders...
ssh -t %USERNAME%@%SERVER_IP% "sudo mkdir -p %REMOTE_WEB_DIR%/assets %REMOTE_WEB_DIR%/images && sudo chmod -R 755 %REMOTE_WEB_DIR% && sudo chown -R www-data:www-data %REMOTE_WEB_DIR%"

:: 3️⃣ 웹 파일 임시 업로드 후 이동
echo [3/7] Uploading web files to temporary folder...
ssh %USERNAME%@%SERVER_IP% "mkdir -p %REMOTE_TMP_DIR%"
scp -r "%LOCAL_BUILD_DIR%*" %USERNAME%@%SERVER_IP%:%REMOTE_TMP_DIR%/
ssh -t %USERNAME%@%SERVER_IP% "sudo cp -r %REMOTE_TMP_DIR%/* %REMOTE_WEB_DIR%/ && sudo rm -rf %REMOTE_TMP_DIR%"

:: 4️⃣ Nginx 설정 파일 업로드
echo [4/7] Uploading Nginx configuration file...
ssh %USERNAME%@%SERVER_IP% "mkdir -p /home/%USERNAME%/nginx-config"
scp %NGINX_CONFIG% %USERNAME%@%SERVER_IP%:/home/%USERNAME%/nginx-config/default

:: 5️⃣ 서버 설정 적용
echo [5/7] Applying server settings...
ssh -t %USERNAME%@%SERVER_IP% "sudo mv /home/%USERNAME%/nginx-config/default %REMOTE_NGINX_CONFIG% && sudo ln -sf %REMOTE_NGINX_CONFIG% /etc/nginx/sites-enabled/default && sudo systemctl daemon-reload && sudo systemctl restart nginx"

:: 6️⃣ Express 서버 재시작 (PM2 기준)
echo [6/7] Restarting Express server with PM2...
ssh -t %USERNAME%@%SERVER_IP% "if [ ! -f /home/%USERNAME%/stock-proxy-server/%EXPRESS_SERVER_SCRIPT% ]; then echo '🚫 server.js 파일 없음'; exit 1; fi && which pm2 > /dev/null 2>&1 || { echo '🚫 PM2가 설치되어 있지 않습니다. 서버에 접속해서 npm install -g pm2 해주세요.'; exit 1; } && (pm2 describe stock-proxy-server > /dev/null 2>&1 || pm2 start /home/%USERNAME%/stock-proxy-server/%EXPRESS_SERVER_SCRIPT% --name stock-proxy-server) && pm2 restart stock-proxy-server --update-env && pm2 save && pm2 logs --lines 10 --name stock-proxy-server"

:: 7️⃣ 배포 완료
echo ===============================
echo Deployment completed! Check your website.
echo ===============================

pause
