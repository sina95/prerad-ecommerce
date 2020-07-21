
cd /home/smadzar/prerad-ecommerce
source venv/bin/activate
pip install -r requirements.txt
./build_production.bash
sudo supervisorctl reload
sudo systemctl reload nginx
