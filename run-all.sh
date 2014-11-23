function pause(){
   read -p "$*"
}
pause 'Press [enter] to begin the script, make sure you have bower and node installed'
mkdir facebook
echo "Moving facebook.zip"
mv facebook.zip facebook
cd facebook
echo "unzipping facebook.zip"
unzip facebook.zip
sleep 3
echo "Moving facebook.zip"
mv facebook.zip ../
cd ../
echo "Grabbing node modules.." 
npm install
sleep 3
echo "Starting Node Script" 
node app
echo "Getting Bower packages" 
bower i
echo "Starting Server" 
echo "Go to localhost:8000!" 
python -m SimpleHTTPServer