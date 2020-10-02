resource "aws_s3_bucket" "sim_bucket_up" {
  bucket = var.upload-bucket-name
  acl    = "private"
}

resource "aws_s3_bucket" "sim_bucket_re" {
  bucket = var.result-bucket-name
  acl    = "private"
}
