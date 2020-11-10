#!/bin/bash

# function to upload one file to s3 bucket
function putS3
{
  path=$1
  file=$2
  aws s3 cp $1/$2 s3://dhge-sim-bucket-upload/ --acl public-read
}
path="$1"
dest="$2"

#setting path and destination for processed files from cli arguments 
for file in "$path"/*; do
  #transfering all object in path to s3
  putS3 "$path" "${file##*/}" "/"
done

# starting simulation on beanstalk
# and remove logs, errors bzw. console output file
wget http://dhge-sim-beanstalk.eba-qwpuumny.eu-central-1.elasticbeanstalk.com/start
rm start

# the beanstalk app uploads the result images
# but the response is 200 even if the upload isn't ready yet
sleep 25

# sync directory content with s3 bucket results 
aws s3 sync s3://dhge-sim-bucket-result "$dest"