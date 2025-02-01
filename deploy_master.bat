@echo off
SET SERVER_IP=182.225.135.164
SET USERNAME=hwangwh
SET LOCAL_BUILD_DIR=d:\hwhgit\HWH_BLOG\dist\
SET REMOTE_WEB_DIR=/var/www/html
SET NGINX_CONFIG=default.conf
SET REMOTE_NGINX_CONFIG=/etc/nginx/sites-available/default

echo ===============================
echo Deployment started...
echo ===============================

:: 1️⃣ Build Vue/React project
echo [1/6] Running build process...
CALL npm run build

:: 2️⃣ Apply permission fixes before upload
echo [2/6] Fixing permissions before upload...
ssh -t %USERNAME%@%SERVER_IP% "sudo chmod -R 777 %REMOTE_WEB_DIR% && sudo chown -R www-data:www-data %REMOTE_WEB_DIR%"

:: 3️⃣ Upload web files to server
echo [3/6] Uploading web files...
scp -r "%LOCAL_BUILD_DIR%*" %USERNAME%@%SERVER_IP%:%REMOTE_WEB_DIR%/

:: 4️⃣ Create Nginx config directory if not exists & Upload config file
echo [4/6] Uploading Nginx configuration file
ssh -t %USERNAME%@%SERVER_IP% "mkdir -p /home/%USERNAME%/nginx-config"
scp %NGINX_CONFIG% %USERNAME%@%SERVER_IP%:/home/%USERNAME%/nginx-config/default

:: 5️⃣ Apply settings via SSH
echo [5/6]server settings...
ssh -t %USERNAME%@%SERVER_IP% "sudo mv /home/%USERNAME%/nginx-config/default %REMOTE_NGINX_CONFIG% && sudo ln -sf %REMOTE_NGINX_CONFIG% /etc/nginx/sites-enabled/default && sudo systemctl daemon-reload && sudo systemctl restart nginx"

:: 6️⃣ Deployment complete
echo ===============================
echo Deployment completed! Check your website.
echo ===============================

pause
