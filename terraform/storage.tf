resource "aws_s3_bucket" "sim_bucket" {
  bucket = "dhge-sim-bucket"
  acl    = "private"
}
