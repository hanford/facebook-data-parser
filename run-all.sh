function pause(){
   read -p "$*"
}
pause 'Only continue if you have both Node and Bower installed! If you do, press [enter]'
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
open "http://localhost:8000" & python -m SimpleHTTPServer
