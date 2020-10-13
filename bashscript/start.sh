#!/bin/bash

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
wget http://dhge-sim-beanstalk.eba-qwpuumny.eu-central-1.elasticbeanstalk.com/start
sleep 15
aws s3 sync s3://dhge-sim-bucket-result "$dest"